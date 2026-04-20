import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  CheckCircle,
  Clock,
  Check,
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import axiosClient from "../../utils/axiosClient";

const FeedbackListPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;

  // Gọi API lấy danh sách Feedback có phân trang
  const fetchFeedbacks = async (pageToFetch = currentPage) => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/feedback", {
        params: {
          search: searchTerm,
          page: pageToFetch,
          limit: limit,
        },
      });
      setFeedbacks(res.data?.data || res.data || []);

      // Cập nhật Meta phân trang
      const meta = res.data?.meta || res.meta;
      if (meta) {
        setTotalPages(meta.totalPages || 1);
        setTotalItems(meta.totalItems || 0);
      } else {
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Lỗi khi tải feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      fetchFeedbacks(1);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchFeedbacks(newPage);
    }
  };

  // Hàm xử lý khi sếp bấm nút "Đã xử lý"
  const handleResolve = async (id) => {
    if (!window.confirm("Đánh dấu góp ý này là đã xử lý?")) return;
    try {
      await axiosClient.patch(`/feedback/${id}/resolve`);
      fetchFeedbacks(currentPage); // Tải lại để cập nhật đúng trang hiện tại
    } catch (error) {
      alert("Có lỗi xảy ra khi cập nhật!");
    }
  };

  // Hàm render loại Feedback cho đẹp
  const renderType = (type) => {
    const types = {
      GOP_Y: { label: "Góp ý", color: "bg-blue-100 text-blue-700" },
      BAO_LOI: { label: "Báo lỗi", color: "bg-red-100 text-red-700" },
      YEU_CAU_SACH: {
        label: "Yêu cầu sách",
        color: "bg-purple-100 text-purple-700",
      },
      KHIEU_NAI: { label: "Khiếu nại", color: "bg-orange-100 text-orange-700" },
    };
    const t = types[type] || {
      label: type,
      color: "bg-gray-100 text-gray-700",
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-bold ${t.color}`}>
        {t.label}
      </span>
    );
  };

  return (
    <div className="p-6 font-nunito h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-white rounded-xl shadow-sm border border-stone-200 text-sv-brown">
          <MessageSquare size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-stone-800">
            Quản lý Góp ý & Báo lỗi
          </h1>
          <p className="text-stone-500 text-sm font-medium">
            Lắng nghe để phát triển Story Vault tốt hơn.
          </p>
        </div>
      </div>

      {/* THANH TÌM KIẾM */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-stone-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm theo nội dung, email hoặc tên khách hàng..."
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
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-600">
                <th className="p-4 font-bold text-sm">Khách hàng</th>
                <th className="p-4 font-bold text-sm whitespace-nowrap">
                  Chủ đề
                </th>
                <th className="p-4 font-bold text-sm min-w-[250px]">
                  Nội dung
                </th>
                <th className="p-4 font-bold text-sm whitespace-nowrap">
                  Ngày gửi
                </th>
                <th className="p-4 font-bold text-sm whitespace-nowrap">
                  Trạng thái
                </th>
                <th className="p-4 font-bold text-sm text-center whitespace-nowrap">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center">
                    <Loader2
                      className="animate-spin text-amber-500 mx-auto mb-2"
                      size={32}
                    />
                  </td>
                </tr>
              ) : feedbacks.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="p-8 text-center text-stone-500 font-bold"
                  >
                    Không tìm thấy góp ý nào.
                  </td>
                </tr>
              ) : (
                feedbacks.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-stone-50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-bold text-stone-800">
                        {item.user?.name || "Khách vãng lai"}
                      </div>
                      <div className="text-xs text-stone-500">{item.email}</div>
                    </td>
                    <td className="p-4">{renderType(item.type)}</td>
                    <td
                      className="p-4 text-sm text-stone-700 max-w-xs truncate"
                      title={item.content}
                    >
                      {item.content}
                    </td>
                    <td className="p-4 text-sm text-stone-500 font-medium">
                      {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="p-4">
                      {item.status === "RESOLVED" ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md w-max">
                          <CheckCircle size={14} /> Đã xử lý
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md w-max">
                          <Clock size={14} /> Chờ xử lý
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {item.status === "PENDING" && (
                        <button
                          onClick={() => handleResolve(item.id)}
                          className="bg-sv-brown text-white p-2 rounded-lg hover:bg-opacity-90 transition-colors shadow-sm"
                          title="Đánh dấu đã xử lý"
                        >
                          <Check size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* COMPONENT PHÂN TRANG */}
        {!loading && totalPages > 1 && (
          <div className="bg-white border-t border-stone-200 p-4 flex items-center justify-between mt-auto">
            <span className="text-sm font-bold text-stone-500">
              Trang {currentPage} / {totalPages} (Tổng {totalItems} góp ý)
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

export default FeedbackListPage;
