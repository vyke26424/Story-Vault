import React, { useState, useEffect } from "react";
import {
  Users,
  ShoppingBag,
  DollarSign,
  BookOpen,
  Loader2,
  TrendingUp,
  BarChart3,
  Award,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axiosClient from "../../utils/axiosClient";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosClient.get("/admin/dashboard");
      setStats(res.data?.data || res.data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu Dashboard:", error);
      setError(
        "Không thể tải dữ liệu Dashboard. Vui lòng kiểm tra lại quyền Admin và kết nối mạng.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="animate-spin text-amber-500" size={48} />
      </div>
    );
  }

  const chartData =
    stats?.chartData?.length > 0
      ? stats.chartData
      : [
          { name: "01/01", revenue: 0 },
          { name: "02/01", revenue: 0 },
          { name: "03/01", revenue: 0 },
          { name: "04/01", revenue: 0 },
        ];

  return (
    <div className="p-6 font-nunito bg-stone-50 min-h-screen pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-stone-800">
          Tổng quan hệ thống
        </h1>
        <p className="text-stone-500 font-medium">
          Theo dõi các chỉ số quan trọng của Story Vault hôm nay.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl mb-8 shadow-sm">
          <p className="font-bold">Đã xảy ra lỗi</p>
          <p>{error}</p>
        </div>
      )}

      {/* 4 THẺ THỐNG KÊ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 shrink-0">
            <DollarSign size={28} />
          </div>
          <div>
            <p className="text-sm font-bold text-stone-500">Tổng doanh thu</p>
            <h3 className="text-2xl font-black text-stone-800 line-clamp-1">
              {new Intl.NumberFormat("vi-VN").format(stats?.totalRevenue || 0)}đ
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
            <ShoppingBag size={28} />
          </div>
          <div>
            <p className="text-sm font-bold text-stone-500">
              Đơn hàng (Trừ hủy)
            </p>
            <h3 className="text-2xl font-black text-stone-800">
              {stats?.totalOrders || 0}
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 shrink-0">
            <Users size={28} />
          </div>
          <div>
            <p className="text-sm font-bold text-stone-500">Khách hàng</p>
            <h3 className="text-2xl font-black text-stone-800">
              {stats?.totalUsers || 0}
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 shrink-0">
            <BookOpen size={28} />
          </div>
          <div>
            <p className="text-sm font-bold text-stone-500">Sách trong kho</p>
            <h3 className="text-2xl font-black text-stone-800">
              {stats?.totalStock || 0}
            </h3>
          </div>
        </div>
      </div>

      {/* DÒNG 2: BIỂU ĐỒ & ĐƠN HÀNG */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-stone-200 p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 size={24} className="text-amber-500" />
            <h2 className="text-xl font-black text-stone-800">
              Doanh thu 7 ngày qua
            </h2>
          </div>
          <div className="w-full h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e5e7eb"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280", fontSize: 12, fontWeight: "bold" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280", fontSize: 12, fontWeight: "bold" }}
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <Tooltip
                  formatter={(value) => [
                    `${new Intl.NumberFormat("vi-VN").format(value)} đ`,
                    "Doanh thu",
                  ]}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  labelStyle={{
                    fontWeight: "black",
                    color: "#1f2937",
                    marginBottom: "4px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
            <h2 className="text-xl font-black text-stone-800 flex items-center gap-2">
              <TrendingUp size={24} className="text-amber-500" /> Đơn gần đây
            </h2>
          </div>
          <div className="p-2 overflow-y-auto custom-scrollbar flex-1 max-h-[350px]">
            {stats?.recentOrders?.length > 0 ? (
              <div className="space-y-2">
                {stats.recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-2xl border border-stone-100 hover:bg-stone-50 transition-colors flex justify-between items-center"
                  >
                    <div>
                      <p className="font-bold text-stone-800 text-sm">
                        {order.user?.name || "Khách"}
                      </p>
                      <p className="font-black text-amber-600 text-sm mt-0.5">
                        {new Intl.NumberFormat("vi-VN").format(
                          order.finalAmount,
                        )}
                        đ
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider
                        ${order.status === "DELIVERED" ? "bg-green-100 text-green-700" : order.status === "CANCELLED" ? "bg-red-100 text-red-700" : order.status === "SHIPPING" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"}`}
                      >
                        {order.status}
                      </span>
                      <p className="text-[10px] font-bold text-stone-400 mt-1">
                        {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8 text-stone-400">
                <span className="text-3xl mb-2">📦</span>
                <p className="text-sm font-bold">Chưa có đơn hàng nào.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TOP SẢN PHẨM BÁN CHẠY (MỚI THÊM) */}
      <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-amber-50/50">
          <h2 className="text-xl font-black text-stone-800 flex items-center gap-2">
            <Award size={24} className="text-amber-500" /> Top 5 Truyện Bán Chạy
            Nhất
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-stone-50">
              <tr className="text-stone-500 text-sm border-b border-stone-200">
                <th className="p-4 font-bold text-center w-16">Top</th>
                <th className="p-4 font-bold">Sản phẩm</th>
                <th className="p-4 font-bold text-right">Đã bán</th>
                <th className="p-4 font-bold text-right">Giá / Cuốn</th>
                <th className="p-4 font-bold text-right">Doanh thu tạm tính</th>
              </tr>
            </thead>
            <tbody>
              {stats?.topSellingProducts?.length > 0 ? (
                stats.topSellingProducts.map((product, index) => (
                  <tr
                    key={product.id}
                    className="border-b border-stone-100 hover:bg-stone-50 transition-colors"
                  >
                    <td className="p-4 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-black text-sm
                        ${
                          index === 0
                            ? "bg-yellow-400 text-yellow-900 shadow-md"
                            : index === 1
                              ? "bg-stone-300 text-stone-800"
                              : index === 2
                                ? "bg-orange-300 text-orange-900"
                                : "bg-stone-100 text-stone-500"
                        }`}
                      >
                        {index + 1}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            product.coverImage ||
                            "https://via.placeholder.com/50"
                          }
                          alt="Cover"
                          className="w-10 h-14 object-cover rounded shadow-sm border border-stone-200 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-stone-800 line-clamp-1">
                            {product.title || product.series?.title}
                          </p>
                          <p className="text-xs text-stone-500 truncate max-w-[200px]">
                            ID: {product.id.substring(0, 8)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <span className="font-black text-green-600 bg-green-50 px-3 py-1 rounded-full">
                        {product.soldCount} cuốn
                      </span>
                    </td>
                    <td className="p-4 text-right font-bold text-stone-600">
                      {new Intl.NumberFormat("vi-VN").format(product.price)}đ
                    </td>
                    <td className="p-4 text-right font-black text-amber-600">
                      {/* Doanh thu tạm tính = Số bán * Giá. Nếu có giảm giá (khác originalPrice) thì con số này có thể lệch xíu, nhưng để tham khảo thì rất ok */}
                      {new Intl.NumberFormat("vi-VN").format(
                        product.soldCount * product.price,
                      )}
                      đ
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="p-8 text-center text-stone-500 font-bold"
                  >
                    Chưa có sản phẩm nào bán được.
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

export default AdminDashboard;
