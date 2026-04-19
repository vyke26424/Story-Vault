import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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
  Library,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const SeriesDetailPage = () => {
  const { slug } = useParams();
  const addToCart = useCartStore((state) => state.addToCart);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [series, setSeries] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [zoomedImage, setZoomedImage] = useState(null);

  const [quantities, setQuantities] = useState({});

  // States Giao diện
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [relatedVolumes, setRelatedVolumes] = useState([]);

  // State Form Review
  const [rating, setRating] = useState(5);
  const [reviewContent, setReviewContent] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const updateQuantity = (volumeId, delta, maxStock) => {
    setQuantities((prev) => {
      const currentQty = prev[volumeId] || 1; // Mặc định là 1
      let nextQty = currentQty + delta;

      if (nextQty < 1) nextQty = 1; // Không cho giảm dưới 1
      if (nextQty > maxStock) nextQty = maxStock; // Không cho tăng quá tồn kho

      return { ...prev, [volumeId]: nextQty };
    });
  };

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get(`/series/${slug}`);
      const actualData = res.data?.data || res.data || res;
      setSeries(actualData);

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
      // Dùng API search vì nó trả về danh sách các Tập (Volume)
      const res = await axiosClient.get(`/search?type=${type}&limit=30`); // Lấy dư ra 30 cuốn để trộn
      const payload = res.data?.data || res.data;
      const dataList = payload.data || payload;

      if (Array.isArray(dataList)) {
        // Lọc bỏ các tập thuộc bộ truyện đang xem
        const filtered = dataList.filter(
          (vol) => vol.seriesId !== currentId && vol.series?.id !== currentId,
        );
        // Trộn ngẫu nhiên mảng và cắt lấy 12 cuốn đầu tiên
        const shuffled = filtered.sort(() => 0.5 - Math.random()).slice(0, 12);
        setRelatedVolumes(shuffled);
      }
    } catch (error) {
      console.error("Lỗi lấy truyện liên quan:", error);
    }
  };

  useEffect(() => {
    fetchDetail();
    // Cuộn lên đầu khi đổi truyện
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  useEffect(() => {
    document.body.style.overflow = zoomedImage ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [zoomedImage]);

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
      fetchDetail();
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

  const totalReviews = series.reviews?.length || 0;
  const avgRating =
    totalReviews > 0
      ? (
          series.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        ).toFixed(1)
      : 0;

  const canReview = isAuthenticated && series.canReview !== false;

  return (
    <div className="bg-sv-cream min-h-screen py-8 font-nunito">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-sv-brown font-bold mb-8 transition-colors"
        >
          <ArrowLeft size={20} /> Quay lại
        </Link>

        {/* THÔNG TIN BỘ TRUYỆN */}
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 mb-12 bg-white p-6 sm:p-8 rounded-3xl border border-sv-tan shadow-sm">
          <div className="w-full md:w-1/3 lg:w-1/4 shrink-0 relative group">
            <div
              className="aspect-[2/3] w-full rounded-2xl overflow-hidden bg-sv-pale shadow-sm border border-sv-tan cursor-zoom-in"
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

            <h1 className="text-3xl md:text-5xl font-black text-sv-brown tracking-tight mb-4 leading-tight">
              {series.title}
            </h1>

            {/* Hiển thị Rating Tổng quan */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center text-amber-500">
                <Star size={20} className="fill-amber-400" />
                <span className="font-black text-lg ml-1">
                  {avgRating > 0 ? avgRating : "Chưa có"}
                </span>
              </div>
              <span className="text-gray-400 font-medium">|</span>
              <span className="text-gray-500 font-bold">
                {totalReviews} đánh giá
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-5 bg-sv-pale rounded-2xl border border-sv-tan">
              <div>
                <p className="text-sm text-gray-500 font-medium">Tác giả</p>
                <p className="font-bold text-sv-brown">
                  {series.author || "Đang cập nhật"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Nhà xuất bản
                </p>
                <p className="font-bold text-sv-brown">
                  {series.publisher || "Đang cập nhật"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Danh mục</p>
                <p className="font-bold text-sv-brown line-clamp-2">
                  {series.categories?.length > 0
                    ? series.categories.map((c) => c.name).join(", ")
                    : "Đang cập nhật"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Số tập</p>
                <p className="font-bold text-sv-brown">
                  {series.volumes?.length || 0} tập
                </p>
              </div>
            </div>

            <div className="bg-white">
              <h3 className="font-bold text-sv-brown text-lg mb-2">
                Nội dung tóm tắt
              </h3>
              <div className="relative">
                <p
                  className={`text-gray-600 leading-relaxed font-medium transition-all duration-300 ${!isDescExpanded ? "line-clamp-3" : ""}`}
                >
                  {series.description ||
                    "Chưa có thông tin mô tả cho bộ truyện này."}
                </p>
                {/* Chỉ hiện nút Xem thêm nếu mô tả dài */}
                {series.description?.length > 200 && (
                  <button
                    onClick={() => setIsDescExpanded(!isDescExpanded)}
                    className="flex items-center gap-1 text-sm font-bold text-amber-600 hover:text-amber-700 mt-2"
                  >
                    {isDescExpanded ? (
                      <>
                        <ChevronUp size={16} /> Thu gọn
                      </>
                    ) : (
                      <>
                        <ChevronDown size={16} /> Xem thêm
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* DANH SÁCH CÁC TẬP */}
        <div className="bg-white border border-sv-tan rounded-3xl p-6 lg:p-8 shadow-sm mb-12">
          <h2 className="text-2xl font-black text-sv-brown mb-6 flex items-center gap-3 border-b border-sv-pale pb-4">
            <Library className="text-sv-tan" size={28} /> Danh sách các tập
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
                      className="bg-sv-pale/30 border border-sv-tan rounded-2xl p-4 flex gap-4 hover:shadow-md transition-all group"
                    >
                      <div
                        className="relative w-24 h-36 shrink-0 rounded-xl overflow-hidden border border-sv-tan bg-sv-pale cursor-zoom-in"
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
                        <p className="text-xs font-medium text-gray-500 mb-2">
                          Kho:{" "}
                          <span className="font-bold text-sv-brown">
                            {volume.stock}
                          </span>{" "}
                          cuốn
                        </p>
                        <div className="mt-auto flex flex-col gap-2 pt-2">
                          {/* Giá tiền */}
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
                            <p className="font-black text-lg text-sv-brown truncate">
                              {price}
                            </p>
                          </div>

                          {/* Khối Chọn số lượng & Nút Mua */}
                          <div className="flex items-center justify-between gap-2">
                            {/* Bộ đếm Tăng/Giảm */}
                            <div
                              className={`flex items-center bg-white border border-sv-tan rounded-lg overflow-hidden shrink-0 shadow-sm ${isOutOfStock ? "opacity-50 pointer-events-none" : ""}`}
                            >
                              <button
                                onClick={() =>
                                  updateQuantity(volume.id, -1, volume.stock)
                                }
                                disabled={
                                  isOutOfStock ||
                                  (quantities[volume.id] || 1) <= 1
                                }
                                className="w-8 h-8 flex items-center justify-center font-bold text-sv-brown hover:bg-sv-wheat transition-colors disabled:opacity-30"
                              >
                                -
                              </button>
                              <span className="w-8 text-center text-sm font-black text-sv-brown border-x border-sv-pale">
                                {isOutOfStock ? 0 : quantities[volume.id] || 1}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(volume.id, 1, volume.stock)
                                }
                                disabled={
                                  isOutOfStock ||
                                  (quantities[volume.id] || 1) >= volume.stock
                                }
                                className="w-8 h-8 flex items-center justify-center font-bold text-sv-brown hover:bg-sv-wheat transition-colors disabled:opacity-30"
                              >
                                +
                              </button>
                            </div>

                            {/* Nút Thêm vào giỏ */}
                            <button
                              disabled={isOutOfStock}
                              onClick={() => {
                                // Lấy số lượng từ state (mặc định 1), truyền vào Cart
                                const qtyToAdd = quantities[volume.id] || 1;
                                alert(
                                  addToCart({ ...volume, quantity: qtyToAdd })
                                    .message,
                                );
                              }}
                              className={`p-2.5 rounded-xl flex-1 flex items-center justify-center gap-2 transition-all shadow-sm ${isOutOfStock ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-sv-brown text-white hover:bg-opacity-90 hover:shadow-md hover:-translate-y-0.5"}`}
                            >
                              <ShoppingCart size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-8 bg-sv-pale/50 rounded-2xl text-center border border-sv-tan">
              <p className="text-gray-500 font-bold">
                Hiện chưa có tập truyện nào được bán.
              </p>
            </div>
          )}
        </div>

        {/* KHU VỰC REVIEW */}
        <div className="bg-white border border-sv-tan rounded-3xl p-6 lg:p-8 shadow-sm mb-12">
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
                      className={
                        i <= Math.round(avgRating)
                          ? "fill-amber-400"
                          : "fill-stone-200 text-stone-200"
                      }
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
                  placeholder="Chia sẻ cảm nhận của bạn về bộ truyện này nhé..."
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
          ) : (
            <div className="bg-sv-pale/50 rounded-2xl p-5 mb-8 border border-sv-tan text-center">
              <p className="text-gray-500 font-bold text-sm">
                Bạn cần đăng nhập và mua bộ truyện này (đã giao hàng thành công)
                mới có thể gửi đánh giá.
              </p>
            </div>
          )}

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
                        •{" "}
                        {new Date(review.createdAt).toLocaleDateString("vi-VN")}
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

        {relatedVolumes.length > 0 && (
          <div className="bg-white border border-sv-tan rounded-3xl p-6 lg:p-8 shadow-sm mb-12">
            <h2 className="text-2xl font-black text-sv-brown mb-6 flex items-center gap-3 border-b border-sv-pale pb-4">
              <Sparkles className="text-amber-500" size={28} /> Gợi ý cho bạn
            </h2>

            {/* Dùng lưới 6 cột trên PC, 4 cột trên Tablet, 2 cột trên Mobile */}
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
                        src={
                          volume.coverImage ||
                          volume.series?.coverImage ||
                          "https://via.placeholder.com/300x450"
                        }
                        alt={volume.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-3 flex flex-col flex-1">
                      <h3 className="font-black text-sv-brown text-sm line-clamp-2 mb-1 group-hover:opacity-80 transition-colors">
                        {volume.series?.title || volume.title}{" "}
                        {volume.volumeNumber
                          ? `- Tập ${volume.volumeNumber}`
                          : ""}
                      </h3>

                      <div className="mt-auto flex items-end justify-between pt-2">
                        <p className="font-black text-base text-sv-brown">
                          {new Intl.NumberFormat("vi-VN").format(
                            volume.price || 0,
                          )}
                          đ
                        </p>
                        <button
                          disabled={isOutOfStock}
                          title={isOutOfStock ? "Hết hàng" : "Thêm vào giỏ"}
                          onClick={(e) => {
                            e.preventDefault(); // Quan trọng: Ngăn không cho Link nhảy trang khi bấm nút mua
                            e.stopPropagation();
                            if (!isOutOfStock)
                              alert(
                                addToCart({ ...volume, quantity: 1 }).message,
                              );
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
