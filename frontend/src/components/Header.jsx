import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import axiosClient from '../utils/axiosClient';

const Header = () => {
  const cartItemCount = useCartStore(state => state.cart.reduce((total, item) => total + item.quantity, 0));
  const { user, isAuthenticated, logout } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm(''); 
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch(e);
  };

  const handleLogout = async () => {
    try {
      await axiosClient.post('/auth/logout');
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    } finally {
      logout();
      navigate('/');
    }
  };

  return (
    // Dùng nền sv-cream cho Header
    <header className="bg-sv-cream/90 backdrop-blur-md border-b border-sv-tan sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-wrap md:flex-nowrap justify-between items-center gap-4">
          
          <Link to="/" className="flex items-center gap-2 cursor-pointer shrink-0">
            <span className="text-3xl">📚</span>
            {/* Chữ Logo màu Nâu đặc trưng */}
            <h1 className="text-2xl font-black text-sv-brown tracking-tight">Story Vault.</h1>
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
              <button onClick={handleSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-sv-brown font-bold hover:scale-110 transition-transform">
                🔍
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <nav className="space-x-6 hidden lg:flex font-bold text-gray-600 text-sm">
              <Link to="/" className="hover:text-sv-brown transition-all">Trang chủ</Link>
              <Link to="/category" className="hover:text-sv-brown transition-all">Danh mục</Link>
            </nav>
            
            <div className="hidden lg:block w-px h-6 bg-sv-tan mx-2"></div>

            {isAuthenticated && user ? (
              <div className="hidden md:flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-bold text-sv-brown">{user.name || user.email}</span>
                  {/* Tag Role dùng nền wheat, chữ brown */}
                  <span className="text-[10px] uppercase tracking-wider font-black text-sv-brown bg-sv-wheat px-2 py-0.5 rounded-full">
                    {user.role}
                  </span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-red-600 font-bold text-sm transition-colors"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link to="/login" className="text-gray-600 hover:text-sv-brown font-bold text-sm px-2 transition-colors">Đăng nhập</Link>
                {/* Nút đăng ký màu Nâu */}
                <Link to="/login" className="bg-sv-brown hover:opacity-90 text-white px-4 py-2 rounded-full text-sm font-bold transition-all shadow-sm hover:shadow-md">Đăng ký</Link>
              </div>
            )}

            {/* Nút giỏ hàng dùng màu wheat */}
            <Link to="/cart" className="flex items-center gap-2 bg-sv-wheat hover:bg-sv-tan text-sv-brown px-4 py-2 rounded-full font-bold transition-colors text-sm ml-2 shadow-sm">
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