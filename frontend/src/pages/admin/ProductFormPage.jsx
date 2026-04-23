import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Upload,
  Image as ImageIcon,
  Loader2,
  Copy,
} from "lucide-react";
import axiosClient from "../../utils/axiosClient";

const ProductFormPage = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [seriesList, setSeriesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrlInput, setImageUrlInput] = useState("");

  const [formData, setFormData] = useState({
    seriesId: "",
    volumeNumber: "",
    title: "",
    price: "",
    originalPrice: "",
    stock: "",
    isbn: "",
    publishDate: "",
    isActive: true,
  });

  useEffect(() => {
    fetchSeries();
    if (isEditMode) fetchVolumeDetail();
  }, [id]);

  const fetchSeries = async () => {
    try {
      const res = await axiosClient.get("/admin/series", {
        params: { limit: 1000 },
      });
      setSeriesList(res.data?.data || res.data || []);
    } catch (error) {
      console.error("Lỗi lấy danh sách Series:", error);
    }
  };

  const fetchVolumeDetail = async () => {
    try {
      const res = await axiosClient.get(`/volumes/${id}`);
      const vol = res.data?.data || res.data;
      if (vol) {
        setFormData({
          seriesId: vol.seriesId || "",
          volumeNumber: vol.volumeNumber ?? "",
          title: vol.title || "",
          price: vol.price ?? "",
          originalPrice: vol.originalPrice ?? "",
          stock: vol.stock ?? "",
          isbn: vol.isbn || "",
          publishDate: vol.publishDate
            ? new Date(vol.publishDate).toISOString().split("T")[0]
            : "",
          isActive: vol.isActive,
        });
        if (vol.coverImage) {
          setImagePreview(vol.coverImage);
          setImageUrlInput(vol.coverImage);
        }
      }
    } catch (error) {
      alert("Không tìm thấy dữ liệu tập truyện này!");
      navigate("/admin/products");
    } finally {
      setInitialLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setImageUrlInput(url);
    }
  };

  const handleImageUrlChange = (e) => {
    const val = e.target.value;
    setImageUrlInput(val);
    setImagePreview(val);
    setImageFile(null); // Nếu nhập URL thì bỏ file để ưu tiên URL
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.seriesId) {
      return alert("Sếp phải chọn Bộ truyện (Series) cho tập này nhé!");
    }

    try {
      setLoading(true);

      const submitData = new FormData();
      submitData.append("seriesId", formData.seriesId);
      submitData.append("volumeNumber", formData.volumeNumber);
      submitData.append("price", formData.price);
      submitData.append("stock", formData.stock);

      if (formData.title) submitData.append("title", formData.title);
      // Ngăn ngừa gửi chuỗi rỗng lên báo lỗi IsNumber
      if (formData.originalPrice !== "")
        submitData.append("originalPrice", formData.originalPrice);
      if (formData.isbn) submitData.append("isbn", formData.isbn);

      if (formData.publishDate) {
        submitData.append(
          "publishDate",
          new Date(formData.publishDate).toISOString(),
        );
      }

      // Ép kiểu chuẩn khi đẩy bằng FormData
      submitData.append("isActive", formData.isActive);

      if (imageFile) {
        submitData.append("coverImage", imageFile);
      } else if (imageUrlInput) {
        submitData.append("coverImage", imageUrlInput);
      }

      if (isEditMode) {
        await axiosClient.patch(`/volumes/${id}`, submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Cập nhật sách thành công!");
      } else {
        await axiosClient.post("/volumes", submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Thêm sách mới thành công!");
      }

      navigate("/admin/products");
    } catch (error) {
      console.error("Lỗi lưu sách:", error);

      // ĐÃ FIX: Bắt và bung chi tiết lỗi từ NestJS DTO (Trả về dạng Mảng hoặc Chuỗi)
      const errRes = error.response?.data;
      if (errRes && Array.isArray(errRes.message)) {
        alert(
          "🚨 BÁO CÁO LỖI ĐIỀN FORM:\n" +
            errRes.message.map((m) => "❌ " + m).join("\n"),
        );
      } else {
        alert(errRes?.message || "Có lỗi bất ngờ xảy ra khi lưu sách!");
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
          to="/admin/products"
          className="p-2 bg-white rounded-full shadow-sm hover:bg-stone-100 transition-colors border border-stone-200 text-stone-600"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-stone-800">
            {isEditMode ? "Chỉnh sửa Tập Truyện" : "Thêm Tập Truyện Mới"}
          </h1>
          <p className="text-sm font-medium text-stone-500">
            Điền các thông tin bên dưới để {isEditMode ? "cập nhật" : "đăng"}{" "}
            sách lên hệ thống.
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
                Thuộc Bộ truyện (Series) <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.seriesId}
                onChange={(e) =>
                  setFormData({ ...formData, seriesId: e.target.value })
                }
                className="w-full bg-stone-50 border border-stone-200 text-stone-800 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-medium"
              >
                <option value="" disabled>
                  -- Hãy chọn bộ truyện --
                </option>
                {seriesList.map((series) => (
                  <option key={series.id} value={series.id}>
                    {series.title} {series.isActive ? "" : "(Đã ẩn)"}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">
                  Tập số <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.volumeNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      volumeNumber:
                        e.target.value === "" ? "" : Number(e.target.value),
                    })
                  }
                  className="w-full bg-stone-50 border border-stone-200 text-stone-800 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500 font-bold"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">
                  Mã ISBN (Tùy chọn)
                </label>
                <input
                  type="text"
                  placeholder="VD: 978-604-2-..."
                  value={formData.isbn}
                  onChange={(e) =>
                    setFormData({ ...formData, isbn: e.target.value })
                  }
                  className="w-full bg-stone-50 border border-stone-200 text-stone-800 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">
                Tên phụ của tập (Tùy chọn)
              </label>
              <input
                type="text"
                placeholder="VD: Hồi kết của kỷ nguyên..."
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full bg-stone-50 border border-stone-200 text-stone-800 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 space-y-5">
            <h3 className="text-lg font-black text-stone-800 border-b border-stone-100 pb-2">
              Kinh doanh & Tồn kho
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">
                  Giá bán (VNĐ) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price:
                        e.target.value === "" ? "" : Number(e.target.value),
                    })
                  }
                  className="w-full bg-stone-50 border border-stone-200 text-amber-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500 font-black text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">
                  Giá bìa gốc (VNĐ)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.originalPrice}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      originalPrice:
                        e.target.value === "" ? "" : Number(e.target.value),
                    })
                  }
                  className="w-full bg-stone-50 border border-stone-200 text-stone-500 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500 font-bold line-through decoration-stone-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">
                  Số lượng trong kho <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stock:
                        e.target.value === "" ? "" : Number(e.target.value),
                    })
                  }
                  className="w-full bg-stone-50 border border-stone-200 text-stone-800 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500 font-bold"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">
                  Ngày phát hành
                </label>
                <input
                  type="date"
                  value={formData.publishDate}
                  onChange={(e) =>
                    setFormData({ ...formData, publishDate: e.target.value })
                  }
                  className="w-full bg-stone-50 border border-stone-200 text-stone-800 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer p-4 bg-stone-50 rounded-xl border border-stone-200 mt-4 group hover:bg-stone-100 transition-colors">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="w-5 h-5 text-amber-500 bg-white border-stone-300 rounded focus:ring-amber-500 cursor-pointer"
              />
              <span className="font-bold text-stone-700 group-hover:text-amber-700">
                Đăng bán ngay (Hiển thị trên Web)
              </span>
            </label>
          </div>
        </div>

        <div className="w-full md:w-80 shrink-0 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 flex flex-col">
            <h3 className="text-lg font-black text-stone-800 border-b border-stone-100 pb-2 mb-5">
              Ảnh Bìa Tập
            </h3>

            <label className="relative flex flex-col items-center justify-center w-full aspect-[2/3] border-2 border-dashed border-stone-300 rounded-2xl bg-stone-50 cursor-pointer hover:bg-stone-100 hover:border-amber-400 transition-all overflow-hidden group">
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
                  <p className="mb-2 text-sm font-bold">Bấm để tải ảnh lên</p>
                  <p className="text-xs font-medium">PNG, JPG, WEBP</p>
                </div>
              )}
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>

            {/* Hộp input đường dẫn ảnh cho phép copy / paste */}
            <div className="mt-4">
              <label className="block text-sm font-bold text-stone-700 mb-2">
                Đường dẫn ảnh (URL)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={imageUrlInput}
                  onChange={handleImageUrlChange}
                  className="w-full bg-stone-50 border border-stone-200 text-stone-800 rounded-xl px-4 py-2 focus:ring-2 focus:ring-amber-500 font-medium text-sm"
                  placeholder="https://..."
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(imageUrlInput);
                    alert("Đã copy đường dẫn ảnh!");
                  }}
                  className="p-2 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-xl text-stone-600 transition-colors"
                  title="Copy URL"
                >
                  <Copy size={20} />
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 text-stone-900 font-black py-4 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 text-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <Save size={24} />
            )}
            {isEditMode ? "Lưu Cập Nhật" : "Tạo Tập Truyện Mới"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductFormPage;
