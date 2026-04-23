import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Printer, Loader2 } from "lucide-react";
import axiosClient from "../utils/axiosClient";
import useAuthStore from "../store/useAuthStore"; // 👉 THÊM IMPORT NÀY ĐỂ LẤY TÊN KHÁCH

const InvoicePage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuthStore(); // 👉 KÉO TÊN KHÁCH HÀNG TỪ STORE

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const response = await axiosClient.get(`/order/${id}`);
        setOrder(response.data?.data || response.data);
      } catch (err) {
        console.error("Lỗi lấy chi tiết đơn hàng:", err);
        setError("Không tìm thấy hóa đơn. Vui lòng thử lại!");
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetail();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading)
    return (
      <div className="min-h-screen bg-sv-cream flex justify-center items-center">
        <Loader2 className="animate-spin text-sv-brown" size={40} />
      </div>
    );
  if (error || !order)
    return (
      <div className="min-h-screen flex justify-center items-center font-bold text-red-600">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 py-8 print:py-0 print:bg-white">
      {/* Các nút bấm sẽ bị ẩn đi khi in (nhờ class print:hidden) */}
      <div className="max-w-3xl mx-auto px-4 mb-6 flex justify-between items-center print:hidden">
        <Link
          to="/profile/orders"
          className="flex items-center gap-2 text-gray-600 hover:text-sv-brown font-bold transition-colors"
        >
          <ArrowLeft size={20} /> Quay lại
        </Link>
        <button
          onClick={handlePrint}
          className="bg-sv-brown hover:bg-opacity-90 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md flex items-center gap-2"
        >
          <Printer size={18} /> In hóa đơn
        </button>
      </div>

      {/* Khung tờ hóa đơn */}
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 shadow-lg print:shadow-none print:p-0">
        {/* Header hóa đơn */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-gray-800 pb-6 mb-6">
          <div>
            <h1 className="text-3xl font-black tracking-wider uppercase text-gray-900">
              Story Vault
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Cửa hàng truyện tranh trực tuyến
            </p>
          </div>
          <div className="text-left md:text-right mt-4 md:mt-0">
            <h2 className="text-2xl font-bold text-gray-800">
              HÓA ĐƠN ĐIỆN TỬ
            </h2>
            <p className="text-gray-600 mt-1">
              <span className="font-semibold">Số HĐ:</span>{" "}
              {order.id.split("-")[0].toUpperCase()}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Ngày:</span>{" "}
              {new Date(order.createdAt).toLocaleDateString("vi-VN")}
            </p>
          </div>
        </div>

        {/* Thông tin khách hàng */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-2 border-b border-gray-200 pb-1">
            THÔNG TIN KHÁCH HÀNG
          </h3>
          <p className="text-gray-800">
            {/* 👉 ĐÃ FIX: Hiển thị đúng tên người nhận */}
            <span className="font-semibold">Người nhận:</span>{" "}
            {order.user?.name || user?.name || "Khách hàng"}
          </p>
          <p className="text-gray-800">
            <span className="font-semibold">Điện thoại:</span>{" "}
            {order.address?.phone}
          </p>
          <p className="text-gray-800">
            <span className="font-semibold">Địa chỉ giao hàng:</span>{" "}
            {order.address?.street}, {order.address?.ward},{" "}
            {order.address?.district}, {order.address?.city}
          </p>
          <p className="text-gray-800">
            <span className="font-semibold">Hình thức thanh toán:</span>{" "}
            {order.payment?.method === "COD"
              ? "Tiền mặt khi nhận hàng"
              : "Chuyển khoản VietQR / Trực tuyến"}
          </p>
        </div>

        {/* Bảng chi tiết sản phẩm */}
        <table className="w-full mb-8 text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 print:bg-gray-200 border-y border-gray-400">
              <th className="py-3 px-2 font-bold text-gray-800">Sản phẩm</th>
              <th className="py-3 px-2 font-bold text-gray-800 text-center">
                SL
              </th>
              <th className="py-3 px-2 font-bold text-gray-800 text-right">
                Đơn giá
              </th>
              <th className="py-3 px-2 font-bold text-gray-800 text-right">
                Thành tiền
              </th>
            </tr>
          </thead>
          <tbody className="border-b border-gray-300">
            {order.items?.map((item, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 last:border-0"
              >
                <td className="py-3 px-2 text-gray-800">
                  <Link
                    to={`/series/${item.volume?.series?.slug || item.volume?.seriesId || ""}`}
                    className="font-bold hover:text-sv-brown hover:underline transition-colors print:no-underline print:text-gray-800"
                    title={
                      item.volume?.title ||
                      `${item.volume?.series?.title || "Truyện"} - Tập ${item.volume?.volumeNumber}`
                    }
                  >
                    {item.volume?.title ||
                      `${item.volume?.series?.title || "Truyện"} - Tập ${item.volume?.volumeNumber}`}
                  </Link>
                </td>
                <td className="py-3 px-2 text-gray-800 text-center">
                  {item.quantity}
                </td>
                <td className="py-3 px-2 text-gray-800 text-right">
                  {new Intl.NumberFormat("vi-VN").format(item.price)}đ
                </td>
                <td className="py-3 px-2 text-gray-800 text-right font-medium">
                  {new Intl.NumberFormat("vi-VN").format(
                    item.price * item.quantity,
                  )}
                  đ
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Tổng kết tiền */}
        <div className="flex justify-end mb-12">
          <div className="w-full md:w-1/2 space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Cộng tiền hàng:</span>
              <span>
                {new Intl.NumberFormat("vi-VN").format(order.totalAmount)}đ
              </span>
            </div>
            <div className="flex justify-between text-gray-600 border-b border-gray-300 pb-2">
              <span>Phí vận chuyển:</span>
              <span>
                {new Intl.NumberFormat("vi-VN").format(order.shippingFee)}đ
              </span>
            </div>
            <div className="flex justify-between text-gray-900 font-black text-xl pt-2">
              <span>TỔNG CỘNG:</span>
              <span>
                {new Intl.NumberFormat("vi-VN").format(order.finalAmount)}đ
              </span>
            </div>
          </div>
        </div>

        {/* Chữ ký / Lời cảm ơn */}
        <div className="text-center text-gray-500 text-sm mt-8 pt-8 border-t border-gray-200">
          <p className="italic mb-1">Cảm ơn sếp đã ủng hộ Story Vault!</p>
          <p>Hóa đơn này có giá trị xác nhận giao dịch thành công.</p>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
