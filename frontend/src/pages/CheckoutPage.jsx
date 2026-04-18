import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import useCartStore from "../store/useCartStore";
import {
  ArrowLeft,
  MapPin,
  Truck,
  CreditCard,
  Navigation,
  Loader2,
  QrCode,
  CheckCircle,
  X,
} from "lucide-react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import axiosClient from "../utils/axiosClient";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const fetchAddressFromCoords = async (lat, lng, setAddressInput) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
    );
    const data = await res.json();
    if (data && data.address) {
      const street = [
        data.address.house_number,
        data.address.road,
        data.address.quarter,
        data.address.suburb,
      ]
        .filter(Boolean)
        .join(", ");
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
  useEffect(() => {
    map.flyTo(center, 16);
  }, [center, map]);
  return null;
};

const CheckoutPage = () => {
  const { user } = useAuthStore();
  const { cart, removeSelectedItems } = useCartStore();
  const location = useLocation();
  const navigate = useNavigate();

  const selectedIds = location.state?.selectedIds || [];
  const checkoutItems = cart.filter((item) => selectedIds.includes(item.id));
  const totalPrice = checkoutItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  // Sếp yêu cầu: Cứ có 2 món hàng trở lên là free ship
  const shippingFee = checkoutItems.length >= 2 ? 0 : 30000;
  const finalAmount = totalPrice + shippingFee;

  // 👉 THÊM STATE BẢO VỆ: Đánh dấu đã đặt hàng thành công
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  // 👉 SỬA ĐIỀU KIỆN: Chỉ đá về trang /cart nếu CHƯA đặt hàng mà giỏ đã trống
  useEffect(() => {
    if (!isOrderPlaced && checkoutItems.length === 0) navigate("/cart");
  }, [checkoutItems, navigate, isOrderPlaced]);

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  const [addressInput, setAddressInput] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [showQR, setShowQR] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState("");

  const [mapPosition, setMapPosition] = useState([10.8231, 106.6297]);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/p/")
      .then((res) => res.json())
      .then((data) => setProvinces(data));
  }, []);
  useEffect(() => {
    if (selectedProvince)
      fetch(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`)
        .then((res) => res.json())
        .then((data) => {
          setDistricts(data.districts);
          setWards([]);
          setSelectedDistrict("");
          setSelectedWard("");
        });
  }, [selectedProvince]);
  useEffect(() => {
    if (selectedDistrict)
      fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`)
        .then((res) => res.json())
        .then((data) => setWards(data.wards));
  }, [selectedDistrict]);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation)
      return alert("Trình duyệt của bạn không hỗ trợ định vị GPS.");
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setMapPosition([latitude, longitude]);
        fetchAddressFromCoords(latitude, longitude, setAddressInput);
        setIsGettingLocation(false);
      },
      () => {
        alert("Vui lòng cho phép quyền truy cập vị trí trên trình duyệt!");
        setIsGettingLocation(false);
      },
    );
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!phone) return alert("Vui lòng nhập số điện thoại");

    const provinceName =
      provinces.find((p) => p.code == selectedProvince)?.name || "";
    const districtName =
      districts.find((d) => d.code == selectedDistrict)?.name || "";
    const wardName = wards.find((w) => w.code == selectedWard)?.name || "";

    const payload = {
      phone: phone,
      street: addressInput,
      ward: wardName,
      district: districtName,
      city: provinceName,
      totalAmount: totalPrice,
      shippingFee: shippingFee,
      finalAmount: finalAmount,
      note: note,
      paymentMethod: paymentMethod,
      items: checkoutItems.map((item) => ({
        volumeId: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    try {
      setIsSubmitting(true);
      const response = await axiosClient.post("/order", payload);
      const orderId = response.data?.data?.id || response.data?.id || "UNKNOWN";

      // 👉 BẬT KHIÊN BẢO VỆ LÊN TRƯỚC KHI XÓA GIỎ HÀNG
      setIsOrderPlaced(true);

      removeSelectedItems(selectedIds);

      if (paymentMethod === "VIETQR") {
        setCreatedOrderId(orderId);
        setShowQR(true);
      } else {
        alert("Tạo đơn hàng thành công! Mã đơn: " + orderId);
        navigate(`/order-success/${orderId}`);
      }
    } catch (error) {
      console.error("Lỗi đặt hàng:", error);
      alert(
        error.response?.data?.message ||
          "Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseQR = () => {
    const isConfirm = window.confirm(
      "Thanh toán của bạn chưa hoàn tất!\n\nĐơn hàng đã được lưu lại nhưng có thể bị hủy nếu không được thanh toán sớm. Bạn có chắc chắn muốn thoát không?",
    );

    if (isConfirm) {
      setShowQR(false);
      // Tạm thời đá về trang chủ, lát nữa làm trang Lịch sử đơn hàng xong mình sẽ đổi thành navigate('/profile/orders')
      navigate("/");
    }
  };

  // Nút "Tôi đã thanh toán xong" thì không cần cảnh báo, cho đi luôn
  const handlePaidSuccess = () => {
    alert(
      "Hệ thống đã ghi nhận yêu cầu của bạn!\n\nĐơn hàng sẽ được chuyển sang trạng thái Đã Thanh Toán ngay sau khi chúng tôi xác nhận được giao dịch ngân hàng (thường mất 1-3 phút).",
    );
    setShowQR(false);
    navigate(`/order-success/${createdOrderId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 bg-sv-cream min-h-screen relative">
      <Link
        to="/cart"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-sv-brown font-bold mb-6 transition-colors"
      >
        <ArrowLeft size={20} /> Quay lại giỏ hàng
      </Link>
      <h1 className="text-3xl font-black text-sv-brown mb-8 flex items-center gap-3">
        <Truck className="text-sv-tan" size={32} /> Hoàn tất đơn hàng
      </h1>

      <form
        onSubmit={handlePlaceOrder}
        className="flex flex-col lg:flex-row gap-8"
      >
        <div className="flex-1 space-y-6">
          <div className="bg-white border border-sv-tan rounded-3xl p-6 shadow-sm">
            <h2 className="text-xl font-black text-sv-brown mb-4 border-b border-sv-pale pb-3">
              Thông tin người nhận
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-sv-brown mb-1.5">
                  Họ và tên
                </label>
                <input
                  type="text"
                  required
                  defaultValue={user?.name || ""}
                  className="w-full bg-sv-pale border border-sv-tan text-sv-brown rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sv-brown"
                  placeholder="Nhập họ tên đầy đủ"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-sv-brown mb-1.5">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-sv-pale border border-sv-tan text-sv-brown rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sv-brown"
                  placeholder="Ví dụ: 0912345678"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-sv-tan rounded-3xl p-6 shadow-sm">
            <h2 className="text-xl font-black text-sv-brown mb-4 border-b border-sv-pale pb-3">
              Địa chỉ giao hàng
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-bold text-sv-brown mb-1.5">
                  Tỉnh / Thành phố
                </label>
                <select
                  required
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  className="w-full bg-sv-pale border border-sv-tan text-sv-brown rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sv-brown"
                >
                  <option value="">Chọn Tỉnh/Thành</option>
                  {provinces.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-sv-brown mb-1.5">
                  Quận / Huyện
                </label>
                <select
                  required
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  disabled={!selectedProvince}
                  className="w-full bg-sv-pale border border-sv-tan text-sv-brown rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sv-brown disabled:opacity-50"
                >
                  <option value="">Chọn Quận/Huyện</option>
                  {districts.map((d) => (
                    <option key={d.code} value={d.code}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-sv-brown mb-1.5">
                  Phường / Xã
                </label>
                <select
                  required
                  value={selectedWard}
                  onChange={(e) => setSelectedWard(e.target.value)}
                  disabled={!selectedDistrict}
                  className="w-full bg-sv-pale border border-sv-tan text-sv-brown rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sv-brown disabled:opacity-50"
                >
                  <option value="">Chọn Phường/Xã</option>
                  {wards.map((w) => (
                    <option key={w.code} value={w.code}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-sv-brown mb-1.5">
                Số nhà, Tên đường
              </label>
              <input
                type="text"
                required
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
                className="w-full bg-sv-pale border border-sv-tan text-sv-brown rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sv-brown"
                placeholder="Số 123 Đường ABC... (Hoặc chọn trên bản đồ)"
              />
            </div>
          </div>

          <div className="bg-white border border-sv-tan rounded-3xl p-6 shadow-sm">
            <h2 className="text-xl font-black text-sv-brown mb-4 border-b border-sv-pale pb-3">
              Phương thức thanh toán
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label
                className={`cursor-pointer border-2 rounded-2xl p-4 flex items-center gap-3 transition-all ${paymentMethod === "COD" ? "border-sv-brown bg-sv-wheat" : "border-sv-pale hover:border-sv-tan"}`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                  className="w-5 h-5 text-sv-brown focus:ring-sv-brown"
                />
                <div className="flex flex-col">
                  <span className="font-bold text-sv-brown">
                    Thanh toán khi nhận hàng (COD)
                  </span>
                  <span className="text-sm text-gray-500 font-medium">
                    Thanh toán bằng tiền mặt khi giao hàng
                  </span>
                </div>
              </label>
              <label
                className={`cursor-pointer border-2 rounded-2xl p-4 flex items-center gap-3 transition-all ${paymentMethod === "VIETQR" ? "border-sv-brown bg-sv-wheat" : "border-sv-pale hover:border-sv-tan"}`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="VIETQR"
                  checked={paymentMethod === "VIETQR"}
                  onChange={() => setPaymentMethod("VIETQR")}
                  className="w-5 h-5 text-sv-brown focus:ring-sv-brown"
                />
                <div className="flex flex-col">
                  <span className="font-bold text-sv-brown flex items-center gap-1">
                    Chuyển khoản <QrCode size={16} />
                  </span>
                  <span className="text-sm text-gray-500 font-medium">
                    Quét mã VietQR tự động nhập số tiền
                  </span>
                </div>
              </label>
            </div>
          </div>

          <div className="bg-white border border-sv-tan rounded-3xl p-6 shadow-sm">
            <h2 className="text-xl font-black text-sv-brown mb-4 border-b border-sv-pale pb-3">
              Ghi chú cho đơn hàng
            </h2>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows="3"
              className="w-full bg-sv-pale border border-sv-tan text-sv-brown rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sv-brown"
              placeholder="Ví dụ: Giao vào giờ hành chính, gọi trước khi giao..."
            ></textarea>
          </div>

          <div className="bg-white border border-sv-tan rounded-3xl p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4 border-b border-sv-pale pb-3">
              <h2 className="text-xl font-black text-sv-brown">
                Ghim vị trí trên bản đồ
              </h2>
              <button
                type="button"
                onClick={handleGetCurrentLocation}
                disabled={isGettingLocation}
                className="text-sm font-bold bg-sv-wheat hover:bg-sv-tan text-sv-brown px-4 py-2 rounded-full flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <Navigation size={16} />{" "}
                {isGettingLocation ? "Đang định vị..." : "Lấy vị trí của tôi"}
              </button>
            </div>
            <div className="w-full h-[350px] rounded-2xl overflow-hidden border-2 border-sv-tan z-0 relative">
              <MapContainer
                center={mapPosition}
                zoom={13}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%", zIndex: 1 }}
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapFlyTo center={mapPosition} />
                <LocationMarker
                  position={mapPosition}
                  setPosition={setMapPosition}
                  setAddressInput={setAddressInput}
                />
              </MapContainer>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[360px] shrink-0">
          <div className="bg-white border-2 border-sv-tan rounded-3xl p-6 sticky top-24 shadow-lg">
            <h2 className="text-xl font-black text-sv-brown mb-4 border-b border-sv-tan pb-3 flex items-center gap-2">
              <CreditCard size={24} /> Đơn hàng ({checkoutItems.length} sp)
            </h2>
            <div className="max-h-60 overflow-y-auto pr-2 custom-scrollbar space-y-4 mb-6">
              {checkoutItems.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-16 h-24 object-cover rounded-lg border border-sv-pale"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sv-brown text-sm line-clamp-2 leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      SL: {item.quantity}
                    </p>
                    <p className="font-black text-sv-brown mt-1">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 font-medium text-gray-600 border-t border-sv-pale pt-4 mb-4">
              <div className="flex justify-between">
                <span>Tạm tính</span>
                <span className="font-bold text-sv-brown">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(totalPrice)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Phí ship</span>
                <span className="font-bold text-sv-brown">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(shippingFee)}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-sv-tan pt-4 mb-6">
              <span className="text-lg font-bold text-sv-brown">Tổng cộng</span>
              <span className="text-2xl font-black text-sv-brown">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(finalAmount)}
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-sv-brown text-white font-black py-4 rounded-xl transition-all shadow-md hover:bg-opacity-90 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Đang xử lý...
                </>
              ) : (
                `Đặt hàng (${paymentMethod})`
              )}
            </button>
          </div>
        </div>
      </form>

      {showQR && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl overflow-hidden border border-sv-tan scale-100 animate-in zoom-in-95 duration-200">
            <div className="bg-sv-wheat p-5 flex justify-between items-center border-b border-sv-tan">
              <h3 className="font-black text-sv-brown text-xl flex items-center gap-2">
                <CheckCircle className="text-green-600" /> Đặt hàng thành công!
              </h3>
              <button
                onClick={handleCloseQR}
                className="p-2 hover:bg-sv-tan rounded-full transition-colors text-sv-brown"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 text-center space-y-4">
              <p className="text-gray-600 font-medium">
                Vui lòng mở ứng dụng ngân hàng để quét mã QR bên dưới.
              </p>

              <div className="border-4 border-sv-brown rounded-2xl overflow-hidden inline-block p-2 bg-white">
                <img
                  src={`https://img.vietqr.io/image/MB-0934123123-compact2.png?amount=${finalAmount}&addInfo=Don hang ${createdOrderId}&accountName=STORY VAULT`}
                  alt="Mã QR Thanh Toán"
                  className="w-64 h-64 object-contain"
                />
              </div>

              <div className="bg-sv-pale rounded-xl p-4 text-left border border-sv-tan">
                <p className="text-sm text-gray-500 mb-1">Mã đơn hàng:</p>
                <p className="font-black text-sv-brown mb-3">
                  {createdOrderId}
                </p>
                <p className="text-sm text-gray-500 mb-1">
                  Số tiền cần chuyển:
                </p>
                <p className="font-black text-red-600 text-xl">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(finalAmount)}
                </p>
              </div>

              <button
                onClick={handlePaidSuccess}
                className="w-full bg-sv-brown hover:bg-opacity-90 text-white font-bold py-3 rounded-xl transition-all shadow-md"
              >
                Tôi đã thanh toán xong
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
