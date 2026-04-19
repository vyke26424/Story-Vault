import React, { useState, useEffect } from "react";
import {
  Search,
  Loader2,
  Users,
  ShieldAlert,
  ShieldCheck,
  Mail,
  CalendarDays,
} from "lucide-react";
import axiosClient from "../../utils/axiosClient";

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL"); // ALL, CUSTOMER, ADMIN

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/admin/user");
      setUsers(res.data?.data || res.data || []);
    } catch (error) {
      console.error("Lỗi lấy danh sách User:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    if (
      window.confirm(`Sếp có chắc muốn đổi quyền người này thành ${newRole}?`)
    ) {
      try {
        await axiosClient.patch(`/admin/user/${userId}/role`, {
          role: newRole,
        });
        alert("Cập nhật quyền thành công!");
        fetchUsers();
      } catch (error) {
        alert("Có lỗi xảy ra khi đổi quyền!");
      }
    }
  };

  // Logic Lọc: Theo Role và Theo Text Search
  const filteredUsers = users.filter((user) => {
    const matchRole = roleFilter === "ALL" || user.role === roleFilter;
    const matchSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchRole && matchSearch;
  });

  return (
    <div className="p-6 font-nunito h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-black text-stone-800 flex items-center gap-3">
            <Users className="text-amber-500" size={32} /> Quản lý Tài khoản
          </h1>
          <p className="text-stone-500 font-medium">
            Theo dõi Khách hàng và Cấp quyền Nhân viên/Admin.
          </p>
        </div>
      </div>

      {/* THANH CÔNG CỤ: TÌM KIẾM & BỘ LỌC */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-stone-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm theo Tên hoặc Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 text-stone-800 font-medium rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />
        </div>

        <div className="flex gap-2">
          {["ALL", "CUSTOMER", "ADMIN"].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                roleFilter === role
                  ? "bg-amber-500 text-stone-900 shadow-md"
                  : "bg-stone-100 text-stone-500 hover:bg-stone-200"
              }`}
            >
              {role === "ALL"
                ? "Tất cả"
                : role === "CUSTOMER"
                  ? "Khách Hàng"
                  : "Quản Trị Viên"}
            </button>
          ))}
        </div>
      </div>

      {/* BẢNG DỮ LIỆU */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1 custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-stone-50 sticky top-0 z-10">
              <tr className="text-stone-500 text-sm border-b border-stone-200">
                <th className="p-4 font-bold">Người Dùng</th>
                <th className="p-4 font-bold">Thông Tin Liên Hệ</th>
                <th className="p-4 font-bold text-center">Ngày Tham Gia</th>
                <th className="p-4 font-bold text-center">Số Đơn Hàng</th>
                <th className="p-4 font-bold text-center">Quyền (Role)</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center">
                    <Loader2
                      className="animate-spin text-amber-500 mx-auto mb-2"
                      size={32}
                    />
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-stone-100 hover:bg-stone-50 transition-colors"
                  >
                    {/* Avatar + Tên */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center border border-amber-200 overflow-hidden shrink-0">
                          {user.avatarUrl ? (
                            <img
                              src={user.avatarUrl}
                              alt="Avatar"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="font-black text-amber-600">
                              {user.name?.charAt(0).toUpperCase() || "U"}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-black text-stone-800">
                            {user.name || "Người dùng ẩn danh"}
                          </p>
                          <p className="text-xs text-stone-400 font-mono mt-0.5">
                            ID: {user.id.substring(0, 8)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-stone-600">
                        <Mail size={14} className="text-stone-400" />
                        {user.email}
                      </div>
                    </td>

                    {/* Ngày tạo */}
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2 text-sm font-medium text-stone-600">
                        <CalendarDays size={14} className="text-stone-400" />
                        {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                      </div>
                    </td>

                    {/* Thống kê đơn hàng */}
                    <td className="p-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-black ${
                          user._count?.orders >= 10
                            ? "bg-purple-100 text-purple-700" // Mua nhiều -> VIP
                            : user._count?.orders > 0
                              ? "bg-green-100 text-green-700"
                              : "bg-stone-100 text-stone-500"
                        }`}
                      >
                        {user._count?.orders || 0} đơn
                      </span>
                    </td>

                    {/* Phân quyền */}
                    <td className="p-4 text-center">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user.id, e.target.value)
                        }
                        className={`text-xs font-bold uppercase tracking-wider rounded-lg px-3 py-2 border-2 cursor-pointer focus:outline-none transition-colors
                          ${
                            user.role === "ADMIN"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-stone-50 text-stone-600 border-stone-200"
                          }
                        `}
                      >
                        <option value="CUSTOMER">Khách Hàng</option>
                        <option value="ADMIN">Quản Trị Viên (Admin)</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="p-12 text-center text-stone-500 font-bold"
                  >
                    Không tìm thấy người dùng nào!
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

export default UserListPage;
