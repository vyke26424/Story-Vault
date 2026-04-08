import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFocus = () => {
    if (error) setError('');
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  // Hàm xử lý Form (Đã chuẩn bị sẵn cấu trúc cho Backend sau này)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password || (!isLogin && !formData.fullName)) {
      setError('Vui lòng nhập đầy đủ thông tin!');
      triggerShake();
      return;
    }

    setLoading(true);

    // GIẢ LẬP GỌI API (Mock API Call)
    setTimeout(() => {
      setLoading(false);
      if (formData.email === "test@error.com") {
        setError("Email hoặc mật khẩu không chính xác!");
        triggerShake();
        return;
      }

      if (isLogin) {
        alert("🎉 Đăng nhập thành công! Chào mừng đến Story Vault.");
        navigate('/'); // Về trang chủ
      } else {
        alert("✨ Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.");
        setIsLogin(true); // Chuyển sang tab Đăng nhập
        setFormData({ ...formData, password: '' });
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center px-4 py-12 relative overflow-hidden font-sans">
      
      <div className="w-full max-w-md z-10">
        
        {/* Tiêu đề & Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 cursor-pointer transition-transform hover:scale-105">
            <span className="text-4xl">📚</span>
            <h1 className="text-3xl font-black text-amber-900 tracking-tight">Story Vault.</h1>
          </Link>
        </div>

        {/* Nút Toggle Chuyển đổi Đăng nhập / Đăng ký */}
        <div className="flex bg-amber-100 p-1.5 rounded-full mb-8 border border-amber-200 shadow-sm">
          <button
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`flex-1 py-2.5 text-sm font-bold rounded-full transition-all duration-300 ${
              isLogin ? 'bg-white text-amber-900 shadow-md' : 'text-amber-700 hover:text-amber-900'
            }`}
          >
            Đăng nhập
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(''); }}
            className={`flex-1 py-2.5 text-sm font-bold rounded-full transition-all duration-300 ${
              !isLogin ? 'bg-white text-amber-900 shadow-md' : 'text-amber-700 hover:text-amber-900'
            }`}
          >
            Đăng ký
          </button>
        </div>

        {/* Form Container với hiệu ứng Animation */}
        <motion.div
          key={isLogin ? 'login' : 'signup'}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: 0,
            x: shake ? [0, -10, 10, -10, 10, 0] : 0,
          }}
          transition={{ duration: 0.3 }}
          className="bg-white border border-amber-100 p-8 rounded-3xl shadow-sm"
        >
          <h2 className="text-2xl font-bold text-stone-800 mb-2 text-center">
            {isLogin ? 'Chào mừng trở lại!' : 'Tạo tài khoản mới'}
          </h2>
          <p className="text-stone-500 text-center mb-6 text-sm">
            {isLogin
              ? 'Nhập thông tin để mở khóa kho lưu trữ'
              : 'Trở thành thành viên của chúng tôi ngay hôm nay'}
          </p>

          {/* Hiển thị lỗi */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="border p-3 rounded-xl mb-6 text-sm flex items-center gap-2 font-medium bg-red-50 text-red-600 border-red-200"
            >
              <AlertCircle size={18} /> {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input Họ Tên (Chỉ hiện khi Đăng ký) */}
            {!isLogin && (
              <div>
                <label className="block text-stone-700 text-xs font-bold mb-1.5 uppercase ml-1">Họ và tên</label>
                <div className="relative group">
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    className="w-full bg-amber-50/50 border border-amber-200 group-hover:border-amber-300 rounded-xl py-3 pl-10 pr-4 text-stone-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all placeholder:text-stone-400"
                    placeholder="Nguyễn Văn A"
                  />
                  <User className="absolute left-3 top-3 text-amber-600/70" size={18} />
                </div>
              </div>
            )}

            {/* Input Email */}
            <div>
              <label className="block text-stone-700 text-xs font-bold mb-1.5 uppercase ml-1">Email</label>
              <div className="relative group">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  className={`w-full bg-amber-50/50 border ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : 'border-amber-200 group-hover:border-amber-300 focus:border-amber-500 focus:ring-amber-200'} rounded-xl py-3 pl-10 pr-4 text-stone-800 focus:ring-2 outline-none transition-all placeholder:text-stone-400`}
                  placeholder="name@example.com"
                />
                <Mail className="absolute left-3 top-3 text-amber-600/70" size={18} />
              </div>
            </div>

            {/* Input Mật khẩu */}
            <div>
              <label className="block text-stone-700 text-xs font-bold mb-1.5 uppercase ml-1">Mật khẩu</label>
              <div className="relative group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  className={`w-full bg-amber-50/50 border ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : 'border-amber-200 group-hover:border-amber-300 focus:border-amber-500 focus:ring-amber-200'} rounded-xl py-3 pl-10 pr-10 text-stone-800 focus:ring-2 outline-none transition-all placeholder:text-stone-400`}
                  placeholder="••••••••"
                />
                <Lock className="absolute left-3 top-3 text-amber-600/70" size={18} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-stone-400 hover:text-stone-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Nút Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-800 text-white font-bold py-3 rounded-xl hover:bg-amber-900 transition-all flex items-center justify-center gap-2 mt-6 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Đang xử lý...
                </>
              ) : (
                <>
                  {isLogin ? 'Đăng nhập ngay' : 'Đăng ký tài khoản'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {isLogin && (
            <div className="text-center mt-6">
              <a href="#" className="text-sm font-semibold text-amber-700 hover:text-amber-900 transition-colors">
                Quên mật khẩu?
              </a>
            </div>
          )}
        </motion.div>

        <div className="text-center mt-8">
          <Link to="/" className="text-stone-500 hover:text-amber-800 text-sm font-medium transition-colors inline-flex items-center gap-2">
            &larr; Quay lại trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;