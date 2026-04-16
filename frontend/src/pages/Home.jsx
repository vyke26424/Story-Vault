import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../utils/axiosClient';
import { Loader2 } from 'lucide-react';

const HomePage = () => {
  const [data, setData] = useState({ categories: [], featuredSeries: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // Gọi API Backend ta vừa tạo
        const response = await axiosClient.get('/catalog/home');
        setData(response); // Nhờ Interceptor trả thẳng data rồi nên ta set luôn
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu trang chủ:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <Loader2 className="w-10 h-10 animate-spin text-amber-700" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans pb-12">
      {/* --- HERO SECTION --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="bg-amber-900 rounded-3xl p-8 md:p-16 text-center text-amber-50 shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">Khám Phá Thế Giới Truyện</h1>
            <p className="text-lg md:text-xl text-amber-200/90 max-w-2xl mx-auto font-medium mb-8">
              Hàng ngàn tựa manga, light novel và comic đang chờ bạn khám phá.
            </p>
          </div>
          {/* Vài hình tròn trang trí cho đẹp */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-amber-800 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-950 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-x-1/3 translate-y-1/3"></div>
        </div>
      </section>

      {/* --- CATEGORY PILLS --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
          <button className="whitespace-nowrap px-6 py-2.5 bg-stone-800 text-white font-bold rounded-full text-sm shrink-0 shadow-md">
            Tất cả
          </button>
          {data.categories.map((cat) => (
            <button key={cat.id} className="whitespace-nowrap px-6 py-2.5 bg-white border border-stone-200 text-stone-600 font-bold rounded-full text-sm shrink-0 hover:border-amber-400 hover:text-amber-800 transition-all shadow-sm">
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* --- FEATURED SERIES GRID --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-stone-800">Truyện mới cập nhật</h2>
          <Link to="/category" className="text-amber-700 font-bold text-sm hover:underline">Xem tất cả →</Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.featuredSeries.map((series) => {
            // Trích xuất giá của tập 1 (nếu có)
            const firstVolume = series.volumes?.[0];
            const price = firstVolume ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(firstVolume.price) : 'Đang cập nhật';

            return (
              <Link to={`/series/${series.slug}`} key={series.id} className="group cursor-pointer flex flex-col">
                <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden shadow-sm border border-stone-100 mb-4 bg-stone-100">
                  <img 
                    src={series.coverImage || 'https://via.placeholder.com/300x450?text=No+Image'} 
                    alt={series.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Tag Type (Manga, Comic...) */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-stone-800 text-xs font-black px-2 py-1 rounded-md shadow-sm">
                    {series.type}
                  </div>
                </div>
                
                <h3 className="font-bold text-stone-800 line-clamp-2 leading-snug group-hover:text-amber-700 transition-colors">
                  {series.title}
                </h3>
                <p className="text-sm text-stone-500 font-medium mt-1 mb-2">{series.author}</p>
                
                <div className="mt-auto flex items-center justify-between">
                  <span className="font-black text-amber-700">{price}</span>
                  <button className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center group-hover:bg-amber-900 group-hover:text-white transition-colors">
                    +
                  </button>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default HomePage;