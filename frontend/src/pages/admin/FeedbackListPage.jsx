import React, { useState, useEffect } from "react";
import { MessageSquare, CheckCircle, Clock, Check } from "lucide-react";
import axiosClient from "../../utils/axiosClient";

const FeedbackListPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gọi API lấy danh sách Feedback
  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/feedback");
      // Backend trả về { data: [...] }
      setFeedbacks(res.data?.data || res.data || []);
    } catch (error) {
      console.error("Lỗi khi tải feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // Hàm xử lý khi sếp bấm nút "Đã xử lý"
  const handleResolve = async (id) => {
    if (!window.confirm("Đánh dấu góp ý này là đã xử lý?")) return;
    try {
      await axiosClient.patch(`/feedback/${id}/resolve`);
      // Cập nhật lại UI ngay lập tức
      setFeedbacks(feedbacks.map(fb => fb.id === id ? { ...fb, status: 'RESOLVED' } : fb));
    } catch (error) {
      alert("Có lỗi xảy ra khi cập nhật!");
    }
  };

  // Hàm render loại Feedback cho đẹp
  const renderType = (type) => {
    const types = {
      'GOP_Y': { label: 'Góp ý', color: 'bg-blue-100 text-blue-700' },
      'BAO_LOI': { label: 'Báo lỗi', color: 'bg-red-100 text-red-700' },
      'YEU_CAU_SACH': { label: 'Yêu cầu sách', color: 'bg-purple-100 text-purple-700' },
      'KHIEU_NAI': { label: 'Khiếu nại', color: 'bg-orange-100 text-orange-700' },
    };
    const t = types[type] || { label: type, color: 'bg-gray-100 text-gray-700' };
    return <span className={`px-2 py-1 rounded text-xs font-bold ${t.color}`}>{t.label}</span>;
  };

  if (loading) return <div className="p-8 text-center text-gray-500 font-bold animate-pulse">Đang tải danh sách góp ý...</div>;

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-white rounded-xl shadow-sm border border-stone-200 text-sv-brown">
          <MessageSquare size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-stone-800">Quản lý Góp ý & Báo lỗi</h1>
          <p className="text-stone-500 text-sm font-medium">Lắng nghe để phát triển Story Vault tốt hơn.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-600">
                <th className="p-4 font-bold text-sm">Khách hàng</th>
                <th className="p-4 font-bold text-sm">Chủ đề</th>
                <th className="p-4 font-bold text-sm">Nội dung</th>
                <th className="p-4 font-bold text-sm">Ngày gửi</th>
                <th className="p-4 font-bold text-sm">Trạng thái</th>
                <th className="p-4 font-bold text-sm text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {feedbacks.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-stone-500 font-medium">Chưa có góp ý nào.</td>
                </tr>
              ) : (
                feedbacks.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-stone-800">{item.user?.name || "Khách vãng lai"}</div>
                      <div className="text-xs text-stone-500">{item.email}</div>
                    </td>
                    <td className="p-4">{renderType(item.type)}</td>
                    <td className="p-4 text-sm text-stone-700 max-w-xs truncate" title={item.content}>
                      {item.content}
                    </td>
                    <td className="p-4 text-sm text-stone-500">
                      {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="p-4">
                      {item.status === 'RESOLVED' ? (
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
                      {item.status === 'PENDING' && (
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
      </div>
    </div>
  );
};

export default FeedbackListPage;