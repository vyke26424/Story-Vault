import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axiosClient from "../utils/axiosClient";
import useCartStore from "../store/useCartStore";
import {
  Loader2,
  ArrowLeft,
  ShoppingCart,
  X,
  ZoomIn,
  Star,
  Send,
} from "lucide-react";

const SeriesDetailPage = () => {
  const { slug } = useParams();
  const addToCart = useCartStore((state) => state.addToCart);
  const [series, setSeries] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [zoomedImage, setZoomedImage] = useState(null);

  // State cho Form Review
  const [rating, setRating] = useState(5);
  const [reviewContent, setReviewContent] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get(`/series/${slug}`);
      const actualData = res.data?.data || res.data || res;
      setSeries(actualData);
    } catch (err) {
      console.error("Lỗi chi tiết:", err);
      setError("Không tìm thấy truyện hoặc có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [slug]);

  useEffect(() => {
    document.body.style.overflow = zoomedImage ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [zoomedImage]);

  // Hàm Gửi Đánh Giá
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewContent.trim()) return alert("Vui lòng nhập nội dung đánh giá!");

    try {
      setSubmittingReview(true);
      await axiosClient.post("/reviews", {
        seriesId: series.id,
        rating: rating,
        content: reviewContent,
      });
      alert("Cảm ơn bạn đã đánh giá bộ truyện này!");
      setReviewContent("");
      setRating(5);
      fetchDetail(); // Load lại trang để hiện review mới nhất
    } catch (error) {
      alert(error.response?.data?.message || "Có lỗi xảy ra khi gửi đánh giá!");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-sv-brown" />
      </div>
    );
  if (error || !series)
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-sv-brown">{error}</h2>
        <Link
          to="/"
          className="text-sv-brown font-bold hover:underline border border-sv-brown px-4 py-2 rounded-full"
        >
          Quay lại trang chủ
        </Link>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-sv-brown font-bold mb-8 transition-colors"
      >
        <ArrowLeft size={20} /> Quay lại
      </Link>

      {/* THÔNG TIN BỘ TRUYỆN */}
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12 mb-12">
        <div className="w-full md:w-1/3 lg:w-1/4 shrink-0 relative group">
          <div
            className="aspect-[2/3] w-full rounded-2xl overflow-hidden shadow-lg border border-sv-tan cursor-zoom-in"
            onClick={() => setZoomedImage(series.coverImage)}
          >
            <img
              src={
                series.coverImage ||
                "https://via.placeholder.com/400x600?text=No+Image"
              }
              alt={series.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
              <ZoomIn className="text-white opacity-0 group-hover:opacity-100 w-12 h-12" />
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-sv-wheat text-sv-brown px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider">
              {series.type}
            </span>
            <span
              className={`px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider ${series.status === "ONGOING" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}
            >
              {series.status}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-sv-brown tracking-tight mb-4">
            {series.title}
          </h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-sv-pale rounded-2xl border border-sv-tan">
            <div>
              <p className="text-sm text-gray-500 font-medium">Tác giả</p>
              <p className="font-bold text-sv-brown">
                {series.author || "Đang cập nhật"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Nhà xuất bản</p>
              <p className="font-bold text-sv-brown">
                {series.publisher || "Đang cập nhật"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Danh mục</p>
              <p className="font-bold text-sv-brown">
                {series.categories?.[0]?.name || "Đang cập nhật"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Số tập</p>
              <p className="font-bold text-sv-brown">
                {series.volumes?.length || 0} tập
              </p>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-sv-brown text-lg mb-2">
              Nội dung tóm tắt
            </h3>
            <p className="text-gray-600 leading-relaxed font-medium">
              {series.description ||
                "Chưa có thông tin mô tả cho bộ truyện này."}
            </p>
          </div>
        </div>
      </div>

      {/* DANH SÁCH CÁC TẬP */}
      <div className="bg-sv-pale border border-sv-tan rounded-3xl p-5 lg:p-6 shadow-sm mb-12">
        <h2 className="text-2xl font-black text-sv-brown mb-5 flex items-center gap-3">
          📚 Danh sách các tập
        </h2>
        {series.volumes?.length > 0 ? (
          <div className="max-h-[600px] overflow-y-auto pr-2 sm:pr-3 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {series.volumes.map((volume) => {
                const price = new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(volume.price);
                const isOutOfStock = volume.stock <= 0;

                return (
                  <div
                    key={volume.id}
                    className="bg-white border border-sv-tan rounded-2xl p-3 sm:p-4 flex gap-3 sm:gap-4 hover:shadow-md transition-all group"
                  >
                    <div
                      className="relative w-24 h-36 sm:w-28 sm:h-40 shrink-0 rounded-xl overflow-hidden border border-sv-tan cursor-zoom-in"
                      onClick={() =>
                        setZoomedImage(volume.coverImage || series.coverImage)
                      }
                    >
                      <img
                        src={volume.coverImage || series.coverImage}
                        alt={volume.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
                        <ZoomIn className="text-white opacity-0 group-hover:opacity-100 w-8 h-8" />
                      </div>
                    </div>
                    <div className="flex flex-col flex-1 py-0.5 min-w-0">
                      <h3 className="font-black text-sv-brown text-base sm:text-lg line-clamp-2 leading-snug mb-1">
                        {volume.title || `Tập ${volume.isbn}`}
                      </h3>
                      <p className="text-xs font-medium text-gray-500 mb-1 truncate">
                        ISBN: {volume.isbn}
                      </p>
                      <p className="text-xs font-medium text-gray-500 mb-2 sm:mb-3">
                        Kho:{" "}
                        <span className="font-bold text-sv-brown">
                          {volume.stock}
                        </span>{" "}
                        cuốn
                      </p>
                      <div className="mt-auto flex items-end justify-between gap-2">
                        <div className="min-w-0">
                          {volume.originalPrice &&
                            volume.originalPrice > volume.price && (
                              <p className="text-[11px] text-gray-400 line-through mb-0.5 truncate">
                                {new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(volume.originalPrice)}
                              </p>
                            )}
                          <p className="font-black text-lg sm:text-xl text-sv-brown truncate">
                            {price}
                          </p>
                        </div>
                        <button
                          disabled={isOutOfStock}
                          title={isOutOfStock ? "Hết hàng" : "Thêm vào giỏ"}
                          onClick={() => {
                            alert(addToCart(volume).message);
                          }}
                          className={`p-2.5 sm:p-3 rounded-xl flex items-center justify-center shrink-0 transition-all shadow-sm ${isOutOfStock ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-sv-brown text-white hover:bg-opacity-90 hover:shadow-md hover:-translate-y-0.5"}`}
                        >
                          <ShoppingCart size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-8 bg-white rounded-2xl text-center border border-sv-tan">
            <p className="text-gray-500 font-bold">
              Hiện chưa có tập truyện nào được bán.
            </p>
          </div>
        )}
      </div>

      {/* KHU VỰC REVIEW (ĐÁNH GIÁ) */}
      <div className="bg-white border border-sv-tan rounded-3xl p-5 lg:p-8 shadow-sm">
        <h2 className="text-2xl font-black text-sv-brown mb-6 border-b border-sv-pale pb-4">
          Đánh giá từ Độc giả
        </h2>

        {/* Form Đánh Giá */}
        <form
          onSubmit={handleSubmitReview}
          className="bg-sv-wheat/30 rounded-2xl p-5 mb-8 border border-sv-pale"
        >
          <h3 className="font-bold text-sv-brown mb-3">
            Bạn thấy bộ truyện này thế nào?
          </h3>
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none hover:scale-110 transition-transform"
              >
                <Star
                  size={28}
                  className={
                    star <= rating
                      ? "fill-amber-400 text-amber-400"
                      : "fill-stone-200 text-stone-300"
                  }
                />
              </button>
            ))}
          </div>
          <div className="relative">
            <textarea
              rows="3"
              placeholder="Chia sẻ cảm nhận của bạn về bộ truyện này nhé (Chỉ khách đã nhận hàng mới được đánh giá)..."
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
              className="w-full bg-white border border-sv-tan text-sv-brown rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sv-brown custom-scrollbar pr-12"
            />
            <button
              type="submit"
              disabled={submittingReview}
              className="absolute bottom-3 right-3 p-2 bg-sv-brown text-white rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
            >
              {submittingReview ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
        </form>

        {/* Danh sách bình luận */}
        <div className="space-y-5">
          {series.reviews?.length > 0 ? (
            series.reviews.map((review) => (
              <div
                key={review.id}
                className="flex gap-4 border-b border-sv-pale pb-5 last:border-0 last:pb-0"
              >
                <div className="w-12 h-12 rounded-full bg-sv-pale flex items-center justify-center overflow-hidden shrink-0 border border-sv-tan">
                  {review.user?.avatarUrl ? (
                    <img
                      src={review.user.avatarUrl}
                      alt="avt"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-black text-sv-brown">
                      {review.user?.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sv-brown">
                      {review.user?.name || "Ẩn danh"}
                    </span>
                    <span className="text-xs text-gray-400">
                      • {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <div className="flex gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={
                          i < review.rating
                            ? "fill-amber-400 text-amber-400"
                            : "fill-stone-200 text-stone-200"
                        }
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 font-medium text-sm leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500 font-medium italic">
              Chưa có đánh giá nào. Hãy trở thành người đầu tiên!
            </div>
          )}
        </div>
      </div>

      {zoomedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setZoomedImage(null)}
        >
          <button
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-colors"
            onClick={() => setZoomedImage(null)}
          >
            <X size={28} />
          </button>
          <img
            src={zoomedImage}
            alt="Phóng to"
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl scale-100 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default SeriesDetailPage;
