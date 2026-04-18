import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, Package, ChevronDown } from "lucide-react";
import useCartStore from "../store/useCartStore";
import useAuthStore from "../store/useAuthStore";
import axiosClient from "../utils/axiosClient";

const Header = () => {
  const cartItemCount = useCartStore((state) =>
    state.cart.reduce((total, item) => total + item.quantity, 0),
  );
  const { user, isAuthenticated, logout } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch(e);
  };

  const handleLogout = async () => {
    try {
      await axiosClient.post("/auth/logout");
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    } finally {
      logout(); // Xóa token trong Zustand
      setIsDropdownOpen(false); // Đóng menu
      navigate("/login"); // Đá về trang đăng nhập
    }
  };

  return (
    // Dùng nền sv-cream cho Header
    <header className="bg-sv-cream/90 backdrop-blur-md border-b border-sv-tan sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-wrap md:flex-nowrap justify-between items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span className="text-3xl">📚</span>
            {/* Chữ Logo màu Nâu đặc trưng */}
            <h1 className="text-2xl font-black text-sv-brown tracking-tight">
              Story Vault.
            </h1>
          </Link>

          <div className="w-full md:w-auto flex-1 max-w-xl hidden sm:block">
            <div className="relative">
              {/* Ô search nền sv-pale, viền sv-tan, khi focus lên viền sv-brown */}
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tìm kiếm manga, light novel, comic..."
                className="w-full bg-sv-pale border border-sv-tan text-gray-700 px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-sv-brown transition-all"
              />
              <button
                onClick={handleSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sv-brown font-bold hover:scale-110 transition-transform"
              >
                🔍
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <nav className="space-x-6 hidden lg:flex font-bold text-gray-600 text-sm">
              <Link to="/" className="hover:text-sv-brown transition-all">
                Trang chủ
              </Link>
              <Link
                to="/category"
                className="hover:text-sv-brown transition-all"
              >
                Danh mục
              </Link>
            </nav>

            <div className="hidden lg:block w-px h-6 bg-sv-tan mx-2"></div>

            {/* 👉 KHU VỰC NGƯỜI DÙNG */}
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
                  {/* Nút Avatar để bấm mở Menu */}
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 hover:bg-sv-pale p-1.5 pr-3 rounded-full transition-colors border border-transparent hover:border-sv-tan"
                  >
                    {/* Avatar (Lấy chữ cái đầu của Tên) */}
                    <div className="w-10 h-10 rounded-full bg-sv-brown text-white flex items-center justify-center font-black text-lg shadow-sm">
                      {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>

                    {/* Tên hiển thị (Ẩn trên mobile cho gọn) */}
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-bold text-sv-brown leading-none max-w-[120px] truncate">
                        {user?.name}
                      </p>
                    </div>

                    <ChevronDown
                      size={16}
                      className={`text-sv-brown transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Bảng Menu xổ xuống */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white border border-sv-tan rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      {/* Thông tin nhanh */}
                      <div className="p-4 border-b border-sv-pale bg-sv-wheat/30">
                        <p className="font-black text-sv-brown truncate">
                          {user?.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {user?.email}
                        </p>
                      </div>

                      {/* Các nút chức năng */}
                      <div className="p-2 space-y-1">
                        <Link
                          to="/profile"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-gray-700 hover:bg-sv-wheat hover:text-sv-brown rounded-xl transition-colors"
                        >
                          <User size={18} /> Hồ sơ cá nhân
                        </Link>
                        <Link
                          to="/profile/orders"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-gray-700 hover:bg-sv-wheat hover:text-sv-brown rounded-xl transition-colors"
                        >
                          <Package size={18} /> Đơn hàng của tôi
                        </Link>
                      </div>

                      {/* Nút Đăng xuất */}
                      <div className="p-2 border-t border-sv-pale bg-red-50/50">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-black text-red-600 hover:bg-red-100 hover:text-red-700 rounded-xl transition-colors"
                        >
                          <LogOut size={18} /> Đăng xuất
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Nút Đăng nhập cho khách lạ */
                <Link
                  to="/login"
                  className="bg-sv-brown hover:bg-opacity-90 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md"
                >
                  Đăng nhập
                </Link>
              )}
            </div>

            {/* Nút giỏ hàng dùng màu wheat */}
            <Link
              to="/cart"
              className="flex items-center gap-2 bg-sv-wheat hover:bg-sv-tan text-sv-brown px-4 py-2 rounded-full font-bold transition-colors text-sm ml-2 shadow-sm"
            >
              <span>🛒</span>
              <span className="hidden sm:inline">({cartItemCount})</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
