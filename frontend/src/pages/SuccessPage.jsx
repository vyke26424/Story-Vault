import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

const SuccessPage = () => {
  const orderId = "SV-123456";

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans flex flex-col">
      <Header />

      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white max-w-lg w-full p-8 md:p-12 rounded-3xl shadow-sm border border-amber-100 text-center">
          
          <div className="flex justify-center mb-6">
            <CheckCircle size={80} className="text-green-500" />
          </div>
          
          <h1 className="text-3xl font-black text-stone-900 mb-2">Đặt hàng thành công!</h1>
          <p className="text-stone-500 mb-8">
            Cảm ơn bạn đã mua sắm tại Story Vault. Kiện hàng của bạn đang được chuẩn bị và sẽ sớm được giao.
          </p>

          <div className="bg-amber-50 rounded-2xl p-6 mb-8 text-left border border-amber-100">
            <h3 className="font-bold text-stone-800 mb-4 flex items-center gap-2">
              <Package className="text-amber-600" size={20} /> Thông tin đơn hàng
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-500">Mã đơn hàng:</span>
                <span className="font-bold text-stone-800">{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Phương thức:</span>
                <span className="font-bold text-stone-800">Chuyển khoản VietQR</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Trạng thái:</span>
                <span className="font-bold text-green-600">Đã thanh toán</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link to="/category" className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors">
              Tiếp tục khám phá <ArrowRight size={18} />
            </Link>
            <Link to="/" className="w-full bg-white hover:bg-stone-50 text-stone-600 border border-stone-200 font-bold py-4 rounded-xl transition-colors">
              Trở về trang chủ
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SuccessPage;