import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../utils/axiosClient';
import useAuthStore from '../store/useAuthStore';
import { Mail, Lock, User, Loader2, ArrowLeft } from 'lucide-react';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isLogin) {
        // GỌI API ĐĂNG NHẬP
        const response = await axiosClient.post('/auth/signin', { email, password });
        setAuth(response.user, response.accessToken);
        navigate('/'); // Thành công -> Về trang chủ
      } else {
        // GỌI API ĐĂNG KÝ
        const response = await axiosClient.post('/auth/register', { email, password, name });
        setAuth(response.user, response.accessToken);
        navigate('/'); // Thành công -> Về trang chủ
      }
    } catch (error) {
      // Bắt lỗi từ Backend trả về (VD: Sai mật khẩu, email đã tồn tại)
      setErrorMsg(error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans flex items-center justify-center p-4 relative">
      {/* Nút quay lại */}
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-stone-500 hover:text-amber-800 transition-colors font-bold">
        <ArrowLeft size={20} /> Về trang chủ
      </Link>

      <div className="bg-white max-w-md w-full rounded-3xl shadow-xl border border-amber-100 overflow-hidden">
        <div className="p-8 sm:p-10">
          <div className="text-center mb-8">
            <span className="text-4xl mb-2 block">📚</span>
            <h1 className="text-3xl font-black text-stone-800 tracking-tight">Story Vault.</h1>
            <p className="text-stone-500 font-medium mt-2">
              {isLogin ? 'Mừng bạn quay trở lại kho lưu trữ!' : 'Tạo tài khoản để bắt đầu khám phá.'}
            </p>
          </div>

          {/* Hiển thị lỗi nếu có */}
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-bold text-center">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1.5">Tên hiển thị</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 text-stone-800 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    placeholder="Nguyễn Văn A"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1.5">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 text-stone-800 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1.5">Mật khẩu</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 text-stone-800 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
              {isLogin && (
                <div className="flex justify-end mt-2">
                  <button type="button" className="text-sm font-bold text-amber-700 hover:text-amber-800">
                    Quên mật khẩu?
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-stone-800 hover:bg-stone-900 text-white font-bold py-3.5 rounded-xl transition-all shadow-md flex justify-center items-center gap-2 disabled:bg-stone-400"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? 'Đăng nhập' : 'Đăng ký')}
            </button>
          </form>

          <div className="mt-8 text-center text-sm font-medium text-stone-600">
            {isLogin ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setErrorMsg('');
              }} 
              className="font-bold text-amber-700 hover:text-amber-800 underline decoration-amber-300 underline-offset-4"
            >
              {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;