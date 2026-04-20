import React, { useState } from "react";
import {
  MessageSquarePlus,
  X,
  Send,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import axiosClient from "../utils/axiosClient";
import useAuthStore from "../store/useAuthStore";

const FloatingFeedback = () => {
  const { isAuthenticated, user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    type: "GOP_Y",
    email: isAuthenticated ? user?.email : "",
    content: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.content.trim()) return alert("Vui lòng nhập nội dung!");
    if (!isAuthenticated && !formData.email.trim())
      return alert("Vui lòng nhập email để chúng tôi phản hồi!");

    try {
      setIsSubmitting(true);
      await axiosClient.post("/feedback", formData);
      setIsSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsSuccess(false);
        setFormData({ ...formData, content: "" }); // Reset form
      }, 3000);
    } catch (error) {
      alert(
        error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại sau!",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60] font-nunito">
      {/* Khung Form Feedback */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[320px] sm:w-[360px] bg-white rounded-2xl shadow-2xl border border-sv-tan overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-sv-brown p-4 flex items-center justify-between text-white">
            <h3 className="font-black flex items-center gap-2">
              <MessageSquarePlus size={20} /> Góp ý & Báo lỗi
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-1 rounded-md transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-5">
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <CheckCircle2 size={48} className="text-green-500 mb-3" />
                <p className="font-bold text-sv-brown">Gửi thành công!</p>
                <p className="text-sm text-gray-500 mt-1">
                  Cảm ơn Bạn đã đóng góp ý kiến để Story Vault tốt hơn.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">
                    Chủ đề
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full bg-sv-pale border border-sv-tan rounded-lg px-3 py-2 text-sm font-bold text-sv-brown focus:outline-none focus:ring-2 focus:ring-sv-brown"
                  >
                    <option value="GOP_Y">Góp ý chung</option>
                    <option value="BAO_LOI">Báo lỗi Website</option>
                    <option value="YEU_CAU_SACH">Yêu cầu thêm truyện</option>
                    <option value="KHIEU_NAI">Khiếu nại dịch vụ</option>
                  </select>
                </div>

                {!isAuthenticated && (
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">
                      Email liên hệ (Bắt buộc)
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="Email của Bạn..."
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full bg-sv-pale border border-sv-tan rounded-lg px-3 py-2 text-sm font-bold text-sv-brown focus:outline-none focus:ring-2 focus:ring-sv-brown"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">
                    Nội dung
                  </label>
                  <textarea
                    rows="4"
                    required
                    placeholder="Nội dung muốn góp ý..."
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    className="w-full bg-white border border-sv-tan rounded-lg px-3 py-2 text-sm text-sv-brown focus:outline-none focus:ring-2 focus:ring-sv-brown custom-scrollbar"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-sv-brown text-white font-bold py-2.5 rounded-xl hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      <Send size={18} /> Gửi Ý Kiến
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Nút Bấm Tròn Góc Phải */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 ${isOpen ? "bg-red-500 rotate-90" : "bg-sv-brown"}`}
      >
        {isOpen ? <X size={28} /> : <MessageSquarePlus size={28} />}
      </button>
    </div>
  );
};

export default FloatingFeedback;
