import React, { useState, useEffect } from "react";
import {
  Search,
  Loader2,
  FileText,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import axiosClient from "../../utils/axiosClient";

const OrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;

  const fetchOrders = async (pageToFetch = currentPage) => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/admin/orders", {
        params: {
          search: searchTerm,
          page: pageToFetch,
          limit: limit,
        },
      });
      setOrders(res.data?.data || res.data || []);

      // Cập nhật Meta phân trang
      const meta = res.data?.meta || res.meta;
      if (meta) {
        setTotalPages(meta.totalPages || 1);
        setTotalItems(meta.totalItems || 0);
      } else {
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Lỗi lấy đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      fetchOrders(1);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchOrders(newPage);
    }
  };

  // Đổi trạng thái đơn hàng
  const handleStatusChange = async (orderId, newStatus) => {
    if (window.confirm("Xác nhận đổi trạng thái đơn hàng này?")) {
      try {
        await axiosClient.patch(`/admin/orders/${orderId}/status`, {
          status: newStatus,
        });
        alert("Đã cập nhật trạng thái!");
        fetchOrders(currentPage); // Refresh lại data
      } catch (error) {
        alert("Lỗi cập nhật trạng thái!");
      }
    }
  };

  const handlePaymentStatusChange = async (orderId, newStatus) => {
    if (window.confirm("Xác nhận đổi trạng thái thanh toán của đơn này?")) {
      try {
        await axiosClient.patch(`/admin/orders/${orderId}/payment-status`, {
          status: newStatus,
        });
        alert("Đã cập nhật trạng thái thanh toán!");
        fetchOrders(currentPage); // Refresh lại data
      } catch (error) {
        alert("Lỗi cập nhật thanh toán!");
      }
    }
  };

  return (
    <div className="p-6 font-nunito h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-black text-stone-800 flex items-center gap-3">
            <FileText className="text-amber-500" size={32} /> Quản lý Đơn hàng
          </h1>
          <p className="text-stone-500 font-medium">
            Theo dõi và xử lý đơn đặt hàng của khách.
          </p>
        </div>
      </div>

      {/* TÌM KIẾM */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-stone-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm theo Mã đơn, Tên hoặc Email khách hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 text-stone-800 font-medium rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />
        </div>
      </div>

      {/* BẢNG ĐƠN HÀNG */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1 custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-stone-50 sticky top-0 z-10">
              <tr className="text-stone-500 text-sm border-b border-stone-200">
                <th className="p-4 font-bold">Mã Đơn</th>
                <th className="p-4 font-bold">Khách Hàng</th>
                <th className="p-4 font-bold">Ngày Đặt</th>
                <th className="p-4 font-bold text-right">Tổng Tiền</th>
                <th className="p-4 font-bold text-center">Thanh Toán</th>
                <th className="p-4 font-bold text-center">Trạng Thái Xử Lý</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center">
                    <Loader2
                      className="animate-spin text-amber-500 mx-auto mb-2"
                      size={32}
                    />
                  </td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-stone-100 hover:bg-stone-50 transition-colors"
                  >
                    <td className="p-4">
                      <span className="font-black text-stone-800 text-sm">
                        #{order.id.substring(0, 8)}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-stone-800">
                        {order.user?.name || "Khách"}
                      </p>
                      <p className="text-xs text-stone-500">
                        {order.user?.email}
                      </p>
                    </td>
                    <td className="p-4 text-sm font-medium text-stone-600">
                      {new Date(order.createdAt).toLocaleString("vi-VN")}
                    </td>
                    <td className="p-4 text-right">
                      <p className="font-black text-amber-600">
                        {new Intl.NumberFormat("vi-VN").format(
                          order.finalAmount,
                        )}
                        đ
                      </p>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-xs font-bold text-stone-500 bg-stone-200 px-2 py-0.5 rounded">
                          {order.payment?.method}
                        </span>

                        <select
                          value={order.payment?.status}
                          onChange={(e) =>
                            handlePaymentStatusChange(order.id, e.target.value)
                          }
                          disabled={order.status === "CANCELLED"}
                          className={`text-[10px] font-black uppercase tracking-wider rounded border cursor-pointer focus:outline-none px-2 py-1 transition-colors
        ${order.status === "CANCELLED" ? "cursor-not-allowed opacity-50" : ""}
        ${
          order.payment?.status === "SUCCESS"
            ? "bg-green-100 text-green-700 border-green-200"
            : order.payment?.status === "FAILED"
              ? "bg-red-100 text-red-700 border-red-200"
              : order.payment?.status === "REFUNDED"
                ? "bg-purple-100 text-purple-700 border-purple-200"
                : "bg-yellow-100 text-yellow-700 border-yellow-200"
        }
      `}
                        >
                          <option value="PENDING">Chờ TT</option>
                          <option value="SUCCESS">Đã TT</option>
                          <option value="FAILED">Thất bại</option>
                          <option value="REFUNDED">Hoàn tiền</option>
                        </select>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        disabled={
                          order.status === "CANCELLED" ||
                          order.status === "DELIVERED"
                        }
                        className={`text-xs font-bold uppercase tracking-wider rounded-lg px-3 py-2 border-2 cursor-pointer focus:outline-none transition-colors
                          ${
                            order.status === "DELIVERED"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : order.status === "CANCELLED"
                                ? "bg-red-50 text-red-700 border-red-200"
                                : order.status === "SHIPPING"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : order.status === "CONFIRMED"
                                    ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                                    : "bg-yellow-50 text-yellow-700 border-yellow-200"
                          }
                        `}
                      >
                        <option value="PENDING">Chờ Xác Nhận</option>
                        <option value="CONFIRMED">Đã Xác Nhận</option>
                        <option value="SHIPPING">Đang Giao Hàng</option>
                        <option value="DELIVERED">Đã Giao</option>
                        <option value="CANCELLED">Hủy Đơn</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="p-12 text-center text-stone-500 font-bold"
                  >
                    Không tìm thấy đơn hàng nào!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* COMPONENT PHÂN TRANG */}
        {!loading && totalPages > 1 && (
          <div className="bg-white border-t border-stone-200 p-4 flex items-center justify-between mt-auto">
            <span className="text-sm font-bold text-stone-500">
              Trang {currentPage} / {totalPages} (Tổng {totalItems} đơn hàng)
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg flex items-center justify-center transition-colors ${
                  currentPage === 1
                    ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                <ChevronLeft size={20} />
              </button>

              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                if (pageNum < currentPage - 2 || pageNum > currentPage + 2)
                  return null;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-lg font-black transition-colors ${
                      currentPage === pageNum
                        ? "bg-amber-500 text-stone-900 shadow-sm"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg flex items-center justify-center transition-colors ${
                  currentPage === totalPages
                    ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderListPage;
