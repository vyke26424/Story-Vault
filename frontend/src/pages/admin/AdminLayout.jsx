import React, { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookCopy,
  Library,
  ShoppingCart,
  Users,
  LogOut,
  Menu,
  ChevronLeft,
  Tags,
} from "lucide-react";
import useAuthStore from "../../store/useAuthStore";
import axiosClient from "../../utils/axiosClient";

const AdminLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    if (
      window.confirm("Bạn có chắc chắn muốn đăng xuất khỏi trang Quản trị?")
    ) {
      try {
        // Báo cho Server biết để xóa cookie/token (nếu cần)
        await axiosClient.post("/auth/logout");
      } catch (error) {
        console.error("Lỗi đăng xuất:", error);
      } finally {
        logout(); // Xóa dưới Client
        navigate("/login"); // Đá văng về trang Login thay vì trang chủ
      }
    }
  };

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
    { name: "Bộ Truyện / Sách", icon: Library, path: "/admin/series" },
    {
      name: "Tập Truyện (Vol) / Sách",
      icon: BookCopy,
      path: "/admin/products",
    },
    { name: "Thể loại", icon: Tags, path: "/admin/categories" },
    { name: "Đơn hàng", icon: ShoppingCart, path: "/admin/orders" },
    { name: "Kho", icon: ShoppingCart, path: "/admin/stocks" },
    { name: "Khách hàng", icon: Users, path: "/admin/users" },
    { name: "Đánh giá", icon: Users, path: "/admin/reviews" },
    { name: "Phản hồi", icon: Users, path: "/admin/feedbacks" },
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex font-sans">
      {/* SIDEBAR */}
      <aside
        className={`bg-stone-900 text-stone-300 flex flex-col transition-all duration-300 ease-in-out relative shrink-0 z-20 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Nút thu/phóng Sidebar */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-8 bg-amber-500 text-stone-900 rounded-full p-1 shadow-lg hover:bg-amber-400 transition-colors z-10"
        >
          {isCollapsed ? <Menu size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* Logo -> Nhấn để về Trang chủ */}
        <div className="h-20 flex items-center justify-center border-b border-stone-800 shrink-0">
          <Link
            to="/"
            className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform"
            title="Về trang chủ khách hàng"
          >
            {/* Đổi thành .svg */}
            <img src="/favicon.svg" alt="Logo Admin" className="h-8 w-auto" />
            {!isCollapsed && (
              <h1 className="text-xl font-black text-white tracking-tight">
                Story Vault.
              </h1>
            )}
          </Link>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            // Logic isActive:
            // - Dashboard (/admin): Sáng khi path chính xác là /admin
            // - Các mục khác: Sáng khi path bắt đầu bằng path của mục đó (vd: /admin/categories/create)
            const isActive =
              item.path === "/admin"
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.name}
                to={item.path}
                title={isCollapsed ? item.name : ""}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-amber-500/10 text-amber-500 font-bold"
                    : "hover:bg-stone-800 hover:text-white"
                } ${isCollapsed ? "justify-center" : "justify-start"}`}
              >
                <item.icon size={20} />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Nút Đăng xuất ở cuối */}
        <div className="p-4 border-t border-stone-800 shrink-0">
          <button
            onClick={handleLogout}
            title={isCollapsed ? "Đăng xuất" : ""}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all ${
              isCollapsed ? "justify-center" : "justify-start"
            }`}
          >
            <LogOut size={20} />
            {!isCollapsed && <span className="font-bold">Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header nhỏ của Admin */}
        <header className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-8 shrink-0 shadow-sm z-10">
          <h2 className="text-lg font-black text-stone-800 uppercase tracking-wider">
            Trạm Điều Khiển
          </h2>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 font-black flex items-center justify-center border border-amber-200 overflow-hidden shadow-inner">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : user?.name ? (
                user.name.charAt(0).toUpperCase()
              ) : (
                "A"
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-stone-800 leading-none">
                {user?.name || "Admin"}
              </span>
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mt-1">
                Super Admin
              </span>
            </div>
          </div>
        </header>

        {/* Khu vực chứa trang con */}
        <div className="flex-1 overflow-auto bg-stone-50">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
