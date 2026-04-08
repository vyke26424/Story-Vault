import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../store/useCartStore';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ChevronLeft, MapPin, Navigation, Trash2, CreditCard, ShieldCheck, X, CheckCircle } from 'lucide-react';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCartStore();
  
  const [isLocating, setIsLocating] = useState(false);
  const [address, setAddress] = useState('');
  const [showQRModal, setShowQRModal] = useState(false); // State bật/tắt Modal VietQR

  const subtotal = getCartTotal();
  const shippingFee = subtotal > 0 ? 2.50 : 0; 
  const total = subtotal + shippingFee;

  // Giả lập dò tìm vị trí
  const handleAutoLocate = () => {
    setIsLocating(true);
    setTimeout(() => {
      setAddress("60-62 Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh");
      setIsLocating(false);
    }, 1500);
  };

  // Nút Xác nhận đặt hàng (Mở Modal QR)
  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Giỏ hàng của bạn đang trống!");
      return;
    }
    if (!address) {
      alert("Vui lòng nhập hoặc định vị địa chỉ giao hàng!");
      return;
    }
    setShowQRModal(true); // Mở Modal VietQR
  };

  // Nút Tôi đã chuyển khoản (Xử lý dọn giỏ và chuyển trang)
  const handlePaymentSuccess = () => {
    clearCart();
    navigate('/success');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans flex flex-col relative">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        <Link to="/category" className="inline-flex items-center gap-2 text-stone-500 hover:text-amber-800 mb-6 transition-colors font-medium">
          <ChevronLeft size={20} /> Tiếp tục mua sắm
        </Link>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* --- CỘT TRÁI: FORM GIAO HÀNG & BẢN ĐỒ --- */}
          <div className="w-full lg:w-3/5 space-y-6">
            
            {/* Box Bản đồ */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-amber-100">
              <h2 className="text-xl font-bold text-stone-800 mb-6 flex items-center gap-2">
                <MapPin className="text-amber-600" /> Vị trí giao hàng
              </h2>

              <div className="w-full h-64 bg-stone-100 rounded-2xl overflow-hidden mb-4 border border-stone-200 relative group">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4602324211116!2d106.6999201147183!3d10.776019492321484!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4728fba81b%3A0x8e8201b1e22066d7!2sSaigon%20Centre!5e0!3m2!1sen!2s!4v1689000000000!5m2!1sen!2s" 
                  width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Map Picker"
                ></iframe>
                <div className="absolute inset-0 bg-amber-900/5 pointer-events-none group-hover:bg-transparent transition-colors"></div>
              </div>

              <div className="space-y-4">
                <button 
                  type="button" onClick={handleAutoLocate} disabled={isLocating}
                  className="w-full py-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
                >
                  {isLocating ? <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div> : <Navigation size={18} />}
                  {isLocating ? "Đang dò tìm vệ tinh..." : "Sử dụng vị trí hiện tại của tôi"}
                </button>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">Số nhà, Tên đường, Phường/Xã</label>
                  <input 
                    type="text" value={address} onChange={(e) => setAddress(e.target.value)}
                    placeholder="VD: 123 Đường Sách, Phường Bình Duyệt..."
                    className="w-full bg-white border border-amber-200 rounded-xl px-4 py-3 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-shadow" required
                  />
                </div>
              </div>
            </div>

            {/* Box Thông tin liên hệ */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-amber-100">
               <h2 className="text-xl font-bold text-stone-800 mb-6 flex items-center gap-2">
                <ShieldCheck className="text-amber-600" /> Thông tin người nhận
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">Họ và tên</label>
                  <input type="text" className="w-full bg-white border border-amber-200 rounded-xl px-4 py-3 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="Tên người nhận" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">Số điện thoại</label>
                  <input type="tel" className="w-full bg-white border border-amber-200 rounded-xl px-4 py-3 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="0909 xxx xxx" />
                </div>
              </div>
            </div>

          </div>

          {/* --- CỘT PHẢI: TÓM TẮT ĐƠN HÀNG --- */}
          <div className="w-full lg:w-2/5">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-amber-100 sticky top-24">
              <h2 className="text-xl font-bold text-stone-800 mb-6 border-b border-amber-100 pb-4">Tóm tắt đơn hàng</h2>

              <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-amber-200">
                {cart.length === 0 ? (
                  <p className="text-stone-500 text-center py-8 italic">Giỏ hàng trống.</p>
                ) : (
                  cart.map((item, index) => (
                    <div key={`${item.id}-${item.volume}-${index}`} className="flex gap-4 items-center bg-amber-50/50 p-3 rounded-2xl border border-amber-50">
                      <img src={item.image} alt={item.title} className="w-16 h-20 object-cover rounded-lg shadow-sm" />
                      <div className="flex-1">
                        <h4 className="font-bold text-stone-800 text-sm line-clamp-1">{item.title}</h4>
                        <p className="text-xs text-amber-700 font-medium mb-2">{item.volume}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center bg-white border border-amber-200 rounded-lg overflow-hidden h-7">
                            <button onClick={() => updateQuantity(item.id, item.volume, item.quantity - 1)} className="px-2 text-stone-500 hover:bg-stone-100">-</button>
                            <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.volume, item.quantity + 1)} className="px-2 text-stone-500 hover:bg-stone-100">+</button>
                          </div>
                          <span className="font-black text-stone-800">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(item.id, item.volume)} className="p-2 text-stone-400 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-amber-100 pt-4 space-y-3 mb-6 text-sm">
                <div className="flex justify-between text-stone-600"><span>Tạm tính</span><span className="font-bold text-stone-800">${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-stone-600"><span>Phí vận chuyển</span><span className="font-bold text-stone-800">{shippingFee > 0 ? `$${shippingFee.toFixed(2)}` : 'Miễn phí'}</span></div>
                <div className="flex justify-between text-lg font-black text-amber-900 border-t border-amber-100 pt-3"><span>Tổng cộng</span><span>${total.toFixed(2)}</span></div>
              </div>

              <button onClick={handlePlaceOrder} className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md">
                <CreditCard size={20} /> Xác nhận đặt hàng
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* --- MODAL THANH TOÁN VIETQR --- */}
      {showQRModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl relative animate-in fade-in zoom-in duration-300">
            
            <button onClick={() => setShowQRModal(false)} className="absolute top-4 right-4 text-stone-400 hover:text-stone-800 transition-colors">
              <X size={24} />
            </button>

            <div className="text-center mb-6 mt-2">
              <h3 className="text-2xl font-black text-amber-900 mb-1">Thanh Toán VietQR</h3>
              <p className="text-stone-500 text-sm">Quét mã bằng ứng dụng ngân hàng</p>
            </div>

            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 flex justify-center mb-6">
              {/* Fake tỉ giá 1$ = 25,000đ để ra mã QR số tiền VND */}
              <img src={`https://img.vietqr.io/image/970436-0123456789-compact2.png?amount=${Math.round(total * 25000)}&addInfo=StoryVault%20Order&accountName=STORY%20VAULT`} alt="VietQR Code" className="w-full h-auto rounded-xl shadow-sm" />
            </div>

            <div className="text-center mb-8">
              <p className="text-stone-500 text-sm mb-1">Tổng thanh toán</p>
              <p className="text-3xl font-black text-stone-900">${total.toFixed(2)}</p>
            </div>

            <button onClick={handlePaymentSuccess} className="w-full bg-amber-800 hover:bg-amber-900 text-white font-bold py-4 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2">
               Tôi đã chuyển khoản <CheckCircle size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;