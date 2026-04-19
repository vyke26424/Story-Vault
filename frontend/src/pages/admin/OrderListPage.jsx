import React, { useState, useEffect } from "react";
import { Search, Loader2, FileText, Eye } from "lucide-react";
import axiosClient from "../../utils/axiosClient";

const OrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/admin/orders");
      setOrders(res.data?.data || res.data || []);
    } catch (error) {
      console.error("Lỗi lấy đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Đổi trạng thái đơn hàng
  const handleStatusChange = async (orderId, newStatus) => {
    if (window.confirm("Xác nhận đổi trạng thái đơn hàng này?")) {
      try {
        await axiosClient.patch(`/admin/orders/${orderId}/status`, {
          status: newStatus,
        });
        alert("Đã cập nhật trạng thái!");
        fetchOrders(); // Refresh lại data
      } catch (error) {
        alert("Lỗi cập nhật trạng thái!");
      }
    }
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
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
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-xs font-bold text-stone-500 bg-stone-200 px-2 py-0.5 rounded">
                          {order.payment?.method}
                        </span>
                        <span
                          className={`text-[10px] font-black uppercase tracking-wider ${
                            order.payment?.status === "SUCCESS"
                              ? "text-green-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {order.payment?.status}
                        </span>
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
      </div>
    </div>
  );
};

export default OrderListPage;
