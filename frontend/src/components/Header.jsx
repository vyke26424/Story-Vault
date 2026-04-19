import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  LogOut,
  Package,
  ChevronDown,
  Search,
  LayoutGrid,
  Loader2,
} from "lucide-react";
import useCartStore from "../store/useCartStore";
import useAuthStore from "../store/useAuthStore";
import axiosClient from "../utils/axiosClient";

const Header = () => {
  const cartItemCount = useCartStore((state) =>
    state.cart.reduce((total, item) => total + item.quantity, 0),
  );
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  // States quản lý Dropdown User & Category
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categoryRef = useRef(null);

  // States quản lý Tìm kiếm Live Search
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef(null);

  // Xử lý click ra ngoài để đóng TẤT CẢ các Dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target))
        setIsDropdownOpen(false);
      if (categoryRef.current && !categoryRef.current.contains(event.target))
        setIsCategoryOpen(false);
      if (searchRef.current && !searchRef.current.contains(event.target))
        setShowSearchDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Kỹ thuật DEBOUNCE: Khách ngừng gõ 0.5s mới gọi API lấy 5 kết quả xem trước
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchTerm.trim().length > 0) {
        setIsSearching(true);
        setShowSearchDropdown(true);
        try {
          // Gọi API tìm kiếm xem trước (Lấy 5 cuốn truyện)
          const res = await axiosClient.get(
            `/search/preview?q=${encodeURIComponent(searchTerm)}`,
          );
          setSearchResults(res.data || []);
        } catch (error) {
          console.error("Lỗi tìm kiếm trực tiếp:", error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setShowSearchDropdown(false);
        setSearchResults([]);
      }
    }, 500); // Trì hoãn 500ms

    return () => clearTimeout(timer); // Reset lại thời gian nếu khách gõ tiếp
  }, [searchTerm]);

  const handleSearch = (e) => {
    e?.preventDefault(); // Cho phép chạy cả khi không có event (bấm nút "Xem tất cả")
    if (searchTerm.trim()) {
      setShowSearchDropdown(false); // Đóng dropdown
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`); // Chuyển sang SearchPage
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
      logout();
      setIsDropdownOpen(false);
      navigate("/login");
    }
  };

  return (
    <header className="bg-sv-cream/90 backdrop-blur-md border-b border-sv-tan sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-wrap md:flex-nowrap justify-between items-center gap-4">
          {/* Khu vực Logo & Nút Danh Mục */}
          <div className="flex items-center gap-4 shrink-0">
            <Link to="/" className="flex items-center gap-2 cursor-pointer">
              <span className="text-3xl">📚</span>
              <h1 className="text-2xl font-black text-sv-brown tracking-tight hidden sm:block">
                Story Vault.
              </h1>
            </Link>

            {/* Nút Danh Mục (4 Block Icon) */}
            <div className="relative ml-2" ref={categoryRef}>
              <button
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className={`p-2 rounded-xl transition-all duration-200 flex items-center justify-center ${isCategoryOpen ? "bg-sv-wheat text-sv-brown shadow-inner" : "text-gray-600 hover:bg-sv-pale hover:text-sv-brown"}`}
                title="Danh mục sản phẩm"
              >
                <LayoutGrid size={24} strokeWidth={2.5} />
              </button>

              {isCategoryOpen && (
                <div className="absolute top-full left-0 mt-3 w-56 bg-white border border-sv-tan rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-3 bg-sv-wheat/30 border-b border-sv-pale">
                    <h3 className="font-black text-sv-brown text-sm uppercase tracking-wider">
                      Danh mục
                    </h3>
                  </div>
                  <div className="p-2 space-y-1">
                    <Link
                      to="/search?category=manga"
                      onClick={() => setIsCategoryOpen(false)}
                      className="block px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-sv-wheat hover:text-sv-brown rounded-xl transition-colors"
                    >
                      Manga
                    </Link>
                    <Link
                      to="/search?category=light-novel"
                      onClick={() => setIsCategoryOpen(false)}
                      className="block px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-sv-wheat hover:text-sv-brown rounded-xl transition-colors"
                    >
                      Light Novel
                    </Link>
                    <Link
                      to="/search?category=comic"
                      onClick={() => setIsCategoryOpen(false)}
                      className="block px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-sv-wheat hover:text-sv-brown rounded-xl transition-colors"
                    >
                      Comic & Đồ chơi
                    </Link>
                    <Link
                      to="/search?category=novel"
                      onClick={() => setIsCategoryOpen(false)}
                      className="block px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-sv-wheat hover:text-sv-brown rounded-xl transition-colors"
                    >
                      Tiểu thuyết
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 👉 THANH TÌM KIẾM CÓ DROPDOWN (LIVE SEARCH) */}
          <div
            className="w-full md:w-auto flex-1 max-w-xl hidden sm:block relative"
            ref={searchRef}
          >
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  if (searchTerm.trim().length > 0) setShowSearchDropdown(true);
                }}
                placeholder="Gõ tên truyện, thể loại, hoặc giá tiền..."
                className="w-full bg-sv-pale border border-sv-tan text-gray-800 font-medium px-5 py-2.5 rounded-full focus:outline-none focus:ring-2 focus:ring-sv-brown/50 transition-all placeholder-gray-400"
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-sv-brown text-white rounded-full hover:bg-opacity-90 hover:scale-105 transition-all shadow-sm"
              >
                <Search size={18} strokeWidth={2.5} />
              </button>
            </div>

            {/* Bảng Kết quả Tìm kiếm Xổ xuống (Xịn như Shopee) */}
            {showSearchDropdown && (
              <div className="absolute top-full left-0 mt-2 w-full bg-white border border-sv-tan rounded-2xl shadow-xl z-[60] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                {isSearching ? (
                  <div className="p-6 flex items-center justify-center text-sv-brown font-bold gap-2">
                    <Loader2 className="animate-spin" size={20} /> Đang tìm bảo
                    vật...
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="flex flex-col max-h-[400px] overflow-y-auto custom-scrollbar">
                    {/* Danh sách 5 sản phẩm xem trước */}
                    {searchResults.map((item) => (
                      <Link
                        key={item.id}
                        // SỬA LỖI: Luôn trỏ về trang của cả bộ truyện (series)
                        // để đồng bộ với trang SearchPage
                        to={
                          item.series?.slug
                            ? `/series/${item.series.slug}`
                            : `/volume/${item.id}`
                        }
                        onClick={() => setShowSearchDropdown(false)}
                        className="flex items-center gap-4 p-3 hover:bg-sv-pale border-b border-sv-pale transition-colors last:border-0"
                      >
                        <div className="w-12 h-16 shrink-0 bg-gray-200 rounded-md overflow-hidden border border-sv-tan">
                          {item.coverImage ? (
                            <img
                              src={item.coverImage}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                              No Img
                            </span>
                          )}
                        </div>
                        <div className="flex-1 text-left">
                          <h4 className="text-sm font-bold text-sv-brown line-clamp-1">
                            {item.title || item.series?.title}
                          </h4>
                          <p className="text-xs text-gray-500 font-medium">
                            Tập {item.volumeNumber} •{" "}
                            {item.series?.author || "Đang cập nhật"}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-sm font-black text-sv-brown">
                            {new Intl.NumberFormat("vi-VN").format(item.price)}đ
                          </span>
                        </div>
                      </Link>
                    ))}

                    {/* Nút Xem tất cả kết quả */}
                    <button
                      onClick={handleSearch}
                      className="p-3 text-sm font-black text-center text-sv-brown hover:bg-sv-wheat transition-colors bg-sv-cream sticky bottom-0 border-t border-sv-tan"
                    >
                      Xem tất cả kết quả cho "{searchTerm}"
                    </button>
                  </div>
                ) : (
                  <div className="p-6 text-center text-gray-500 font-medium text-sm">
                    Không tìm thấy cuốn bí kíp nào khớp với "{searchTerm}".
                  </div>
                )}
              </div>
            )}
          </div>

          {/* CÁC NÚT USER VÀ GIỎ HÀNG BÊN PHẢI (GIỮ NGUYÊN) */}
          <div className="flex items-center gap-4 shrink-0">
            <nav className="space-x-6 hidden lg:flex font-bold text-gray-600 text-sm">
              <Link to="/" className="hover:text-sv-brown transition-all">
                Trang chủ
              </Link>
            </nav>

            <div className="hidden lg:block w-px h-6 bg-sv-tan mx-1"></div>

            {/* Khu vực User */}
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 hover:bg-sv-pale p-1.5 pr-3 rounded-full transition-colors border border-transparent hover:border-sv-tan"
                  >
                    <div className="w-10 h-10 rounded-full bg-sv-brown text-white flex items-center justify-center font-black text-lg shadow-sm overflow-hidden border border-sv-tan">
                      {user?.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : user?.name ? (
                        user.name.charAt(0).toUpperCase()
                      ) : (
                        "U"
                      )}
                    </div>
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

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-64 bg-white border border-sv-tan rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="p-4 border-b border-sv-pale bg-sv-wheat/30">
                        <p className="font-black text-sv-brown truncate">
                          {user?.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate font-medium">
                          {user?.email}
                        </p>
                      </div>
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
                <Link
                  to="/login"
                  className="bg-sv-brown hover:bg-opacity-90 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md"
                >
                  Đăng nhập
                </Link>
              )}
            </div>

            {/* Giỏ hàng */}
            <Link
              to="/cart"
              className="flex items-center gap-2 bg-sv-wheat hover:bg-sv-tan text-sv-brown px-4 py-2.5 rounded-full font-bold transition-colors text-sm ml-1 shadow-sm"
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
