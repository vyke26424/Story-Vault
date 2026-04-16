import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axiosClient from '../utils/axiosClient';
import useAuthStore from '../store/useAuthStore';
import { Mail, Lock, User, Loader2, ArrowLeft } from 'lucide-react';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((state) => state.setAuth);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      if (isLogin) {
        const response = await axiosClient.post('/auth/signin', { email, password });
        setAuth(response.user, response.accessToken);
        navigate(from, { replace: true });
      } else {
        const response = await axiosClient.post('/auth/register', { email, password, name });
        setAuth(response.user, response.accessToken);
        navigate(from, { replace: true });
      }
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans flex items-center justify-center p-4 relative">
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-sv-brown transition-colors font-bold">
        <ArrowLeft size={20} /> Về trang chủ
      </Link>

      <div className="bg-white max-w-md w-full rounded-3xl shadow-xl border border-sv-tan overflow-hidden">
        <div className="p-8 sm:p-10">
          <div className="text-center mb-8">
            <span className="text-4xl mb-2 block">📚</span>
            <h1 className="text-3xl font-black text-sv-brown tracking-tight">Story Vault.</h1>
            <p className="text-gray-500 font-medium mt-2">{isLogin ? 'Mừng bạn quay trở lại kho lưu trữ!' : 'Tạo tài khoản để bắt đầu khám phá.'}</p>
          </div>

          {errorMsg && <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-bold text-center">{errorMsg}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-sv-brown mb-1.5">Tên hiển thị</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><User size={18} /></div>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-sv-pale border border-sv-tan text-sv-brown rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-sv-brown focus:border-transparent transition-all" placeholder="Nguyễn Văn A" />
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-bold text-sv-brown mb-1.5">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><Mail size={18} /></div>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-sv-pale border border-sv-tan text-sv-brown rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-sv-brown focus:border-transparent transition-all" placeholder="you@example.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-sv-brown mb-1.5">Mật khẩu</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><Lock size={18} /></div>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-sv-pale border border-sv-tan text-sv-brown rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-sv-brown focus:border-transparent transition-all" placeholder="••••••••" />
              </div>
              {isLogin && <div className="flex justify-end mt-2"><button type="button" className="text-sm font-bold text-sv-brown hover:opacity-80">Quên mật khẩu?</button></div>}
            </div>

            <button type="submit" disabled={loading} className="w-full bg-sv-brown hover:bg-opacity-90 text-white font-bold py-3.5 rounded-xl transition-all shadow-md flex justify-center items-center gap-2 disabled:bg-gray-400">
              {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? 'Đăng nhập' : 'Đăng ký')}
            </button>
          </form>

          <div className="mt-8 text-center text-sm font-medium text-gray-600">
            {isLogin ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
            <button onClick={() => { setIsLogin(!isLogin); setErrorMsg(''); }} className="font-bold text-sv-brown hover:opacity-80 underline decoration-sv-tan underline-offset-4">
              {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;