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
        const response = await axiosClient.get('/catalog/home');
        setData(response);
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
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-sv-brown" />
      </div>
    );
  }

  return (
    <div className="font-sans pb-12">
      {/* --- HERO SECTION --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="bg-sv-brown rounded-3xl p-8 md:p-16 text-center text-sv-cream shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">Khám Phá Thế Giới Truyện</h1>
            <p className="text-lg md:text-xl text-sv-wheat max-w-2xl mx-auto font-medium mb-8">
              Hàng ngàn tựa manga, light novel và comic đang chờ bạn khám phá.
            </p>
          </div>
          <div className="absolute top-0 left-0 w-64 h-64 bg-black rounded-full mix-blend-overlay filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-10 translate-x-1/3 translate-y-1/3"></div>
        </div>
      </section>

      {/* --- CATEGORY PILLS --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar">
          <button className="whitespace-nowrap px-6 py-2.5 bg-sv-brown text-white font-bold rounded-full text-sm shrink-0 shadow-md">
            Tất cả
          </button>
          {data.categories.map((cat) => (
            <button key={cat.id} className="whitespace-nowrap px-6 py-2.5 bg-white border border-sv-tan text-sv-brown font-bold rounded-full text-sm shrink-0 hover:bg-sv-wheat transition-all shadow-sm">
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* --- FEATURED SERIES GRID --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-sv-brown">Truyện mới cập nhật</h2>
          <Link to="/category" className="text-sv-brown font-bold text-sm hover:underline">Xem tất cả →</Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.featuredSeries.map((series) => {
            const firstVolume = series.volumes?.[0];
            const price = firstVolume ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(firstVolume.price) : 'Đang cập nhật';

            return (
              <Link to={`/series/${series.slug}`} key={series.id} className="group cursor-pointer flex flex-col">
                <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden shadow-sm border border-sv-tan mb-4 bg-sv-pale">
                  <img 
                    src={series.coverImage || 'https://via.placeholder.com/300x450?text=No+Image'} 
                    alt={series.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-sv-brown text-xs font-black px-2 py-1 rounded-md shadow-sm">
                    {series.type}
                  </div>
                </div>
                
                <h3 className="font-bold text-sv-brown line-clamp-2 leading-snug group-hover:opacity-80 transition-colors">
                  {series.title}
                </h3>
                <p className="text-sm text-gray-500 font-medium mt-1 mb-2">{series.author}</p>
                
                <div className="mt-auto flex items-center justify-between">
                  <span className="font-black text-sv-brown">{price}</span>
                  <button className="w-8 h-8 rounded-full bg-sv-wheat text-sv-brown flex items-center justify-center group-hover:bg-sv-brown group-hover:text-white transition-colors shadow-sm">
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