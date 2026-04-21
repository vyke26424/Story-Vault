import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import axiosClient from "../../utils/axiosClient";

const CategoryFormPage = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });

  useEffect(() => {
    if (isEditMode) {
      // Fetch dữ liệu category cũ
      axiosClient
        .get(`/category/${id}`)
        .then((res) => {
          const cat = res.data?.data || res.data;
          setFormData({
            name: cat.name,
            slug: cat.slug || "",
            description: cat.description || "",
          });
        })
        .catch(() => navigate("/admin/categories"));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Thể loại không có ảnh, dùng JSON đẩy thẳng cho nhẹ
      if (isEditMode) {
        await axiosClient.patch(`/category/${id}`, formData);
        alert("Cập nhật thành công!");
      } else {
        await axiosClient.post("/category", formData);
        alert("Thêm thể loại thành công!");
      }
      navigate("/admin/categories");
    } catch (error) {
      alert(error.response?.data?.message || "Có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 font-nunito max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/admin/categories"
          className="p-2 bg-white rounded-full border border-stone-200"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-black text-stone-800">
          {isEditMode ? "Sửa Thể Loại" : "Thêm Thể Loại"}
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 space-y-5"
      >
        <div>
          <label className="block text-sm font-bold text-stone-700 mb-2">
            Tên Thể Loại <span className="text-red-500">*</span>
          </label>
          <input
            required
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500 font-bold"
            placeholder="VD: Hành Động (Shonen)"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-stone-700 mb-2">
            Đường dẫn (Slug - Tùy chọn)
          </label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500"
            placeholder="Dể trống tự động tạo"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-stone-700 mb-2">
            Mô tả
          </label>
          <textarea
            rows="3"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-500 hover:bg-amber-600 text-stone-900 font-black py-3 rounded-xl flex justify-center gap-2 mt-4"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Save />} Lưu Thể
          Loại
        </button>
      </form>
    </div>
  );
};

export default CategoryFormPage;
