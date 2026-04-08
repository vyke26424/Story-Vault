import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookCopy, 
  ShoppingCart, 
  Users, 
  LogOut, 
  Menu, 
  ChevronLeft 
} from 'lucide-react';

const AdminLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Để bôi đậm menu đang chọn

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất khỏi trang Quản trị?")) {
      navigate('/');
    }
  };

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Quản lý Sách', icon: BookCopy, path: '/admin/products' },
    { name: 'Đơn hàng', icon: ShoppingCart, path: '/admin/orders' },
    { name: 'Khách hàng', icon: Users, path: '/admin/users' },
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex font-sans">
      
      {/* SIDEBAR */}
      <aside 
        className={`bg-stone-900 text-stone-300 flex flex-col transition-all duration-300 ease-in-out relative ${
          isCollapsed ? 'w-20' : 'w-64'
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
        <div className="h-20 flex items-center justify-center border-b border-stone-800">
          <Link to="/" className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform" title="Về trang chủ khách hàng">
            <span className="text-3xl">📚</span>
            {!isCollapsed && <h1 className="text-xl font-black text-white tracking-tight">Story Vault.</h1>}
          </Link>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.name} 
                to={item.path}
                title={isCollapsed ? item.name : ''}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-amber-500/10 text-amber-500 font-bold' 
                    : 'hover:bg-stone-800 hover:text-white'
                } ${isCollapsed ? 'justify-center' : 'justify-start'}`}
              >
                <item.icon size={20} />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Nút Đăng xuất ở cuối */}
        <div className="p-4 border-t border-stone-800">
          <button 
            onClick={handleLogout}
            title={isCollapsed ? "Đăng xuất" : ""}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all ${
              isCollapsed ? 'justify-center' : 'justify-start'
            }`}
          >
            <LogOut size={20} />
            {!isCollapsed && <span className="font-bold">Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT (Vùng hiển thị nội dung các trang con) */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header nhỏ của Admin */}
        <header className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-8 shrink-0">
          <h2 className="text-lg font-bold text-stone-800">Quản trị viên</h2>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-800 font-bold">A</div>
            <span className="text-sm font-semibold text-stone-600">Admin Tâm</span>
          </div>
        </header>

        {/* Khu vực chứa trang con (sẽ tự động thay đổi dựa theo URL) */}
        <div className="flex-1 overflow-auto p-8">
          <Outlet />
        </div>
      </main>

    </div>
  );
};

export default AdminLayout;