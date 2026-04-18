import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import useCartStore from '../store/useCartStore';
import { ArrowLeft, MapPin, Truck, CreditCard, Navigation, Loader2 } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import axiosClient from '../utils/axiosClient'; // NHỚ IMPORT AXIOS CLIENT

let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

const fetchAddressFromCoords = async (lat, lng, setAddressInput) => {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
    const data = await res.json();
    if (data && data.address) {
      const street = [data.address.house_number, data.address.road, data.address.quarter, data.address.suburb].filter(Boolean).join(', ');
      setAddressInput(street || data.display_name);
    }
  } catch (error) {
    console.error("Lỗi khi lấy địa chỉ:", error);
  }
};

const LocationMarker = ({ position, setPosition, setAddressInput }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      fetchAddressFromCoords(lat, lng, setAddressInput);
    },
  });
  return position ? <Marker position={position}></Marker> : null;
};

const MapFlyTo = ({ center }) => {
  const map = useMap();
  useEffect(() => { map.flyTo(center, 16); }, [center, map]);
  return null;
};

const CheckoutPage = () => {
  const { user } = useAuthStore();
  const { cart, removeSelectedItems } = useCartStore(); // Lấy hàm xóa giỏ hàng
  const location = useLocation();
  const navigate = useNavigate();

  const selectedIds = location.state?.selectedIds || [];
  const checkoutItems = cart.filter(item => selectedIds.includes(item.id));
  const totalPrice = checkoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = 30000;

  useEffect(() => { if (checkoutItems.length === 0) navigate('/cart'); }, [checkoutItems, navigate]);

  // STATE FORM
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  
  const [addressInput, setAddressInput] = useState('');
  const [phone, setPhone] = useState(''); // Thêm state số điện thoại
  const [note, setNote] = useState(''); // Thêm state ghi chú
  
  const [mapPosition, setMapPosition] = useState([10.8231, 106.6297]); 
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Trạng thái đang gọi API

  useEffect(() => { fetch('https://provinces.open-api.vn/api/p/').then(res => res.json()).then(data => setProvinces(data)); }, []);
  useEffect(() => { if (selectedProvince) fetch(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`).then(res => res.json()).then(data => { setDistricts(data.districts); setWards([]); setSelectedDistrict(''); setSelectedWard(''); }); }, [selectedProvince]);
  useEffect(() => { if (selectedDistrict) fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`).then(res => res.json()).then(data => setWards(data.wards)); }, [selectedDistrict]);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) return alert('Trình duyệt của bạn không hỗ trợ định vị GPS.');
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setMapPosition([latitude, longitude]);
        fetchAddressFromCoords(latitude, longitude, setAddressInput);
        setIsGettingLocation(false);
      },
      (error) => {
        alert('Vui lòng cho phép quyền truy cập vị trí trên trình duyệt!');
        setIsGettingLocation(false);
      }
    );
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!phone) return alert("Vui lòng nhập số điện thoại");
    
    // Tìm Tên Tỉnh/Huyện/Xã từ cái Mã code đang được chọn
    const provinceName = provinces.find(p => p.code == selectedProvince)?.name || '';
    const districtName = districts.find(d => d.code == selectedDistrict)?.name || '';
    const wardName = wards.find(w => w.code == selectedWard)?.name || '';

    // Gom dữ liệu đúng chuẩn DTO của Backend
    const payload = {
      phone: phone,
      street: addressInput,
      ward: wardName,
      district: districtName,
      city: provinceName,
      totalAmount: totalPrice,
      shippingFee: shippingFee,
      finalAmount: totalPrice + shippingFee,
      note: note,
      paymentMethod: 'COD', // Tạm thời hardcode COD
      items: checkoutItems.map(item => ({
        volumeId: item.id,
        quantity: item.quantity,
        price: item.price
      }))
    };

    try {
      setIsSubmitting(true);
      // Gọi API sang Backend
      const response = await axiosClient.post('/order', payload);
      
      alert('Tạo đơn hàng thành công! Mã đơn: ' + response.data?.data?.id);
      
      // Xóa các cuốn sách đã mua khỏi giỏ hàng
      removeSelectedItems(selectedIds);
      
      // Chuyển hướng về trang chủ (hoặc trang lịch sử đơn hàng sau này)
      navigate('/'); 
    } catch (error) {
      console.error("Lỗi đặt hàng:", error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 bg-sv-cream min-h-screen">
      <Link to="/cart" className="inline-flex items-center gap-2 text-gray-500 hover:text-sv-brown font-bold mb-6 transition-colors"><ArrowLeft size={20} /> Quay lại giỏ hàng</Link>
      <h1 className="text-3xl font-black text-sv-brown mb-8 flex items-center gap-3"><Truck className="text-sv-tan" size={32} /> Hoàn tất đơn hàng</h1>

      <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          
          <div className="bg-white border border-sv-tan rounded-3xl p-6 shadow-sm">
            <h2 className="text-xl font-black text-sv-brown mb-4 border-b border-sv-pale pb-3">Thông tin người nhận</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-bold text-sv-brown mb-1.5">Họ và tên</label><input type="text" required defaultValue={user?.name || ''} className="w-full bg-sv-pale border border-sv-tan text-sv-brown rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sv-brown" placeholder="Nhập họ tên đầy đủ" /></div>
              <div><label className="block text-sm font-bold text-sv-brown mb-1.5">Số điện thoại</label><input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-sv-pale border border-sv-tan text-sv-brown rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sv-brown" placeholder="Ví dụ: 0912345678" /></div>
            </div>
          </div>

          <div className="bg-white border border-sv-tan rounded-3xl p-6 shadow-sm">
            <h2 className="text-xl font-black text-sv-brown mb-4 border-b border-sv-pale pb-3">Địa chỉ giao hàng</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div><label className="block text-sm font-bold text-sv-brown mb-1.5">Tỉnh / Thành phố</label><select required value={selectedProvince} onChange={(e) => setSelectedProvince(e.target.value)} className="w-full bg-sv-pale border border-sv-tan text-sv-brown rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sv-brown"><option value="">Chọn Tỉnh/Thành</option>{provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}</select></div>
              <div><label className="block text-sm font-bold text-sv-brown mb-1.5">Quận / Huyện</label><select required value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} disabled={!selectedProvince} className="w-full bg-sv-pale border border-sv-tan text-sv-brown rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sv-brown disabled:opacity-50"><option value="">Chọn Quận/Huyện</option>{districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}</select></div>
              <div><label className="block text-sm font-bold text-sv-brown mb-1.5">Phường / Xã</label><select required value={selectedWard} onChange={(e) => setSelectedWard(e.target.value)} disabled={!selectedDistrict} className="w-full bg-sv-pale border border-sv-tan text-sv-brown rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sv-brown disabled:opacity-50"><option value="">Chọn Phường/Xã</option>{wards.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}</select></div>
            </div>
            <div>
              <label className="block text-sm font-bold text-sv-brown mb-1.5">Số nhà, Tên đường</label>
              <input type="text" required value={addressInput} onChange={(e) => setAddressInput(e.target.value)} className="w-full bg-sv-pale border border-sv-tan text-sv-brown rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sv-brown" placeholder="Số 123 Đường ABC... (Hoặc chọn trên bản đồ)" />
            </div>
          </div>

          <div className="bg-white border border-sv-tan rounded-3xl p-6 shadow-sm">
            <h2 className="text-xl font-black text-sv-brown mb-4 border-b border-sv-pale pb-3">Ghi chú cho đơn hàng</h2>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows="3" className="w-full bg-sv-pale border border-sv-tan text-sv-brown rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sv-brown" placeholder="Ví dụ: Giao vào giờ hành chính, gọi trước khi giao..."></textarea>
          </div>

          <div className="bg-white border border-sv-tan rounded-3xl p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4 border-b border-sv-pale pb-3">
              <h2 className="text-xl font-black text-sv-brown">Ghim vị trí trên bản đồ</h2>
              <button type="button" onClick={handleGetCurrentLocation} disabled={isGettingLocation} className="text-sm font-bold bg-sv-wheat hover:bg-sv-tan text-sv-brown px-4 py-2 rounded-full flex items-center gap-2 transition-colors disabled:opacity-50">
                <Navigation size={16}/> {isGettingLocation ? 'Đang định vị...' : 'Lấy vị trí của tôi'}
              </button>
            </div>
            <div className="w-full h-[350px] rounded-2xl overflow-hidden border-2 border-sv-tan z-0 relative">
              <MapContainer center={mapPosition} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%', zIndex: 1 }}>
                <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapFlyTo center={mapPosition} />
                <LocationMarker position={mapPosition} setPosition={setMapPosition} setAddressInput={setAddressInput} />
              </MapContainer>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[360px] shrink-0">
          <div className="bg-white border-2 border-sv-tan rounded-3xl p-6 sticky top-24 shadow-lg">
            <h2 className="text-xl font-black text-sv-brown mb-4 border-b border-sv-tan pb-3 flex items-center gap-2"><CreditCard size={24} /> Đơn hàng ({checkoutItems.length} sp)</h2>
            <div className="max-h-60 overflow-y-auto pr-2 custom-scrollbar space-y-4 mb-6">
              {checkoutItems.map(item => (
                <div key={item.id} className="flex gap-3">
                  <img src={item.coverImage} alt={item.title} className="w-16 h-24 object-cover rounded-lg border border-sv-pale" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sv-brown text-sm line-clamp-2 leading-snug">{item.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">SL: {item.quantity}</p>
                    <p className="font-black text-sv-brown mt-1">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-3 font-medium text-gray-600 border-t border-sv-pale pt-4 mb-4">
              <div className="flex justify-between"><span>Tạm tính</span><span className="font-bold text-sv-brown">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}</span></div>
              <div className="flex justify-between"><span>Phí ship</span><span className="font-bold text-sv-brown">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(shippingFee)}</span></div>
            </div>
            
            <div className="flex justify-between items-center border-t border-sv-tan pt-4 mb-6">
              <span className="text-lg font-bold text-sv-brown">Tổng cộng</span>
              <span className="text-2xl font-black text-sv-brown">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice + shippingFee)}</span>
            </div>
            
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-sv-brown text-white font-black py-4 rounded-xl transition-all shadow-md hover:bg-opacity-90 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {isSubmitting ? <><Loader2 className="animate-spin" size={20} /> Đang xử lý...</> : 'Xác nhận Đặt hàng (COD)'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;