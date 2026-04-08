// file: src/pages/Home.jsx
import React from 'react';
import { useProducts } from '../hooks/useProducts';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Slider from '../components/Slider';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';


const Home = () => {
  const { products, hotProducts, isLoading } = useProducts();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-200 border-t-amber-800"></div>
          <p className="text-amber-800 font-medium animate-pulse">Đang mở khóa kho lưu trữ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans flex flex-col">
      
      {/* Import Component Header */}
      <Header />

      {/* Main Content (được đẩy flex-grow để Footer luôn nằm ở dưới cùng nếu nội dung ngắn) */}
      <main className="max-w-7xl mx-auto py-6 flex-grow w-full">
        {/* Section 1: Slider */}
        <section className="mb-14">
          <Slider books={products.slice(0, 6)} />
        </section>

        {/* Section 2: Hot Products */}
        <section className="px-4 md:px-8 mb-16">
          <div className="flex justify-between items-end mb-8 border-b-2 border-amber-100 pb-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-stone-800">
                Đang <span className="text-red-500">Thịnh Hành</span> 🔥
              </h2>
              <p className="text-stone-500 mt-1 font-medium">Những tựa sách được săn lùng nhiều nhất.</p>
            </div>
            <Link to="/category" className="text-amber-700 font-bold hover:text-amber-900 transition-colors">
              Xem tất cả &rarr;
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {hotProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>

      {/* Import Component Footer */}
      <Footer />
      
    </div>
  );
};

export default Home;