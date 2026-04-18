import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import {
  Camera,
  User,
  Mail,
  Save,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Lock,
  ArrowRight,
  Loader2,
} from "lucide-react";
import axiosClient from "../utils/axiosClient";

const ProfilePage = () => {
  const { user, setAuth, accessToken } = useAuthStore();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [stats, setStats] = useState({
    pending: 0,
    confirmed: 0,
    shipping: 0,
    delivered: 0,
    cancelled: 0,
    recentOrders: [],
  });

  const [loadingStats, setLoadingStats] = useState(true);
  const [isSavingInfo, setIsSavingInfo] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  useEffect(() => {
    fetchOrderStats();
  }, []);

  const fetchOrderStats = async () => {
    try {
      setLoadingStats(true);
      const res = await axiosClient.get("/order/stats");
      setStats(res.data?.data || res.data || stats);
    } catch (error) {
      console.error("Lỗi lấy thống kê đơn hàng:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleInfoChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSaveInfo = async (e) => {
    e.preventDefault();
    try {
      setIsSavingInfo(true);
      // Gọi API và lấy về data user mới nhất từ backend
      const response = await axiosClient.put("/user/profile", {
        name: formData.name,
      });
      const updatedUser = response.data.data; // Backend trả về { message, data: user }

      alert("Cập nhật thông tin thành công!");
      setAuth(updatedUser, accessToken); // Dùng user mới nhất (trong `data`) để cập nhật store
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Có lỗi xảy ra khi cập nhật thông tin!",
      );
    } finally {
      setIsSavingInfo(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return alert("Mật khẩu xác nhận không khớp!");
    }
    try {
      setIsSavingPassword(true);
      // SỬA LỖI: Sếp gõ dư một chữ "/user", đúng endpoint chỉ là "/user/change-password"
      await axiosClient.put("/user/change-password", {
        oldPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      alert("Đổi mật khẩu thành công!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      alert(error.response?.data?.message || "Có lỗi xảy ra khi đổi mật khẩu!");
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-sv-cream py-8 md:py-12 font-nunito text-sv-brown">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* CỘT TRÁI */}
          <div className="space-y-6">
            {/* Box 1: Ảnh đại diện & Tên */}
            <div className="bg-white rounded-3xl border border-sv-tan p-6 shadow-sm flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="w-28 h-28 rounded-full border-4 border-sv-brown bg-sv-pale flex items-center justify-center overflow-hidden shadow-inner">
                  <span className="text-4xl font-black text-sv-brown">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </span>
                </div>
                <button className="absolute bottom-0 right-0 bg-sv-wheat border border-sv-tan p-2 rounded-full hover:bg-sv-tan transition-colors shadow-sm text-sv-brown">
                  <Camera size={16} />
                </button>
              </div>
              <h2 className="text-xl font-black uppercase text-sv-brown">
                {user?.name}
              </h2>
              <p className="text-gray-500 text-sm mb-4 font-medium">
                [{user?.email}]
              </p>
              <div className="bg-sv-brown text-white font-bold text-sm px-4 py-1.5 rounded-full shadow-sm">
                Khách hàng thân thiết
              </div>
            </div>

            {/* Box 2: Thống kê đơn hàng */}
            <div className="bg-white rounded-3xl border border-sv-tan p-6 shadow-sm">
              <h3 className="text-lg font-black flex items-center gap-2 mb-4 text-sv-brown">
                <Package size={20} className="text-sv-tan" /> Thống kê đơn hàng
              </h3>

              {loadingStats ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="animate-spin text-sv-brown" size={24} />
                </div>
              ) : (
                // 👉 SỬA CHỖ NÀY: Dùng flex-nowrap và overflow-x-auto để tạo hàng ngang vuốt được
                <div className="flex flex-nowrap overflow-x-auto gap-3 pb-2 custom-scrollbar snap-x">
                  {/* Ô 1: Chờ xử lý */}
                  <div className="flex-1 min-w-[85px] snap-start bg-sv-pale rounded-2xl border border-sv-tan p-3 flex flex-col items-center text-center transition-transform hover:-translate-y-1">
                    <Clock size={24} className="mb-1 text-yellow-600" />
                    <span className="text-xl font-black text-sv-brown">
                      {stats.pending}
                    </span>
                    <span className="text-[10px] font-bold uppercase text-gray-500 mt-1 whitespace-nowrap">
                      Chờ xử lý
                    </span>
                  </div>

                  {/* Ô 2: Đã chốt */}
                  <div className="flex-1 min-w-[85px] snap-start bg-sv-pale rounded-2xl border border-sv-tan p-3 flex flex-col items-center text-center transition-transform hover:-translate-y-1">
                    <CheckCircle size={24} className="mb-1 text-blue-500" />
                    <span className="text-xl font-black text-sv-brown">
                      {stats.confirmed}
                    </span>
                    <span className="text-[10px] font-bold uppercase text-gray-500 mt-1 whitespace-nowrap">
                      Đã chốt
                    </span>
                  </div>

                  {/* Ô 3: Đang giao */}
                  <div className="flex-1 min-w-[85px] snap-start bg-sv-pale rounded-2xl border border-sv-tan p-3 flex flex-col items-center text-center transition-transform hover:-translate-y-1">
                    <Package size={24} className="mb-1 text-orange-500" />
                    <span className="text-xl font-black text-sv-brown">
                      {stats.shipping}
                    </span>
                    <span className="text-[10px] font-bold uppercase text-gray-500 mt-1 whitespace-nowrap">
                      Đang giao
                    </span>
                  </div>

                  {/* Ô 4: Đã giao */}
                  <div className="flex-1 min-w-[85px] snap-start bg-sv-pale rounded-2xl border border-sv-tan p-3 flex flex-col items-center text-center transition-transform hover:-translate-y-1">
                    <CheckCircle size={24} className="mb-1 text-green-600" />
                    <span className="text-xl font-black text-sv-brown">
                      {stats.delivered}
                    </span>
                    <span className="text-[10px] font-bold uppercase text-gray-500 mt-1 whitespace-nowrap">
                      Đã giao
                    </span>
                  </div>

                  {/* Ô 5: Đã hủy */}
                  <div className="flex-1 min-w-[85px] snap-start bg-sv-pale rounded-2xl border border-sv-tan p-3 flex flex-col items-center text-center transition-transform hover:-translate-y-1">
                    <XCircle size={24} className="mb-1 text-red-600" />
                    <span className="text-xl font-black text-sv-brown">
                      {stats.cancelled}
                    </span>
                    <span className="text-[10px] font-bold uppercase text-gray-500 mt-1 whitespace-nowrap">
                      Đã hủy
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CỘT PHẢI */}
          <div className="lg:col-span-2 space-y-6">
            {/* Box 3: Thông tin tài khoản */}
            <div className="bg-white rounded-3xl border border-sv-tan p-6 shadow-sm">
              <h3 className="text-lg font-black flex items-center gap-2 mb-4 border-b border-sv-pale pb-3 text-sv-brown">
                <User size={20} className="text-sv-tan" /> Thông tin tài khoản
              </h3>
              <form onSubmit={handleSaveInfo}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-1.5">
                      Họ và tên
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={18} className="text-sv-tan" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInfoChange}
                        className="w-full bg-sv-pale border border-sv-tan text-sv-brown font-bold rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sv-brown"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-1.5">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled
                        className="w-full bg-gray-100 border border-gray-200 text-gray-500 font-medium rounded-xl pl-10 pr-4 py-2.5 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    disabled={isSavingInfo}
                    className="bg-sv-brown hover:bg-opacity-90 text-white font-bold py-2.5 px-6 rounded-xl transition-colors flex items-center gap-2 shadow-md disabled:opacity-70"
                  >
                    {isSavingInfo ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <Save size={18} />
                    )}
                    Lưu thay đổi
                  </button>
                </div>
              </form>
            </div>

            {/* Box 4: Đơn hàng mới nhất */}
            <div className="bg-white rounded-3xl border border-sv-tan p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4 border-b border-sv-pale pb-3">
                <h3 className="text-lg font-black flex items-center gap-2 text-sv-brown">
                  <Package size={20} className="text-sv-tan" /> Đơn hàng mới
                  nhất
                </h3>
                <Link
                  to="/profile/orders"
                  className="text-sm font-bold text-gray-500 hover:text-sv-brown flex items-center gap-1 transition-colors"
                >
                  Xem tất cả <ArrowRight size={14} />
                </Link>
              </div>

              {loadingStats ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="animate-spin text-sv-brown" size={24} />
                </div>
              ) : stats.recentOrders && stats.recentOrders.length > 0 ? (
                <div className="space-y-3">
                  {/* 👉 Đổi stats.latestOrders thành stats.recentOrders */}
                  {stats.recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-sv-wheat border border-sv-tan rounded-2xl p-4 flex flex-col md:flex-row justify-between md:items-center gap-4 transition-transform hover:-translate-y-1 hover:shadow-md cursor-pointer"
                    >
                      <div>
                        <h4 className="font-black text-sv-brown text-lg">
                          {order.id}
                        </h4>
                        <p className="text-sm text-gray-600 font-medium">
                          {/* 👉 Bỏ phần đếm sản phẩm đi vì Backend không còn gửi items nữa */}
                          {new Date(order.createdAt).toLocaleDateString(
                            "vi-VN",
                          )}
                        </p>
                      </div>
                      <div className="text-left md:text-right">
                        <p className="font-black text-sv-brown text-lg">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(order.finalAmount)}
                        </p>
                        <p className="text-xs font-bold text-sv-brown tracking-wider uppercase mt-1">
                          {order.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500 font-medium">
                  Sếp chưa có đơn hàng nào.
                </div>
              )}
            </div>

            {/* Box 5: Đổi mật khẩu */}
            <div className="bg-white rounded-3xl border border-sv-tan p-6 shadow-sm">
              <h3 className="text-lg font-black flex items-center gap-2 mb-4 border-b border-sv-pale pb-3 text-sv-brown">
                <Lock size={20} className="text-sv-tan" /> Đổi mật khẩu
              </h3>
              <form onSubmit={handleSavePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-1.5">
                    Mật khẩu hiện tại
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full bg-sv-pale border border-sv-tan text-sv-brown font-medium rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sv-brown"
                    placeholder="••••••••"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-1.5">
                      Mật khẩu mới
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                      className="w-full bg-sv-pale border border-sv-tan text-sv-brown font-medium rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sv-brown"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-1.5">
                      Xác nhận mật khẩu mới
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                      className="w-full bg-sv-pale border border-sv-tan text-sv-brown font-medium rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sv-brown"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    disabled={isSavingPassword}
                    className="bg-sv-brown hover:bg-opacity-90 text-white font-bold py-2.5 px-6 rounded-xl transition-colors flex items-center gap-2 shadow-md disabled:opacity-70"
                  >
                    {isSavingPassword ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <Save size={18} />
                    )}
                    Cập nhật mật khẩu
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
