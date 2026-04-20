import React, { useState, useEffect } from "react";
import {
  Search,
  Loader2,
  MessageSquareQuote,
  Star,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import axiosClient from "../../utils/axiosClient";

const ReviewListPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;

  const fetchReviews = async (pageToFetch = currentPage) => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/admin/reviews", {
        params: {
          search: searchTerm,
          page: pageToFetch,
          limit: limit,
        },
      });
      setReviews(res.data?.data || res.data || []);

      // Cập nhật Meta phân trang
      const meta = res.data?.meta || res.meta;
      if (meta) {
        setTotalPages(meta.totalPages || 1);
        setTotalItems(meta.totalItems || 0);
      } else {
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách đánh giá:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      fetchReviews(1);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchReviews(newPage);
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Sếp có chắc chắn muốn xóa đánh giá này không? Hành động này không thể hoàn tác!",
      )
    ) {
      try {
        await axiosClient.delete(`/admin/reviews/${id}`);
        alert("Đã xóa đánh giá rác!");
        fetchReviews(currentPage);
      } catch (error) {
        alert("Có lỗi xảy ra khi xóa!");
      }
    }
  };

  return (
    <div className="p-6 font-nunito h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-black text-stone-800 flex items-center gap-3">
            <MessageSquareQuote className="text-amber-500" size={32} /> Quản lý
            Đánh Giá
          </h1>
          <p className="text-stone-500 font-medium">
            Kiểm duyệt bình luận và đánh giá sao của khách hàng.
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-stone-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm theo nội dung, người dùng hoặc tên sách..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 text-stone-800 font-medium rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1 custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-stone-50 sticky top-0 z-10">
              <tr className="text-stone-500 text-sm border-b border-stone-200">
                <th className="p-4 font-bold min-w-[200px]">Khách Hàng</th>
                <th className="p-4 font-bold min-w-[250px]">
                  Sản Phẩm Đánh Giá
                </th>
                <th className="p-4 font-bold min-w-[300px]">
                  Đánh Giá & Nội Dung
                </th>
                <th className="p-4 font-bold text-center">Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-12 text-center">
                    <Loader2
                      className="animate-spin text-amber-500 mx-auto mb-2"
                      size={32}
                    />
                  </td>
                </tr>
              ) : reviews.length > 0 ? (
                reviews.map((review) => (
                  <tr
                    key={review.id}
                    className="border-b border-stone-100 hover:bg-stone-50 transition-colors"
                  >
                    {/* User Info */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center border border-amber-200 overflow-hidden shrink-0">
                          {review.user?.avatarUrl ? (
                            <img
                              src={review.user.avatarUrl}
                              alt="Avatar"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="font-black text-amber-600">
                              {review.user?.name?.charAt(0).toUpperCase() ||
                                "U"}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-stone-800">
                            {review.user?.name || "Ẩn danh"}
                          </p>
                          <p className="text-xs text-stone-500">
                            {new Date(review.createdAt).toLocaleDateString(
                              "vi-VN",
                            )}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Product Info */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {/* Đổi thành review.series */}
                        <img
                          src={
                            review.series?.coverImage ||
                            "https://via.placeholder.com/50"
                          }
                          alt="Cover"
                          className="w-12 h-16 object-cover rounded shadow-sm border border-stone-200"
                        />
                        <div>
                          <p className="font-bold text-stone-800 text-sm line-clamp-2">
                            {review.series?.title || "Đang cập nhật"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Review Content */}
                    <td className="p-4">
                      <div className="flex items-center gap-1 mb-1">
                        {[...Array(5)].map((_, index) => (
                          <Star
                            key={index}
                            size={16}
                            className={
                              index < review.rating
                                ? "fill-amber-400 text-amber-400"
                                : "fill-stone-200 text-stone-200"
                            }
                          />
                        ))}
                      </div>
                      <p className="text-sm text-stone-600 italic">
                        "{review.comment}"
                      </p>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors inline-flex"
                        title="Xóa đánh giá"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="p-12 text-center text-stone-500 font-bold"
                  >
                    Chưa có đánh giá nào!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* COMPONENT PHÂN TRANG */}
        {!loading && totalPages > 1 && (
          <div className="bg-white border-t border-stone-200 p-4 flex items-center justify-between mt-auto">
            <span className="text-sm font-bold text-stone-500">
              Trang {currentPage} / {totalPages} (Tổng {totalItems} đánh giá)
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg flex items-center justify-center transition-colors ${
                  currentPage === 1
                    ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                <ChevronLeft size={20} />
              </button>

              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                if (pageNum < currentPage - 2 || pageNum > currentPage + 2)
                  return null;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-lg font-black transition-colors ${
                      currentPage === pageNum
                        ? "bg-amber-500 text-stone-900 shadow-sm"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg flex items-center justify-center transition-colors ${
                  currentPage === totalPages
                    ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewListPage;
