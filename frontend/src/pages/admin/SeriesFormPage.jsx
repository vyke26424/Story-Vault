import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, Upload, Loader2 } from "lucide-react";
import axiosClient from "../../utils/axiosClient";

const SeriesFormPage = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [categoriesList, setCategoriesList] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    author: "",
    publisher: "",
    type: "MANGA",
    status: "ONGOING",
    totalVolumes: "",
    isActive: true, // Mặc định là true
    categoryIds: [], // Chứa ID của các thể loại đang tick
  });

  useEffect(() => {
    fetchCategories();
    if (isEditMode) fetchSeriesDetail();
  }, [id]);

  const fetchCategories = async () => {
    try {
      const res = await axiosClient.get("/category");
      setCategoriesList(res.data?.data || res.data || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách thể loại:", error);
    }
  };

  const fetchSeriesDetail = async () => {
    try {
      // Để lấy chi tiết 1 series, ta tận dụng API public sếp đã viết
      const resAdmin = await axiosClient.get(`/admin/series`);
      const allSeries = resAdmin.data || [];
      const serie = allSeries.find((s) => s.id === id);

      if (serie) {
        setFormData({
          title: serie.title || "",
          slug: serie.slug || "",
          description: serie.description || "",
          author: serie.author || "",
          publisher: serie.publisher || "",
          type: serie.type || "MANGA",
          status: serie.status || "ONGOING",
          totalVolumes: serie.totalVolumes || "",
          isActive: serie.isActive,
          categoryIds: serie.categories?.map((cat) => cat.id) || [],
        });
        if (serie.coverImage) setImagePreview(serie.coverImage);
      } else {
        alert("Không tìm thấy dữ liệu bộ truyện này!");
        navigate("/admin/series");
      }
    } catch (error) {
      console.error(error);
      navigate("/admin/series");
    } finally {
      setInitialLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const submitData = new FormData();

      submitData.append("title", formData.title);
      submitData.append("type", formData.type);
      submitData.append("status", formData.status);
      submitData.append("isActive", formData.isActive);

      if (formData.slug) submitData.append("slug", formData.slug);
      if (formData.description)
        submitData.append("description", formData.description);
      if (formData.author) submitData.append("author", formData.author);
      if (formData.publisher)
        submitData.append("publisher", formData.publisher);
      if (formData.totalVolumes)
        submitData.append("totalVolumes", Number(formData.totalVolumes));

      // Thay vì submitData.append một lần, ta lặp mảng và đẩy nhiều lần cùng một key
      formData.categoryIds.forEach((id) => {
        submitData.append("categoryIds", id);
      });

      if (imageFile) {
        submitData.append("coverImage", imageFile);
      }

      if (isEditMode) {
        await axiosClient.patch(`/admin/series/${id}`, submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Cập nhật Bộ truyện thành công!");
      } else {
        if (!imageFile)
          return alert("Sếp phải tải ảnh bìa lên nhé (Bắt buộc)!");
        await axiosClient.post("/admin/series", submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Thêm Bộ truyện mới thành công!");
      }

      navigate("/admin/series");
    } catch (error) {
      console.error("Lỗi lưu Series:", error);
      const errRes = error.response?.data;
      if (errRes && Array.isArray(errRes.message)) {
        alert(
          "🚨 BÁO CÁO LỖI:\n" + errRes.message.map((m) => "❌ " + m).join("\n"),
        );
      } else {
        alert(errRes?.message || "Có lỗi bất ngờ xảy ra khi lưu Bộ truyện!");
      }
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="animate-spin text-amber-500" size={40} />
      </div>
    );
  }

  return (
    <div className="p-6 font-nunito max-w-5xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/admin/series"
          className="p-2 bg-white rounded-full shadow-sm hover:bg-stone-100 transition-colors border border-stone-200 text-stone-600"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-stone-800">
            {isEditMode ? "Chỉnh sửa Bộ Truyện" : "Thêm Bộ Truyện Mới"}
          </h1>
          <p className="text-sm font-medium text-stone-500">
            Tạo gốc rễ để sau này thêm các tập truyện (Volume) vào đây.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 space-y-5">
            <h3 className="text-lg font-black text-stone-800 border-b border-stone-100 pb-2">
              Thông tin cơ bản
            </h3>

            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">
                Tên Bộ Truyện <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full bg-stone-50 border border-stone-200 text-stone-800 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500 font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">
                  Tác giả
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                  className="w-full bg-stone-50 border border-stone-200 text-stone-800 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">
                  Nhà Xuất Bản
                </label>
                <input
                  type="text"
                  value={formData.publisher}
                  onChange={(e) =>
                    setFormData({ ...formData, publisher: e.target.value })
                  }
                  className="w-full bg-stone-50 border border-stone-200 text-stone-800 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">
                Mô tả nội dung
              </label>
              <textarea
                rows="4"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full bg-stone-50 border border-stone-200 text-stone-800 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500 custom-scrollbar"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-700 mb-3">
                Thể loại truyện (Categories)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-stone-50 p-4 border border-stone-200 rounded-xl max-h-48 overflow-y-auto">
                {categoriesList.map((cat) => (
                  <label
                    key={cat.id}
                    className="flex items-center gap-2 cursor-pointer hover:text-amber-600 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={formData.categoryIds?.includes(cat.id)}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setFormData((prev) => ({
                          ...prev,
                          categoryIds: isChecked
                            ? [...prev.categoryIds, cat.id]
                            : prev.categoryIds.filter((id) => id !== cat.id),
                        }));
                      }}
                      className="w-4 h-4 text-amber-500 rounded border-stone-300 focus:ring-amber-500"
                    />
                    <span className="text-sm font-bold text-stone-700">
                      {cat.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 space-y-5">
            <h3 className="text-lg font-black text-stone-800 border-b border-stone-100 pb-2">
              Phân loại & Tình trạng
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">
                  Thể loại (Type) <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full bg-stone-50 border border-stone-200 text-stone-800 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500 font-bold cursor-pointer"
                >
                  <option value="MANGA">Manga</option>
                  <option value="LIGHT_NOVEL">Light Novel</option>
                  <option value="NOVEL">Tiểu Thuyết</option>
                  <option value="COMIC">Comic</option>
                  <option value="BOOK">Sách</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">
                  Tình trạng (Status) <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full bg-stone-50 border border-stone-200 text-stone-800 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500 font-bold cursor-pointer"
                >
                  <option value="ONGOING">Đang tiến hành</option>
                  <option value="COMPLETED">Đã hoàn thành</option>
                  <option value="HIATUS">Tạm ngưng</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-80 shrink-0 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 flex flex-col">
            <h3 className="text-lg font-black text-stone-800 border-b border-stone-100 pb-2 mb-5">
              Ảnh Bìa Bộ Truyện
            </h3>
            <label className="relative flex flex-col items-center justify-center w-full aspect-[2/3] border-2 border-dashed border-stone-300 rounded-2xl bg-stone-50 cursor-pointer hover:bg-stone-100 transition-all overflow-hidden group">
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white text-stone-800 font-bold px-4 py-2 rounded-lg text-sm shadow-md">
                      Đổi ảnh khác
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-stone-400 group-hover:text-amber-500 transition-colors">
                  <Upload className="w-10 h-10 mb-3" />
                  <p className="mb-2 text-sm font-bold">Bấm tải ảnh lên</p>
                </div>
              )}
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 text-stone-900 font-black py-4 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 text-lg active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <Save size={24} />
            )}
            {isEditMode ? "Lưu Cập Nhật" : "Tạo Bộ Truyện"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SeriesFormPage;
