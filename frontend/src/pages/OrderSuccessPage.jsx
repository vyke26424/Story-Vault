import React from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle, Package, ArrowRight, Clock } from "lucide-react";

const OrderSuccessPage = () => {
  // Lấy mã đơn hàng từ URL
  const { orderId } = useParams();

  return (
    <div className="min-h-screen bg-sv-cream flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-sv-tan animate-in zoom-in-95 duration-300">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <CheckCircle className="text-green-600 w-12 h-12" />
        </div>

        <h1 className="text-3xl font-black text-sv-brown mb-2">Tuyệt vời!</h1>
        <p className="text-gray-500 font-medium mb-6">
          Đơn hàng của bạn đã được ghi nhận.
        </p>

        <div className="bg-sv-pale rounded-2xl p-5 mb-8 text-left border border-sv-tan">
          <div className="flex items-center gap-2 mb-2 text-sv-brown font-bold">
            <Package size={18} /> Mã đơn hàng của bạn:
          </div>
          <p className="font-mono font-black text-xl text-sv-brown break-all">
            {orderId}
          </p>

          <div className="mt-4 pt-4 border-t border-sv-tan text-sm text-gray-600 flex items-start gap-2">
            <Clock size={18} className="shrink-0 mt-0.5 text-sv-tan" />
            <span className="font-medium">
              Hệ thống đang xử lý đơn hàng. Sếp có thể theo dõi trạng thái chi
              tiết trong Lịch sử đơn hàng nhé!
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            to="/profile/orders"
            className="w-full bg-sv-brown hover:bg-opacity-90 text-white font-bold py-3.5 rounded-xl transition-all shadow-md flex justify-center items-center gap-2"
          >
            Xem lịch sử đơn hàng
          </Link>
          <Link
            to="/"
            className="w-full bg-white hover:bg-sv-wheat text-sv-brown border-2 border-sv-tan font-bold py-3.5 rounded-xl transition-all flex justify-center items-center gap-2"
          >
            Tiếp tục mua sắm <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
