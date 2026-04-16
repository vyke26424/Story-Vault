import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../utils/axiosClient';
import { Loader2, ArrowLeft, ShoppingCart } from 'lucide-react';

const SeriesDetailPage = () => {
  const { slug } = useParams(); // Lấy slug từ URL
  const [series, setSeries] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const data = await axiosClient.get(`/catalog/series/${slug}`);
        setSeries(data);
      } catch (err) {
        setError('Không tìm thấy truyện hoặc có lỗi xảy ra!');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-amber-700" />
      </div>
    );
  }

  if (error || !series) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-stone-700">{error}</h2>
        <Link to="/" className="text-amber-700 font-bold hover:underline border border-amber-700 px-4 py-2 rounded-full">
          Quay lại trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Nút Back */}
      <Link to="/" className="inline-flex items-center gap-2 text-stone-500 hover:text-amber-800 font-bold mb-8 transition-colors">
        <ArrowLeft size={20} /> Quay lại
      </Link>

      {/* THÔNG TIN CHUNG CỦA SERIES */}
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12 mb-16">
        {/* Ảnh Bìa */}
        <div className="w-full md:w-1/3 lg:w-1/4 shrink-0">
          <div className="aspect-[2/3] w-full rounded-2xl overflow-hidden shadow-lg border border-stone-200">
            <img 
              src={series.coverImage || 'https://via.placeholder.com/400x600?text=No+Image'} 
              alt={series.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Cột Thông tin */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-amber-100 text-amber-900 px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider">
              {series.type}
            </span>
            <span className={`px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider ${series.status === 'ONGOING' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
              {series.status}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-stone-800 tracking-tight mb-4">
            {series.title}
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-stone-50 rounded-2xl border border-stone-100">
            <div>
              <p className="text-sm text-stone-500 font-medium">Tác giả</p>
              <p className="font-bold text-stone-800">{series.author || 'Đang cập nhật'}</p>
            </div>
            <div>
              <p className="text-sm text-stone-500 font-medium">Nhà xuất bản</p>
              <p className="font-bold text-stone-800">{series.publisher || 'Đang cập nhật'}</p>
            </div>
            <div>
              <p className="text-sm text-stone-500 font-medium">Danh mục</p>
              <p className="font-bold text-stone-800">{series.category?.name}</p>
            </div>
            <div>
              <p className="text-sm text-stone-500 font-medium">Số tập</p>
              <p className="font-bold text-stone-800">{series.volumes?.length || 0} tập</p>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-stone-800 text-lg mb-2">Nội dung tóm tắt</h3>
            <p className="text-stone-600 leading-relaxed font-medium">
              {series.description || 'Chưa có thông tin mô tả cho bộ truyện này.'}
            </p>
          </div>
        </div>
      </div>

      {/* DANH SÁCH CÁC TẬP (VOLUMES) */}
      <div>
        <h2 className="text-2xl font-black text-stone-800 mb-6 flex items-center gap-3">
          📚 Danh sách các tập
        </h2>
        
        {series.volumes?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {series.volumes.map((volume) => {
              const price = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(volume.price);
              const isOutOfStock = volume.stock <= 0;

              return (
                <div key={volume.id} className="bg-white border border-stone-200 rounded-2xl p-4 flex gap-4 hover:border-amber-400 hover:shadow-md transition-all">
                  <img 
                    src={volume.coverImage || series.coverImage} 
                    alt={volume.title}
                    className="w-20 h-28 object-cover rounded-lg shrink-0 border border-stone-100"
                  />
                  <div className="flex flex-col flex-1 py-1">
                    <h3 className="font-bold text-stone-800 text-sm line-clamp-2 leading-snug mb-1">
                      {volume.title || `Tập ${volume.isbn}`}
                    </h3>
                    <p className="text-xs font-medium text-stone-500 mb-2">Kho: {volume.stock}</p>
                    
                    <div className="mt-auto flex items-end justify-between">
                      <span className="font-black text-amber-700">{price}</span>
                      <button 
                        disabled={isOutOfStock}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors shadow-sm ${
                          isOutOfStock 
                          ? 'bg-stone-100 text-stone-400 cursor-not-allowed' 
                          : 'bg-stone-800 text-white hover:bg-amber-700'
                        }`}
                      >
                        <ShoppingCart size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 bg-stone-50 rounded-2xl text-center border border-stone-200">
            <p className="text-stone-500 font-bold">Hiện chưa có tập truyện nào được bán.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeriesDetailPage;