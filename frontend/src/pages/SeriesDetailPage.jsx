import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axiosClient from "../utils/axiosClient";
import useCartStore from "../store/useCartStore";
import useAuthStore from "../store/useAuthStore";
import {
  Loader2,
  ArrowLeft,
  ShoppingCart,
  X,
  ZoomIn,
  Star,
  Send,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Truck,
  ShieldCheck,
  RotateCcw,
  Zap
} from "lucide-react";

const SeriesDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [series, setSeries] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [zoomedImage, setZoomedImage] = useState(null);

  const [currentVolumeIndex, setCurrentVolumeIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [relatedVolumes, setRelatedVolumes] = useState([]);

  const [rating, setRating] = useState(5);
  const [reviewContent, setReviewContent] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get(`/series/${slug}`);
      const actualData = res.data?.data || res.data || res;
      setSeries(actualData);
      
      setCurrentVolumeIndex(0); 
      setCurrentImageIndex(0);
      setQuantity(1);
      setIsDescExpanded(false);

      if (actualData?.type) {
        fetchRelated(actualData.type, actualData.id);
      }
    } catch (err) {
      console.error("Lỗi chi tiết:", err);
      setError("Không tìm thấy truyện hoặc có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  const fetchRelated = async (type, currentId) => {
    try {
      const res = await axiosClient.get(`/search?type=${type}&limit=30`);
      const payload = res.data?.data || res.data;
      const dataList = payload.data || payload;

      if (Array.isArray(dataList)) {
        const filtered = dataList.filter(
          (vol) => vol.seriesId !== currentId && vol.series?.id !== currentId,
        );
        const shuffled = filtered.sort(() => 0.5 - Math.random()).slice(0, 12);
        setRelatedVolumes(shuffled);
      }
    } catch (error) {
      console.error("Lỗi lấy truyện liên quan:", error);
    }
  };

  useEffect(() => {
    fetchDetail();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  useEffect(() => {
    document.body.style.overflow = zoomedImage ? "hidden" : "auto";
    return () => document.body.style.overflow = "auto";
  }, [zoomedImage]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewContent.trim()) return alert("Vui lòng nhập nội dung đánh giá!");

    try {
      setSubmittingReview(true);
      await axiosClient.post("/reviews", { seriesId: series.id, rating, content: reviewContent });
      alert("Cảm ơn bạn đã đánh giá bộ truyện này!");
      setReviewContent("");
      setRating(5);
      fetchDetail();
    } catch (error) {
      alert(error.response?.data?.message || "Có lỗi xảy ra khi gửi đánh giá!");
    } finally {
      setSubmittingReview(false);
    }
  };

  const updateQuantity = (delta, maxStock) => {
    setQuantity((prev) => {
      let nextQty = prev + delta;
      if (nextQty < 1) nextQty = 1;
      if (nextQty > maxStock) nextQty = maxStock;
      return nextQty;
    });
  };

  const currentVolume = series?.volumes?.[currentVolumeIndex] || null;

  const displayImages = useMemo(() => {
    if (!series) return [];
    const imgs = [];
    if (series.coverImage) imgs.push(series.coverImage);
    if (currentVolume?.coverImage && currentVolume.coverImage !== series.coverImage) {
      imgs.push(currentVolume.coverImage);
    }
    if (imgs.length === 0) imgs.push("https://via.placeholder.com/400x600?text=No+Image");
    return imgs;
  }, [series, currentVolume]);

  const handleSelectVolume = (index) => {
    setCurrentVolumeIndex(index);
    setQuantity(1);
    
    const selectedVol = series.volumes[index];
    if (selectedVol?.coverImage && selectedVol.coverImage !== series.coverImage) {
      setCurrentImageIndex(1);
    } else {
      setCurrentImageIndex(0); 
    }
  };

  const handleAddToCart = () => {
    if (currentVolume && currentVolume.stock > 0) {
      const result = addToCart({
        ...currentVolume,
        seriesTitle: series.title,
        seriesSlug: series.slug,
        series: { title: series.title, slug: series.slug },
        quantity: quantity,
      });
      alert(result.message);
    }
  };

  const handleBuyNow = () => {
    if (currentVolume && currentVolume.stock > 0) {
      addToCart({
        ...currentVolume,
        seriesTitle: series.title,
        seriesSlug: series.slug,
        series: { title: series.title, slug: series.slug },
        quantity: quantity,
      });
      navigate("/cart");
    }
  };

  if (loading)
    return <div className="min-h-[70vh] flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-sv-brown" /></div>;
  
  if (error || !series)
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-sv-brown">{error}</h2>
        <Link to="/" className="text-sv-brown font-bold hover:underline border border-sv-brown px-4 py-2 rounded-full">Quay lại trang chủ</Link>
      </div>
    );

  const totalReviews = series.reviews?.length || 0;
  const avgRating = totalReviews > 0 ? (series.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1) : 0;
  const canReview = isAuthenticated && series.canReview !== false;

  const displayTitle = currentVolume ? (currentVolume.title || `${series.title} - Tập ${currentVolume.volumeNumber}`) : series.title;
  const isOutOfStock = currentVolume ? currentVolume.stock <= 0 : true;
  const maxStock = currentVolume ? currentVolume.stock : 0;

  return (
    <div className="bg-sv-cream min-h-screen py-8 font-nunito">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-sv-brown font-bold mb-6 transition-colors">
          <ArrowLeft size={20} /> Quay lại
        </Link>

        {/* ============================== */}
        {/* 👉 ĐÃ SỬA: Khoảng cách giữa 2 khung trái/phải thành gap-3 (~3mm), mb-3 cho khoảng cách với khung dưới */}
        {/* ============================== */}
        <div className="flex flex-col lg:flex-row gap-3 mb-3 items-start">
          
          {/* ================= CỘT TRÁI (STICKY) ================= */}
          <div className="w-full lg:w-1/3 xl:w-1/4 shrink-0 lg:sticky lg:top-24 h-fit bg-white p-5 sm:p-6 rounded-3xl border border-sv-tan shadow-sm flex flex-col">
             
             {/* Ảnh Lớn */}
             <div
              className="aspect-[2/3] w-full rounded-2xl overflow-hidden bg-sv-pale border border-sv-tan cursor-zoom-in relative group"
              onClick={() => setZoomedImage(displayImages[currentImageIndex])}
            >
              <img
                src={displayImages[currentImageIndex]}
                alt={displayTitle}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                <ZoomIn className="text-white opacity-0 group-hover:opacity-100 w-12 h-12" />
              </div>
              {isOutOfStock && currentVolume && (
                <div className="absolute top-2 left-2 bg-gray-500 text-white text-xs font-black px-2 py-1 rounded-md shadow-sm z-10 pointer-events-none">
                  HẾT HÀNG
                </div>
              )}
            </div>

            {/* Dải ảnh nhỏ (Thumbnails) */}
            <div className="flex gap-3 mt-4 w-full overflow-x-auto custom-scrollbar pb-2 min-h-[6rem]">
              {displayImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-16 h-24 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                    currentImageIndex === idx ? "border-sv-brown scale-105 shadow-md" : "border-sv-pale opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Nút Hành động */}
            <div className="flex flex-col gap-3 mt-4">
               <button
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className={`w-full py-3.5 rounded-xl border-2 flex items-center justify-center gap-2 font-bold transition-all ${
                    isOutOfStock 
                      ? "border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed" 
                      : "border-sv-brown text-sv-brown bg-white hover:bg-sv-wheat shadow-sm"
                  }`}
                >
                  <ShoppingCart size={20} strokeWidth={2.5} />
                  THÊM VÀO GIỎ
                </button>
                
                <button
                  disabled={isOutOfStock}
                  onClick={handleBuyNow}
                  className={`w-full py-3.5 rounded-xl flex items-center justify-center gap-2 font-black transition-all shadow-md ${
                    isOutOfStock 
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                      : "bg-sv-brown text-white hover:bg-opacity-90 hover:-translate-y-0.5"
                  }`}
                >
                  <Zap size={20} fill="currentColor" />
                  {isOutOfStock ? "HẾT HÀNG" : "MUA NGAY"}
                </button>
            </div>
          </div>

          {/* ================= CỘT PHẢI (CUỘN ĐƯỢC) ================= */}
          <div className="flex-1 flex flex-col gap-4 w-full">
            
            {/* --- BOX 1: THÔNG TIN CƠ BẢN & CHỌN TẬP --- */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-sv-tan shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-sv-wheat text-sv-brown px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider">
                  {series.type}
                </span>
                <span className={`px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider ${series.status === "ONGOING" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}>
                  {series.status}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-black text-sv-brown tracking-tight mb-2 leading-tight">
                {displayTitle}
              </h1>
              <p className="text-lg text-gray-500 font-bold mb-4">Bộ: {series.title}</p>

              <div className="flex items-center gap-2 mb-5 border-b border-sv-pale pb-5">
                <div className="flex items-center text-amber-500">
                  <Star size={20} className="fill-amber-400" />
                  <span className="font-black text-lg ml-1">{avgRating > 0 ? avgRating : "Chưa có"}</span>
                </div>
                <span className="text-gray-400 font-medium">|</span>
                <span className="text-gray-500 font-bold">{totalReviews} đánh giá</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-400 font-medium">Tác giả</p>
                  <p className="font-bold text-stone-800">{series.author || "Đang cập nhật"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 font-medium">Nhà xuất bản</p>
                  <p className="font-bold text-stone-800">{series.publisher || "Đang cập nhật"}</p>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <p className="text-sm text-gray-400 font-medium">Danh mục</p>
                  <p className="font-bold text-stone-800 line-clamp-2">
                    {series.categories?.length > 0 ? series.categories.map((c) => c.name).join(", ") : "Đang cập nhật"}
                  </p>
                </div>
              </div>

              {series.volumes && series.volumes.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-black text-sv-brown">Chọn tập truyện:</h3>
                    <span className="text-sm font-bold text-gray-400">{series.volumes.length} Tập</span>
                  </div>
                  <div className="max-h-[200px] overflow-y-auto custom-scrollbar pr-2 p-1 border border-sv-pale rounded-xl bg-stone-50">
                    <div className="flex flex-wrap gap-2">
                      {series.volumes.map((vol, index) => (
                        <button
                          key={vol.id}
                          onClick={() => handleSelectVolume(index)}
                          className={`px-4 py-2.5 rounded-lg font-black text-sm border-2 transition-all ${
                            currentVolumeIndex === index
                              ? "bg-sv-brown text-white border-sv-brown shadow-sm"
                              : "bg-white text-stone-600 border-stone-200 hover:border-sv-tan hover:bg-sv-pale"
                          }`}
                        >
                          Tập {vol.volumeNumber}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* --- BOX 2: CẤU HÌNH MUA HÀNG & CAM KẾT --- */}
            {currentVolume ? (
               <div className="bg-white p-5 sm:p-6 rounded-3xl border border-sv-tan shadow-sm flex flex-col gap-5">
                 <div className="flex justify-between items-end border-b border-sv-pale pb-5">
                   <div className="flex flex-col">
                      <p className="text-sm font-bold text-gray-400 mb-1">Giá sản phẩm:</p>
                      <div className="flex items-end gap-3">
                        <p className="text-4xl font-black text-sv-brown">
                          {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(currentVolume.price)}
                        </p>
                        {currentVolume.originalPrice && currentVolume.originalPrice > currentVolume.price && (
                          <p className="text-lg text-gray-400 line-through mb-1">
                            {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(currentVolume.originalPrice)}
                          </p>
                        )}
                      </div>
                   </div>
                   
                   <div className="text-right">
                     <p className="text-sm font-bold text-gray-400 mb-2">Số lượng chọn:</p>
                     <div className={`flex items-center bg-white border border-sv-tan rounded-xl overflow-hidden shadow-sm ${isOutOfStock ? "opacity-50 pointer-events-none" : ""}`}>
                        <button onClick={() => updateQuantity(-1, maxStock)} disabled={isOutOfStock || quantity <= 1} className="w-10 h-10 flex items-center justify-center font-bold text-sv-brown hover:bg-sv-wheat transition-colors disabled:opacity-30">
                          -
                        </button>
                        <span className="w-12 text-center text-base font-black text-sv-brown border-x border-sv-pale">{isOutOfStock ? 0 : quantity}</span>
                        <button onClick={() => updateQuantity(1, maxStock)} disabled={isOutOfStock || quantity >= maxStock} className="w-10 h-10 flex items-center justify-center font-bold text-sv-brown hover:bg-sv-wheat transition-colors disabled:opacity-30">
                          +
                        </button>
                      </div>
                      <p className="text-xs font-medium text-gray-500 mt-2">
                        Kho: <span className="font-bold text-sv-brown">{currentVolume.stock}</span> cuốn
                      </p>
                   </div>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="flex flex-col gap-1.5 p-4 rounded-xl bg-blue-50/50 border border-blue-100">
                      <Truck className="text-blue-600" size={22} />
                      <p className="font-bold text-blue-900 text-sm">Giao hàng tận nơi</p>
                      <p className="text-xs text-blue-700">Dự kiến nhận hàng trong 3 - 5 ngày làm việc.</p>
                    </div>
                    <div className="flex flex-col gap-1.5 p-4 rounded-xl bg-green-50/50 border border-green-100">
                      <ShieldCheck className="text-green-600" size={22} />
                      <p className="font-bold text-green-900 text-sm">Cam kết 100%</p>
                      <p className="text-xs text-green-700">Sách bản quyền chính hãng từ NXB.</p>
                    </div>
                    <div className="flex flex-col gap-1.5 p-4 rounded-xl bg-amber-50/50 border border-amber-100">
                      <RotateCcw className="text-amber-600" size={22} />
                      <p className="font-bold text-amber-900 text-sm">Hỗ trợ đổi trả</p>
                      <p className="text-xs text-amber-700">Miễn phí đổi trả trong vòng 7 ngày nếu lỗi NXB.</p>
                    </div>
                 </div>
               </div>
            ) : (
               <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sv-tan shadow-sm text-center">
                  <p className="text-gray-500 font-bold">Chưa có tập nào được phát hành.</p>
               </div>
            )}

            {/* --- BOX 3: TÓM TẮT TRUYỆN --- */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-sv-tan shadow-sm">
              <h3 className="font-black text-sv-brown text-xl mb-4">Nội dung tóm tắt</h3>
              <div className="relative">
                  <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isDescExpanded ? 'max-h-[2000px]' : 'max-h-[4.5rem]'}`}>
                    <p className="text-gray-600 leading-relaxed font-medium whitespace-pre-line">
                      {series.description || "Chưa có thông tin mô tả cho bộ truyện này."}
                    </p>
                  </div>
                  
                  {series.description?.length > 250 && (
                    <div className={`flex justify-center mt-4 ${!isDescExpanded ? "absolute bottom-0 left-0 w-full bg-gradient-to-t from-white to-transparent pt-8" : ""}`}>
                      <button
                        onClick={() => setIsDescExpanded(!isDescExpanded)}
                        className="flex items-center gap-1.5 px-5 py-2 bg-white hover:bg-sv-wheat text-sv-brown font-bold rounded-full transition-colors border border-sv-tan shadow-sm text-sm"
                      >
                        {isDescExpanded ? <><ChevronUp size={16} strokeWidth={3} /> Thu gọn</> : <><ChevronDown size={16} strokeWidth={3} /> Xem thêm</>}
                      </button>
                    </div>
                  )}
              </div>
            </div>

          </div>
        </div>

        {/* ============================== */}
        {/* 👉 ĐÃ SỬA: Khoảng cách dưới Đánh giá thành mb-3 (~3mm) */}
        {/* ============================== */}
        <div className="bg-white border border-sv-tan rounded-3xl p-6 lg:p-8 shadow-sm mb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-sv-pale pb-4 gap-4">
            <h2 className="text-2xl font-black text-sv-brown flex items-center gap-3">
              Đánh giá từ Độc giả
            </h2>
            <div className="flex items-center gap-3 bg-sv-pale px-4 py-2 rounded-xl border border-sv-tan">
              <span className="text-2xl font-black text-amber-500">
                {avgRating}
              </span>
              <div className="flex flex-col">
                <div className="flex text-amber-400">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i <= Math.round(avgRating) ? "fill-amber-400" : "fill-stone-200 text-stone-200"}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-gray-500">
                  {totalReviews} nhận xét
                </span>
              </div>
            </div>
          </div>

          {canReview ? (
            <form onSubmit={handleSubmitReview} className="bg-sv-wheat/30 rounded-2xl p-5 mb-8 border border-sv-pale">
              <h3 className="font-bold text-sv-brown mb-3">Bạn thấy bộ truyện này thế nào?</h3>
              <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none hover:scale-110 transition-transform">
                    <Star size={28} className={star <= rating ? "fill-amber-400 text-amber-400" : "fill-stone-200 text-stone-300"} />
                  </button>
                ))}
              </div>
              <div className="relative">
                <textarea
                  rows="3"
                  placeholder="Chia sẻ cảm nhận của bạn về bộ truyện này nhé..."
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  className="w-full bg-white border border-sv-tan text-sv-brown rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sv-brown custom-scrollbar pr-12"
                />
                <button type="submit" disabled={submittingReview} className="absolute bottom-3 right-3 p-2 bg-sv-brown text-white rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50">
                  {submittingReview ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-sv-pale/50 rounded-2xl p-5 mb-8 border border-sv-tan text-center">
              <p className="text-gray-500 font-bold text-sm">Bạn cần đăng nhập và mua bộ truyện này (đã giao hàng thành công) mới có thể gửi đánh giá.</p>
            </div>
          )}

          <div className="space-y-5">
            {series.reviews?.length > 0 ? (
              series.reviews.map((review) => (
                <div key={review.id} className="flex gap-4 border-b border-sv-pale pb-5 last:border-0 last:pb-0">
                  <div className="w-12 h-12 rounded-full bg-sv-pale flex items-center justify-center overflow-hidden shrink-0 border border-sv-tan">
                    {review.user?.avatarUrl ? (
                      <img src={review.user.avatarUrl} alt="avt" className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-black text-sv-brown">{review.user?.name?.charAt(0).toUpperCase() || "U"}</span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sv-brown">{review.user?.name || "Ẩn danh"}</span>
                      <span className="text-xs text-gray-400">• {new Date(review.createdAt).toLocaleDateString("vi-VN")}</span>
                    </div>
                    <div className="flex gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={i < review.rating ? "fill-amber-400 text-amber-400" : "fill-stone-200 text-stone-200"} />
                      ))}
                    </div>
                    <p className="text-gray-700 font-medium text-sm leading-relaxed">{review.comment}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500 font-medium italic">Chưa có đánh giá nào. Hãy trở thành người đầu tiên!</div>
            )}
          </div>
        </div>

        {/* ============================== */}
        {/* GỢI Ý CHO BẠN (Khoảng cách với ở trên là mb-3) */}
        {/* ============================== */}
        {relatedVolumes.length > 0 && (
          <div className="bg-white border border-sv-tan rounded-3xl p-6 lg:p-8 shadow-sm mb-12">
            <h2 className="text-2xl font-black text-sv-brown mb-6 flex items-center gap-3 border-b border-sv-pale pb-4">
              <Sparkles className="text-amber-500" size={28} /> Gợi ý cho bạn
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-5">
              {relatedVolumes.map((volume) => {
                const isOutOfStock = volume.stock <= 0;
                return (
                  <Link
                    key={volume.id}
                    to={`/series/${volume.series?.slug || volume.slug}`}
                    className="bg-white rounded-2xl border border-sv-tan overflow-hidden shadow-sm hover:shadow-md hover:border-sv-brown transition-all group flex flex-col"
                  >
                    <div className="relative aspect-[2/3] overflow-hidden bg-sv-pale">
                      <img
                        src={volume.coverImage || volume.series?.coverImage || "https://via.placeholder.com/300x450"}
                        alt={volume.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {isOutOfStock && (
                        <div className="absolute top-2 left-2 bg-gray-500 text-white text-xs font-black px-2 py-1 rounded-md shadow-sm z-10 pointer-events-none">
                          HẾT HÀNG
                        </div>
                      )}
                    </div>
                    <div className="p-3 flex flex-col flex-1">
                      <h3 className="font-black text-sv-brown text-sm line-clamp-2 mb-1 group-hover:opacity-80 transition-colors">
                        {volume.title || `${volume.series?.title} - Tập ${volume.volumeNumber}`}
                      </h3>

                      <div className="mt-auto flex items-end justify-between pt-2">
                        <p className="font-black text-base text-sv-brown">
                          {new Intl.NumberFormat("vi-VN").format(volume.price || 0)}đ
                        </p>
                        <button
                          disabled={isOutOfStock}
                          title={isOutOfStock ? "Hết hàng" : "Thêm vào giỏ"}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (!isOutOfStock) alert(addToCart({ ...volume, quantity: 1 }).message);
                          }}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm shrink-0 ${isOutOfStock ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-sv-wheat text-sv-brown hover:bg-sv-brown hover:text-white"}`}
                        >
                          <ShoppingCart size={14} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Modal Zoom Ảnh */}
      {zoomedImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setZoomedImage(null)}>
          <button className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-colors" onClick={() => setZoomedImage(null)}>
            <X size={28} />
          </button>
          <img src={zoomedImage} alt="Phóng to" className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl scale-100 animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
};

export default SeriesDetailPage;