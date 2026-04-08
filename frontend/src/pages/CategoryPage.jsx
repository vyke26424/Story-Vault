import React, { useState, useMemo } from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Filter, ChevronDown } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'Tất cả sản phẩm' },
  { id: 'manga', label: 'Manga Nhật Bản' },
  { id: 'manhwa', label: 'Manhwa Hàn Quốc' },
  { id: 'comic', label: 'Comic Phương Tây' },
  { id: 'novel', label: 'Tiểu Thuyết / Light Novel' },
];

const CategoryPage = () => {
  const { products, isLoading } = useProducts();
  
  // State quản lý bộ lọc và sắp xếp
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');

  // useMemo giúp tối ưu hóa, chỉ tính toán lại khi products, category hoặc sortBy thay đổi
  const filteredAndSortedProducts = useMemo(() => {
    // 1. Lọc theo Category
    let result = products;
    if (activeCategory !== 'all') {
      result = result.filter(item => item.category === activeCategory);
    }

    // 2. Sắp xếp (Giá tăng/giảm)
    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, activeCategory, sortBy]);

  if (isLoading) {
    return <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">Đang tải...</div>;
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans flex flex-col">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        {/* Breadcrumb (Đường dẫn) */}
        <div className="text-sm text-stone-500 mb-6">
          Trang chủ / <span className="text-amber-800 font-medium">Kho lưu trữ</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SIDEBAR: BỘ LỌC (Cột Trái) */}
          <aside className="w-full lg:w-1/4">
            <div className="bg-white rounded-2xl p-6 border border-amber-100 shadow-sm sticky top-24">
              <div className="flex items-center gap-2 mb-6 border-b border-amber-100 pb-4">
                <Filter size={20} className="text-amber-800" />
                <h2 className="text-lg font-bold text-stone-800 uppercase tracking-wide">Bộ Lọc</h2>
              </div>

              {/* Danh sách Category */}
              <div className="space-y-3">
                <h3 className="font-semibold text-stone-700 mb-3">Danh mục</h3>
                {CATEGORIES.map(cat => (
                  <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="category"
                      checked={activeCategory === cat.id}
                      onChange={() => setActiveCategory(cat.id)}
                      className="w-4 h-4 text-amber-600 focus:ring-amber-500 border-gray-300"
                    />
                    <span className={`text-sm font-medium transition-colors ${
                      activeCategory === cat.id ? 'text-amber-800 font-bold' : 'text-stone-600 group-hover:text-amber-700'
                    }`}>
                      {cat.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT: DANH SÁCH SẢN PHẨM (Cột Phải) */}
          <section className="w-full lg:w-3/4">
            
            {/* Thanh công cụ sắp xếp */}
            <div className="flex justify-between items-center bg-white rounded-xl p-4 border border-amber-100 mb-6 shadow-sm">
              <p className="text-stone-600 text-sm">
                Tìm thấy <span className="font-bold text-stone-900">{filteredAndSortedProducts.length}</span> kết quả
              </p>
              
              <div className="flex items-center gap-2 text-sm">
                <span className="text-stone-500">Sắp xếp:</span>
                <div className="relative">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-amber-50 border border-amber-200 text-stone-700 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium cursor-pointer"
                  >
                    <option value="default">Mới nhất</option>
                    <option value="price-asc">Giá: Thấp đến Cao</option>
                    <option value="price-desc">Giá: Cao đến Thấp</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Grid Sản phẩm */}
            {filteredAndSortedProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {filteredAndSortedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-amber-200">
                <span className="text-4xl block mb-4">📭</span>
                <h3 className="text-xl font-bold text-stone-700">Không tìm thấy sách phù hợp</h3>
                <p className="text-stone-500 mt-2">Vui lòng thử chọn danh mục khác nhé.</p>
              </div>
            )}

          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CategoryPage;