import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react';

// Data giả lập cho biểu đồ
const revenueData = [
  { name: 'T2', total: 1200 },
  { name: 'T3', total: 2100 },
  { name: 'T4', total: 1800 },
  { name: 'T5', total: 2400 },
  { name: 'T6', total: 3200 },
  { name: 'T7', total: 4500 },
  { name: 'CN', total: 3800 },
];

const StatCard = ({ title, value, icon, colorClass }) => {
  const Icon = icon;
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex items-center gap-4">
      <div className={`p-4 rounded-xl ${colorClass}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm font-medium text-stone-500">{title}</p>
        <h3 className="text-2xl font-black text-stone-800">{value}</h3>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black text-stone-800">Tổng quan hệ thống</h1>
        <button className="bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors">
          Xuất báo cáo
        </button>
      </div>

      {/* 4 Thẻ Thống Kê */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Tổng doanh thu" value="$18,500" icon={DollarSign} colorClass="bg-green-100 text-green-600" />
        <StatCard title="Đơn hàng mới" value="142" icon={ShoppingBag} colorClass="bg-blue-100 text-blue-600" />
        <StatCard title="Khách hàng" value="89" icon={Users} colorClass="bg-purple-100 text-purple-600" />
        <StatCard title="Tăng trưởng" value="+12.5%" icon={TrendingUp} colorClass="bg-amber-100 text-amber-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Biểu đồ Doanh Thu */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 lg:col-span-2">
          <h2 className="text-lg font-bold text-stone-800 mb-6">Biểu đồ doanh thu 7 ngày qua</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f4" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#78716c'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#78716c'}} tickFormatter={(value) => `$${value}`} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="total" stroke="#b45309" strokeWidth={4} dot={{ r: 4, fill: '#b45309' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Danh sách đơn hàng gần đây */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
          <h2 className="text-lg font-bold text-stone-800 mb-6">Đơn hàng mới nhất</h2>
          <div className="space-y-4">
            {/* Tạo sẵn một mảng 5 giá tiền để khỏi dùng Math.random */}
            {[15.99, 42.50, 24.00, 18.75, 55.20].map((price, index) => {
              const i = index + 1;
              return (
                <div key={i} className="flex items-center justify-between border-b border-stone-100 pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="font-bold text-sm text-stone-800">SV-100{i}</p>
                    <p className="text-xs text-stone-500">Nguyễn Văn {String.fromCharCode(64 + i)}</p>
                  </div>
                  <div className="text-right">
                    {/* Dùng luôn giá tiền từ mảng */}
                    <p className="font-bold text-sm text-amber-700">${price.toFixed(2)}</p>
                    <span className="text-[10px] font-bold px-2 py-1 bg-green-100 text-green-700 rounded-full">Đã thanh toán</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;