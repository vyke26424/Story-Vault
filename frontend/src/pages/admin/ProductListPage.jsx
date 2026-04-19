import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  RotateCcw,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import axiosClient from "../../utils/axiosClient";

const ProductListPage = () => {
  const [volumes, setVolumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("");

  const fetchVolumes = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get(`/volumes`, {
        params: {
          search: searchTerm,
          isActive: activeFilter,
        },
      });
      // ĐÃ FIX: res chính là cục { message, data }, nên mảng nằm ở res.data
      setVolumes(res.data || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sách:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchVolumes();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, activeFilter]);

  const handleDelete = async (id, title) => {
    if (
      window.confirm(`Sếp có chắc muốn ẨN cuốn "${title}" khỏi cửa hàng không?`)
    ) {
      try {
        await axiosClient.delete(`/volumes/${id}`);
        fetchVolumes();
      } catch (error) {
        alert("Có lỗi xảy ra khi ẩn sách!");
      }
    }
  };

  const handleRestore = async (id, title) => {
    if (window.confirm(`Hiện lại cuốn "${title}" để tiếp tục bán nhé sếp?`)) {
      try {
        await axiosClient.patch(`/volumes/restore/${id}`);
        fetchVolumes();
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
            Quản lý Sách (Volumes)
          </h1>
          <p className="text-stone-500 font-medium">
            Thêm, sửa, xóa các tập truyện trong hệ thống.
          </p>
        </div>
        <Link
          to="/admin/products/create"
          className="bg-amber-500 hover:bg-amber-600 text-stone-900 font-black py-2.5 px-6 rounded-xl transition-all shadow-md flex items-center gap-2 self-start"
        >
          <Plus size={20} /> Thêm Tập Mới
        </Link>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-stone-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm theo tên sách hoặc ISBN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 text-stone-800 font-medium rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />
        </div>
        <div className="shrink-0">
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            className="bg-stone-50 border border-stone-200 text-stone-700 font-bold rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500/50 cursor-pointer h-full"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="true">Đang bán (Hiển thị)</option>
            <option value="false">Đã ẩn (Ngừng bán)</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1 custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-stone-50 sticky top-0 z-10">
              <tr className="text-stone-500 text-sm border-b border-stone-200">
                <th className="p-4 font-bold whitespace-nowrap">Ảnh</th>
                <th className="p-4 font-bold min-w-[200px]">Tên sách</th>
                <th className="p-4 font-bold whitespace-nowrap">Bộ truyện</th>
                <th className="p-4 font-bold text-right whitespace-nowrap">
                  Giá bán
                </th>
                <th className="p-4 font-bold text-center whitespace-nowrap">
                  Tồn kho
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
              ) : volumes.length > 0 ? (
                volumes.map((vol) => (
                  <tr
                    key={vol.id}
                    className="border-b border-stone-100 hover:bg-stone-50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="w-12 h-16 bg-stone-200 rounded border border-stone-300 flex items-center justify-center overflow-hidden shrink-0">
                        {vol.coverImage ? (
                          <img
                            src={vol.coverImage}
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
                        {vol.title ||
                          `${vol.series?.title} - Tập ${vol.volumeNumber}`}
                      </p>
                      <p className="text-xs text-stone-500 mt-1">
                        ISBN: {vol.isbn || "N/A"}
                      </p>
                    </td>
                    <td className="p-4 text-sm font-bold text-stone-600">
                      {vol.series?.title || "Không rõ"}
                    </td>
                    <td className="p-4 text-right">
                      <p className="font-black text-amber-600">
                        {new Intl.NumberFormat("vi-VN").format(vol.price)}đ
                      </p>
                      {vol.originalPrice && vol.originalPrice > vol.price && (
                        <p className="text-xs text-stone-400 line-through font-bold">
                          {new Intl.NumberFormat("vi-VN").format(
                            vol.originalPrice,
                          )}
                          đ
                        </p>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-black ${
                          vol.stock > 10
                            ? "bg-green-100 text-green-700"
                            : vol.stock > 0
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {vol.stock}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {vol.isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-stone-800 text-stone-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>{" "}
                          Đang bán
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
                          to={`/admin/products/edit/${vol.id}`}
                          className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit size={18} />
                        </Link>

                        {vol.isActive ? (
                          <button
                            onClick={() =>
                              handleDelete(
                                vol.id,
                                vol.title || `Tập ${vol.volumeNumber}`,
                              )
                            }
                            className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                            title="Ẩn sách"
                          >
                            <Trash2 size={18} />
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              handleRestore(
                                vol.id,
                                vol.title || `Tập ${vol.volumeNumber}`,
                              )
                            }
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
                      Không tìm thấy cuốn sách nào sếp ạ!
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
