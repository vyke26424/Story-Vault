import React, { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { Search, ChevronLeft } from 'lucide-react';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || ''; // Lấy từ khóa từ URL
  
  const { products, isLoading } = useProducts();

  // Dùng useMemo để lọc sản phẩm, tối ưu hiệu suất (không phân biệt hoa thường)
  const searchResults = useMemo(() => {
    if (!query) return [];
    const lowerCaseQuery = query.toLowerCase();
    
    return products.filter(product => 
      product.title.toLowerCase().includes(lowerCaseQuery) ||
      product.author.toLowerCase().includes(lowerCaseQuery) ||
      product.category.toLowerCase().includes(lowerCaseQuery)
    );
  }, [products, query]);

  if (isLoading) {
    return <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center font-bold text-amber-800">Đang tìm kiếm...</div>;
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans flex flex-col">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        {/* Thanh đường dẫn */}
        <Link to="/" className="inline-flex items-center gap-2 text-stone-500 hover:text-amber-800 mb-6 transition-colors font-medium text-sm">
          <ChevronLeft size={16} /> Về trang chủ
        </Link>

        <div className="mb-8 border-b border-amber-100 pb-6">
          <h2 className="text-2xl md:text-3xl font-black text-stone-800 flex items-center gap-3">
            <Search className="text-amber-600" size={28} />
            Kết quả tìm kiếm cho: <span className="text-amber-700">"{query}"</span>
          </h2>
          <p className="text-stone-500 mt-2 font-medium">
            Tìm thấy {searchResults.length} truyện phù hợp trong kho lưu trữ.
          </p>
        </div>

        {/* Hiển thị kết quả */}
        {searchResults.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {searchResults.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          // Giao diện khi không tìm thấy sách
          <div className="bg-white rounded-3xl border border-dashed border-amber-200 py-20 px-4 text-center shadow-sm">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-bold text-stone-800 mb-2">Không tìm thấy kết quả!</h3>
            <p className="text-stone-500 mb-6 max-w-md mx-auto">
              Rất tiếc, chúng tôi không tìm thấy cuốn truyện nào khớp với từ khóa "{query}". Hãy thử tìm kiếm bằng một từ khóa khác ngắn hơn hoặc xem các danh mục của chúng tôi.
            </p>
            <Link to="/category" className="inline-block bg-amber-800 hover:bg-amber-900 text-white font-bold py-3 px-8 rounded-xl transition-colors">
              Khám phá toàn bộ kho sách
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default SearchPage;