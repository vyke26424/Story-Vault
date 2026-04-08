import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../store/useCartStore';

const Header = () => {
  const cartItemCount = useCartStore(state => state.cart.reduce((total, item) => total + item.quantity, 0));
  
  // Thêm state và hook điều hướng cho tính năng Search
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Chuyển hướng sang trang search kèm từ khóa trên URL (ví dụ: /search?q=one piece)
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm(''); // Xóa trắng ô input sau khi search
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-amber-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-wrap md:flex-nowrap justify-between items-center gap-4">
          
          <Link to="/" className="flex items-center gap-2 cursor-pointer shrink-0">
            <span className="text-3xl">📚</span>
            <h1 className="text-2xl font-black text-amber-900 tracking-tight">Story Vault.</h1>
          </Link>
          
          {/* Cập nhật khu vực Search Bar */}
          <div className="w-full md:w-auto flex-1 max-w-xl hidden sm:block">
            <div className="relative">
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tìm kiếm manga, light novel, comic..." 
                className="w-full bg-amber-50 border border-amber-200 text-stone-700 px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              />
              <button 
                onClick={handleSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-700 hover:text-amber-900 font-bold"
              >
                🔍
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <nav className="space-x-6 hidden lg:flex font-bold text-stone-600 text-sm">
              <Link to="/" className="hover:text-amber-700 transition-all">Trang chủ</Link>
              <Link to="/category" className="hover:text-amber-700 transition-all">Manga</Link>
              <Link to="/category" className="hover:text-amber-700 transition-all">Light Novel</Link>
            </nav>
            
            <div className="hidden lg:block w-px h-6 bg-amber-200 mx-2"></div>

            <div className="hidden md:flex items-center gap-3">
              <Link to="/login" className="text-stone-600 hover:text-amber-800 font-bold text-sm px-2 transition-colors">Đăng nhập</Link>
              <Link to="/login" className="bg-stone-800 hover:bg-stone-900 text-white px-4 py-2 rounded-full text-sm font-bold transition-colors shadow-sm">Đăng ký</Link>
            </div>

            <Link to="/cart" className="flex items-center gap-2 bg-amber-100 hover:bg-amber-200 text-amber-900 px-4 py-2 rounded-full font-bold transition-colors text-sm ml-2">
              <span>🛒</span>
              <span className="hidden sm:inline">Giỏ hàng ({cartItemCount})</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;