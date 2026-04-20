import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  Tags,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import axiosClient from "../../utils/axiosClient";

const CategoryListPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;

  const fetchCategories = async (pageToFetch = currentPage) => {
    try {
      setLoading(true);
      const res = await axiosClient.get(`/category`, {
        params: {
          search: searchTerm,
          page: pageToFetch,
          limit: limit,
        },
      });
      setCategories(res.data?.data || res.data || []);

      // Cập nhật Meta phân trang
      const meta = res.data?.meta || res.meta;
      if (meta) {
        setTotalPages(meta.totalPages || 1);
        setTotalItems(meta.totalItems || 0);
      } else {
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh mục:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      fetchCategories(1);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchCategories(newPage);
    }
  };

  const handleDelete = async (id, name) => {
    if (
      window.confirm(`Sếp có chắc muốn XÓA VĨNH VIỄN thể loại "${name}" không?`)
    ) {
      try {
        await axiosClient.delete(`/category/${id}`);
        fetchCategories(currentPage);
      } catch (error) {
        alert("Có lỗi xảy ra khi xóa!");
      }
    }
  };

  return (
    <div className="p-6 font-nunito h-full flex flex-col">
      <div className="flex justify-between items-end gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-black text-stone-800 flex items-center gap-3">
            <Tags className="text-amber-500" size={32} /> Thể Loại Truyện
          </h1>
          <p className="text-stone-500 font-medium">
            Quản lý các danh mục phân loại truyện.
          </p>
        </div>
        <Link
          to="/admin/categories/create"
          className="bg-amber-500 hover:bg-amber-600 text-stone-900 font-black py-2.5 px-6 rounded-xl transition-all shadow-md flex items-center gap-2"
        >
          <Plus size={20} /> Thêm Thể Loại
        </Link>
      </div>

      {/* THANH TÌM KIẾM */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-stone-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm theo tên thể loại hoặc mã slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 text-stone-800 font-medium rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />
        </div>
      </div>

      {/* BẢNG DỮ LIỆU */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 flex-1 flex flex-col overflow-hidden mb-6">
        <div className="overflow-x-auto flex-1 custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-stone-50 sticky top-0 z-10">
              <tr className="text-stone-500 text-sm border-b border-stone-200">
                <th className="p-4 font-bold whitespace-nowrap">
                  Tên Thể Loại
                </th>
                <th className="p-4 font-bold whitespace-nowrap">Mã Slug</th>
                <th className="p-4 font-bold min-w-[250px]">Mô tả</th>
                <th className="p-4 font-bold text-center whitespace-nowrap">
                  Hành động
                </th>
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
                    <p className="text-stone-500 font-medium">
                      Đang tải dữ liệu...
                    </p>
                  </td>
                </tr>
              ) : categories.length > 0 ? (
                categories.map((cat) => (
                  <tr
                    key={cat.id}
                    className="border-b border-stone-100 hover:bg-stone-50 transition-colors"
                  >
                    <td className="p-4 font-black text-stone-800">
                      {cat.name}
                    </td>
                    <td className="p-4 text-stone-500 font-medium">
                      {cat.slug}
                    </td>
                    <td className="p-4 text-stone-600 text-sm">
                      {cat.description || "Không có mô tả"}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <Link
                          to={`/admin/categories/edit/${cat.id}`}
                          className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(cat.id, cat.name)}
                          className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-12 text-center">
                    <div className="text-4xl mb-3">📭</div>
                    <p className="text-stone-500 font-bold">
                      Chưa có thể loại nào sếp ạ!
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
              Trang {currentPage} / {totalPages} (Tổng {totalItems} thể loại)
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

export default CategoryListPage;
