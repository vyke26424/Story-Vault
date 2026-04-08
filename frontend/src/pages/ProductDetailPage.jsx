import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct } from '../hooks/useProducts';
import useCartStore from '../store/useCartStore'; // Import Zustand Store
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ShoppingCart, Heart, Share2, ChevronLeft, Minus, Plus, Star, User } from 'lucide-react';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { product, isLoading } = useProduct(id);
  
  const [quantity, setQuantity] = useState(1);
  const [selectedVolume, setSelectedVolume] = useState(''); // State lưu Tập được chọn
  
  // Lấy hàm addToCart từ Zustand
  const addToCart = useCartStore((state) => state.addToCart);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center font-bold text-amber-800">Đang tải thông tin...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center font-bold text-red-500">Không tìm thấy sách!</div>;

  // Set mặc định chọn Tập 1 khi vừa load xong data
  if (product.volumes && selectedVolume === '') {
      setSelectedVolume(product.volumes[0]);
  }

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVolume);
    // Hiệu ứng UX nhỏ báo thành công
    alert(`🛒 Đã thêm ${quantity} cuốn ${product.title} (${selectedVolume}) vào giỏ!`);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans flex flex-col">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        <Link to="/category" className="inline-flex items-center gap-2 text-stone-500 hover:text-amber-800 mb-6 transition-colors font-medium">
          <ChevronLeft size={20} /> Cửa hàng
        </Link>

        {/* --- KHU VỰC THÔNG TIN SÁCH --- */}
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-amber-100 mb-10">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
            
            {/* Ảnh sản phẩm */}
            <div className="w-full lg:w-2/5 shrink-0">
              <div className="rounded-2xl overflow-hidden shadow-md border border-amber-100 aspect-[3/4]">
                <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Chi tiết & Form mua hàng */}
            <div className="w-full lg:w-3/5 flex flex-col">
              <div className="mb-2"><span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full uppercase">{product.category}</span></div>
              <h1 className="text-3xl md:text-4xl font-black text-stone-900 mb-2">{product.title}</h1>
              <p className="text-lg text-amber-700 font-medium mb-4">Tác giả: {product.author}</p>
              
              <div className="flex items-center gap-2 mb-6 text-yellow-500">
                 <Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} /><Star size={20} />
                 <span className="text-stone-500 text-sm ml-2">(4.5/5 - {product.reviews.length} đánh giá)</span>
              </div>

              <div className="text-3xl font-black text-stone-900 mb-6">${product.price.toFixed(2)}</div>
              <p className="text-stone-600 mb-8 leading-relaxed">{product.description}</p>

              {/* Lựa chọn Tập (Volumes) */}
              {product.volumes && (
                <div className="mb-8">
                  <h3 className="font-bold text-stone-800 mb-3">Chọn Tập:</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.volumes.map(vol => (
                      <button 
                        key={vol}
                        onClick={() => setSelectedVolume(vol)}
                        className={`px-4 py-2 rounded-xl border-2 font-bold transition-all ${
                          selectedVolume === vol 
                            ? 'border-amber-800 bg-amber-50 text-amber-900' 
                            : 'border-stone-200 text-stone-500 hover:border-amber-300'
                        }`}
                      >
                        {vol}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <div className="flex items-center bg-stone-100 rounded-xl border border-stone-200 overflow-hidden h-12">
                  <button onClick={() => setQuantity(q => q > 1 ? q - 1 : 1)} className="px-4 h-full hover:bg-stone-200 text-stone-600"><Minus size={18} /></button>
                  <span className="w-12 text-center font-bold">{quantity}</span>
                  <button onClick={() => setQuantity(q => q < product.stock ? q + 1 : q)} className="px-4 h-full hover:bg-stone-200 text-stone-600"><Plus size={18} /></button>
                </div>

                <button onClick={handleAddToCart} className="flex-1 h-12 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95">
                  <ShoppingCart size={20} /> Thêm vào giỏ
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- KHU VỰC ĐÁNH GIÁ (REVIEWS) --- */}
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-amber-100">
          <h2 className="text-2xl font-black text-stone-800 mb-8 border-b border-amber-100 pb-4">Đánh giá sản phẩm</h2>
          
          <div className="space-y-6">
            {product.reviews.map(review => (
              <div key={review.id} className="border-b border-stone-100 pb-6 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-700">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-stone-800 text-sm">{review.user}</p>
                      <p className="text-xs text-stone-400">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                    ))}
                  </div>
                </div>
                <p className="text-stone-600 text-sm ml-13 pl-13">{review.comment}</p>
              </div>
            ))}
          </div>

          {/* Form viết đánh giá */}
          <div className="mt-8 bg-amber-50/50 p-6 rounded-2xl border border-amber-100">
            <h3 className="font-bold text-stone-800 mb-4">Viết đánh giá của bạn</h3>
            <textarea 
              className="w-full bg-white border border-amber-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-amber-500 outline-none mb-4 min-h-[100px]"
              placeholder="Bạn nghĩ gì về tập truyện này?"
            ></textarea>
            <button className="bg-stone-800 text-white font-bold px-6 py-2 rounded-xl text-sm hover:bg-stone-900 transition-colors">
              Gửi Đánh Giá
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;