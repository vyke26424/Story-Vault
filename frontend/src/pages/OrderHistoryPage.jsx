import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  ChevronRight,
  QrCode,
  X,
  Loader2,
} from "lucide-react";
import axiosClient from "../utils/axiosClient";

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State cho Popup Thanh toán lại
  const [showQR, setShowQR] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      // GỌI API LẤY ĐƠN HÀNG (Sếp check lại đúng endpoint backend của sếp nhé, thường là /order hoặc /order/my-orders)
      const response = await axiosClient.get("/order");

      // Bóc tách data (Tùy thuộc backend sếp trả về cục data nằm ở đâu)
      const orderData = response.data?.data || response.data || response || [];
      setOrders(Array.isArray(orderData) ? orderData : []);
    } catch (err) {
      console.error("Lỗi lấy đơn hàng:", err);
      setError("Không thể tải lịch sử đơn hàng. Vui lòng thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = (order) => {
    setSelectedOrder(order);
    setShowQR(true);
  };

  const handleCloseQR = () => {
    setShowQR(false);
    setSelectedOrder(null);
  };

  // Hàm hiển thị trạng thái màu mè cho đẹp
  const getStatusDisplay = (status) => {
    switch (status) {
      case "PENDING":
        return {
          text: "Chờ xử lý",
          color: "text-yellow-600",
          bg: "bg-yellow-100",
          icon: <Clock size={16} />,
        };
      case "PAID":
        return {
          text: "Đã thanh toán",
          color: "text-green-600",
          bg: "bg-green-100",
          icon: <CheckCircle size={16} />,
        };
      case "SHIPPED":
        return {
          text: "Đang giao",
          color: "text-blue-600",
          bg: "bg-blue-100",
          icon: <Truck size={16} />,
        };
      case "COMPLETED":
        return {
          text: "Hoàn thành",
          color: "text-sv-brown",
          bg: "bg-sv-wheat",
          icon: <CheckCircle size={16} />,
        };
      case "CANCELLED":
        return {
          text: "Đã hủy",
          color: "text-red-600",
          bg: "bg-red-100",
          icon: <XCircle size={16} />,
        };
      default:
        return {
          text: status,
          color: "text-gray-600",
          bg: "bg-gray-100",
          icon: <Package size={16} />,
        };
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-sv-cream flex justify-center items-center">
        <Loader2 className="animate-spin text-sv-brown" size={40} />
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 bg-sv-cream min-h-screen relative">
      <h1 className="text-3xl font-black text-sv-brown mb-8 flex items-center gap-3">
        <Package className="text-sv-tan" size={32} /> Lịch sử đơn hàng
      </h1>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl mb-6 font-medium text-center">
          {error}
        </div>
      )}

      {orders.length === 0 && !error ? (
        <div className="bg-white rounded-3xl border border-sv-tan p-12 text-center shadow-sm">
          <div className="w-24 h-24 bg-sv-pale rounded-full flex items-center justify-center mx-auto mb-6">
            <Package size={40} className="text-sv-tan" />
          </div>
          <h2 className="text-xl font-black text-sv-brown mb-2">
            Sếp chưa có đơn hàng nào!
          </h2>
          <p className="text-gray-500 mb-8 font-medium">
            Kho tàng truyện tranh vẫn đang chờ sếp khám phá đó.
          </p>
          <Link
            to="/"
            className="inline-block bg-sv-brown hover:bg-opacity-90 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md"
          >
            Mua sắm ngay
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const statusUi = getStatusDisplay(order.status);
            // Kiểm tra xem đơn này có cần thanh toán không (Trạng thái Pending + Phương thức VIETQR)
            const needsPayment =
              order.status === "PENDING" && order.payment?.method === "VIETQR";

            return (
              <div
                key={order.id}
                className="bg-white border border-sv-tan rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Header Đơn hàng */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4 border-b border-sv-pale pb-4">
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">
                      Mã đơn:{" "}
                      <span className="font-bold text-sv-brown">
                        {order.id}
                      </span>
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleString("vi-VN")}
                    </p>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-sm ${statusUi.bg} ${statusUi.color}`}
                  >
                    {statusUi.icon} {statusUi.text}
                  </div>
                </div>

                {/* Danh sách sản phẩm (Hiển thị 2 cái đầu cho gọn) */}
                <div className="space-y-4 mb-4">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      {/* Nếu Backend trả về thông tin Volume thì lấy ảnh, không thì xài ảnh placeholder */}
                      <Link
                        to={`/series/${item.volume?.series?.slug || item.volume?.seriesId || ""}`}
                        className="w-16 h-20 bg-sv-pale rounded-lg border border-sv-tan overflow-hidden shrink-0 hover:opacity-80 transition-opacity block"
                      >
                        {item.volume?.coverImage ? (
                          <img
                            src={item.volume.coverImage}
                            alt="cover"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                            No Img
                          </div>
                        )}
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/series/${item.volume?.series?.slug || item.volume?.seriesId || ""}`}
                          className="font-bold text-sv-brown text-sm line-clamp-2 hover:text-amber-600 hover:underline transition-colors"
                        >
                          {item.volume?.title || `Sản phẩm #${item.volumeId}`}
                        </Link>
                        <p className="text-sm text-gray-500 font-medium mt-1">
                          Số lượng: {item.quantity}
                        </p>
                      </div>
                      <div className="font-black text-sv-brown shrink-0">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Đơn hàng & Nút Thanh toán */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-sv-pale">
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-0.5">
                      Tổng tiền:
                    </p>
                    <p className="text-xl font-black text-red-600">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(order.finalAmount)}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    {needsPayment && (
                      <button
                        onClick={() => handlePayNow(order)}
                        className="bg-sv-brown hover:bg-opacity-90 text-white text-sm font-bold py-2.5 px-5 rounded-xl transition-all shadow flex items-center gap-2"
                      >
                        <QrCode size={18} /> Thanh toán ngay
                      </button>
                    )}
                    <Link
                      to={`/order/invoice/${order.id}`}
                      className="bg-sv-pale hover:bg-sv-tan text-sv-brown text-sm font-bold py-2.5 px-5 rounded-xl transition-all border border-sv-tan flex items-center gap-1"
                    >
                      Xem chi tiết <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showQR && selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl overflow-hidden border border-sv-tan scale-100 animate-in zoom-in-95 duration-200">
            <div className="bg-sv-wheat p-5 flex justify-between items-center border-b border-sv-tan">
              <h3 className="font-black text-sv-brown text-xl flex items-center gap-2">
                <QrCode className="text-sv-brown" /> Thanh toán đơn hàng
              </h3>
              <button
                onClick={handleCloseQR}
                className="p-2 hover:bg-sv-tan rounded-full transition-colors text-sv-brown"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 text-center space-y-4">
              <p className="text-gray-600 font-medium">
                Vui lòng mở ứng dụng ngân hàng để quét mã QR bên dưới.
              </p>

              <div className="border-4 border-sv-brown rounded-2xl overflow-hidden inline-block p-2 bg-white">
                <img
                  src={`https://img.vietqr.io/image/MB-0934123123-compact2.png?amount=${selectedOrder.finalAmount}&addInfo=Don hang ${selectedOrder.id}&accountName=STORY VAULT`}
                  alt="Mã QR Thanh Toán"
                  className="w-64 h-64 object-contain"
                />
              </div>

              <div className="bg-sv-pale rounded-xl p-4 text-left border border-sv-tan">
                <p className="text-sm text-gray-500 mb-1">Mã đơn hàng:</p>
                <p className="font-black text-sv-brown mb-3">
                  {selectedOrder.id}
                </p>
                <p className="text-sm text-gray-500 mb-1">
                  Số tiền cần chuyển:
                </p>
                <p className="font-black text-red-600 text-xl">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(selectedOrder.finalAmount)}
                </p>
              </div>

              <button
                onClick={() => {
                  alert(
                    "Hệ thống đã ghi nhận. Trạng thái sẽ được cập nhật sau khi xác nhận tiền vào tài khoản.",
                  );
                  handleCloseQR();
                }}
                className="w-full bg-sv-brown hover:bg-opacity-90 text-white font-bold py-3 rounded-xl transition-all shadow-md"
              >
                Tôi đã thanh toán xong
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
