import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  RotateCcw,
  Image as ImageIcon,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import axiosClient from "../../utils/axiosClient";

const SeriesListPage = () => {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;

  const fetchSeries = async (pageToFetch = currentPage) => {
    try {
      setLoading(true);
      const res = await axiosClient.get(`/admin/series`, {
        params: {
          search: searchTerm,
          page: pageToFetch,
          limit: limit,
        },
      });
      setSeries(res.data?.data || res.data || []);

      // Cập nhật Meta phân trang
      const meta = res.data?.meta || res.meta;
      if (meta) {
        setTotalPages(meta.totalPages || 1);
        setTotalItems(meta.totalItems || 0);
      } else {
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách Series:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      fetchSeries(1);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchSeries(newPage);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Sếp có chắc muốn ẨN bộ truyện "${title}" không?`)) {
      try {
        await axiosClient.delete(`/admin/series/${id}`);
        fetchSeries(currentPage);
      } catch (error) {
        alert("Có lỗi xảy ra khi ẩn bộ truyện!");
      }
    }
  };

  const handleRestore = async (id, title) => {
    if (
      window.confirm(`Hiện lại bộ "${title}" để tiếp tục hiển thị nhé sếp?`)
    ) {
      try {
        await axiosClient.patch(`/admin/series/restore/${id}`);
        fetchSeries(currentPage);
      } catch (error) {
        alert("Có lỗi xảy ra khi khôi phục!");
      }
    }
  };

  return (
    <div className="p-6 font-nunito h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-black text-stone-800">
            Quản lý Bộ Truyện (Series)
          </h1>
          <p className="text-stone-500 font-medium">
            Thêm, sửa, xóa các Đầu truyện gốc.
          </p>
        </div>
        <Link
          to="/admin/series/create"
          className="bg-amber-500 hover:bg-amber-600 text-stone-900 font-black py-2.5 px-6 rounded-xl transition-all shadow-md flex items-center gap-2 self-start"
        >
          <Plus size={20} /> Thêm Bộ Mới
        </Link>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-stone-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm theo tên bộ truyện hoặc tác giả..."
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
                <th className="p-4 font-bold whitespace-nowrap">Ảnh bìa</th>
                <th className="p-4 font-bold min-w-[200px]">Tên Bộ Truyện</th>
                <th className="p-4 font-bold whitespace-nowrap">Tác giả</th>
                <th className="p-4 font-bold text-center whitespace-nowrap">
                  Phân loại
                </th>
                <th className="p-4 font-bold text-center whitespace-nowrap">
                  Tình trạng
                </th>
                <th className="p-4 font-bold text-center whitespace-nowrap">
                  Trạng thái
                </th>
                <th className="p-4 font-bold text-center whitespace-nowrap">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center">
                    <Loader2
                      className="animate-spin text-amber-500 mx-auto mb-2"
                      size={32}
                    />
                    <p className="text-stone-500 font-medium">
                      Đang tải dữ liệu...
                    </p>
                  </td>
                </tr>
              ) : series.length > 0 ? (
                series.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-stone-100 hover:bg-stone-50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="w-12 h-16 bg-stone-200 rounded border border-stone-300 flex items-center justify-center overflow-hidden shrink-0">
                        {s.coverImage ? (
                          <img
                            src={s.coverImage}
                            alt="Cover"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon size={20} className="text-stone-400" />
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-black text-stone-800 line-clamp-2">
                        {s.title}
                      </p>
                      <p className="text-xs text-stone-500 mt-1">
                        NXB: {s.publisher || "N/A"}
                      </p>
                    </td>
                    <td className="p-4 font-bold text-stone-600">
                      {s.author || "Đang cập nhật"}
                    </td>
                    <td className="p-4 text-center">
                      <span className="px-3 py-1 bg-stone-100 text-stone-600 rounded-md text-xs font-bold border border-stone-200">
                        {s.type}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider
                        ${
                          s.status === "COMPLETED"
                            ? "bg-green-100 text-green-700"
                            : s.status === "ONGOING"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {s.isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-stone-800 text-stone-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>{" "}
                          Hiển thị
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-stone-200 text-stone-500">
                          <span className="w-1.5 h-1.5 rounded-full bg-stone-400"></span>{" "}
                          Đã ẩn
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/admin/series/edit/${s.id}`}
                          className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit size={18} />
                        </Link>
                        {s.isActive ? (
                          <button
                            onClick={() => handleDelete(s.id, s.title)}
                            className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                            title="Ẩn Series"
                          >
                            <Trash2 size={18} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRestore(s.id, s.title)}
                            className="p-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                            title="Hiện lại"
                          >
                            <RotateCcw size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-12 text-center">
                    <div className="text-4xl mb-3">📭</div>
                    <p className="text-stone-500 font-bold">
                      Không tìm thấy Bộ truyện nào sếp ạ!
                    </p>
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
              Trang {currentPage} / {totalPages} (Tổng {totalItems} bộ truyện)
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

export default SeriesListPage;
