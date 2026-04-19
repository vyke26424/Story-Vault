import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Loader2, Tags } from "lucide-react";
import { Link } from "react-router-dom";
import axiosClient from "../../utils/axiosClient";

const CategoryListPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get(`/category`);
      setCategories(res.data?.data || res.data || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh mục:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id, name) => {
    if (
      window.confirm(`Sếp có chắc muốn XÓA VĨNH VIỄN thể loại "${name}" không?`)
    ) {
      try {
        await axiosClient.delete(`/category/${id}`);
        fetchCategories();
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

      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 flex-1 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-stone-50">
            <tr className="text-stone-500 text-sm border-b border-stone-200">
              <th className="p-4 font-bold">Tên Thể Loại</th>
              <th className="p-4 font-bold">Mã Slug</th>
              <th className="p-4 font-bold">Mô tả</th>
              <th className="p-4 font-bold text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="p-8 text-center">
                  <Loader2
                    className="animate-spin text-amber-500 mx-auto"
                    size={32}
                  />
                </td>
              </tr>
            ) : categories.length > 0 ? (
              categories.map((cat) => (
                <tr
                  key={cat.id}
                  className="border-b border-stone-100 hover:bg-stone-50"
                >
                  <td className="p-4 font-black text-stone-800">{cat.name}</td>
                  <td className="p-4 text-stone-500 font-medium">{cat.slug}</td>
                  <td className="p-4 text-stone-600 text-sm">
                    {cat.description || "Không có mô tả"}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      <Link
                        to={`/admin/categories/edit/${cat.id}`}
                        className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="p-8 text-center text-stone-500 font-bold"
                >
                  Chưa có thể loại nào sếp ạ!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryListPage;
