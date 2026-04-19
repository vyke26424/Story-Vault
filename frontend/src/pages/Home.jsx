import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../utils/axiosClient";
import useCartStore from "../store/useCartStore";
import {
  Loader2,
  ShoppingCart,
  ArrowRight,
  Swords,
  Sparkles,
  ScrollText,
  Zap,
  Library,
} from "lucide-react";

const TYPE_LABELS = {
  MANGA: { label: "Manga", Icon: Swords, color: "text-red-500" },
  LIGHT_NOVEL: { label: "Light Novel", Icon: Sparkles, color: "text-pink-500" },
  NOVEL: { label: "Tiểu thuyết", Icon: ScrollText, color: "text-amber-600" },
  COMIC: { label: "Comic", Icon: Zap, color: "text-blue-500" },
  BOOK: { label: "Sách Nổi Tiếng", Icon: Library, color: "text-emerald-600" },
};

const HomePage = () => {
  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(true);
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const types = Object.keys(TYPE_LABELS);

        // Gọi API lấy dữ liệu của tất cả các danh mục cùng lúc (Mỗi danh mục lấy 30 cuốn để trộn)
        const promises = types.map((type) =>
          axiosClient.get(`/search?type=${type}&limit=30`),
        );
        const results = await Promise.all(promises);

        const newSections = {};
        types.forEach((type, index) => {
          const res = results[index];
          const payload = res.data || res;
          const dataList = Array.isArray(payload)
            ? payload
            : payload.data || [];

          // Trộn ngẫu nhiên (Shuffle) và cắt lấy đúng 12 cuốn
          const shuffled = [...dataList]
            .sort(() => 0.5 - Math.random())
            .slice(0, 12);
          newSections[type] = shuffled;
        });

        setSections(newSections);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu trang chủ:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const handleAddToCart = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    if (item.stock <= 0) return;
    if (addToCart) {
      alert(addToCart({ ...item, quantity: 1 }).message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-sv-cream flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-sv-brown" />
      </div>
    );
  }

  return (
    <div className="font-nunito pb-12 bg-sv-cream min-h-screen">
      {/* --- HERO SECTION --- */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="bg-sv-brown rounded-3xl p-8 md:p-16 text-center text-sv-cream shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
              Khám Phá Thế Giới Truyện
            </h1>
            <p className="text-lg md:text-xl text-sv-wheat max-w-2xl mx-auto font-medium mb-8">
              Hàng ngàn bí kíp manga, light novel và comic đang chờ bạn khám
              phá.
            </p>
          </div>
          <div className="absolute top-0 left-0 w-64 h-64 bg-black rounded-full mix-blend-overlay filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-10 translate-x-1/3 translate-y-1/3"></div>
        </div>
      </section>

      {/* --- CÁC DANH MỤC TRUYỆN --- */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {Object.entries(TYPE_LABELS).map(([type, { label, Icon, color }]) => {
          const items = sections[type] || [];
          if (items.length === 0) return null;

          return (
            <section
              key={type}
              className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-sv-tan"
            >
              {/* Tiêu đề & Nút Xem tất cả */}
              <div className="flex items-center justify-between mb-6 border-b border-sv-pale pb-4">
                <h2 className="text-2xl md:text-3xl font-black text-sv-brown uppercase tracking-wider flex items-center gap-3">
                  <Icon className={color} size={32} strokeWidth={2.5} /> {label}
                </h2>
                <Link
                  to={`/catalog?type=${type}`}
                  className="flex items-center gap-1 text-sm font-bold text-amber-600 hover:text-amber-700 transition-colors"
                >
                  Xem tất cả <ArrowRight size={18} />
                </Link>
              </div>

              {/* Lưới Sản phẩm (6 cuốn mỗi hàng trên màn hình lớn) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
                {items.map((item) => {
                  const isOutOfStock = item.stock <= 0;
                  return (
                    <Link
                      key={item.id}
                      to={`/series/${item.series?.slug || item.slug}`}
                      className="bg-white rounded-2xl border border-sv-tan overflow-hidden shadow-sm hover:shadow-md hover:border-sv-brown transition-all group flex flex-col"
                    >
                      <div className="relative aspect-[2/3] overflow-hidden bg-sv-pale">
                        <img
                          src={
                            item.coverImage ||
                            item.series?.coverImage ||
                            "https://via.placeholder.com/300x450"
                          }
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-3 flex flex-col flex-1">
                        <h3
                          className="font-black text-sv-brown text-sm line-clamp-2 mb-1 group-hover:opacity-80 transition-colors"
                          title={item.series?.title || item.title}
                        >
                          {item.series?.title || item.title}{" "}
                          {item.volumeNumber
                            ? `- Tập ${item.volumeNumber}`
                            : ""}
                        </h3>

                        <div className="mt-auto flex items-end justify-between pt-2">
                          <div className="flex flex-col min-w-0">
                            {item.originalPrice &&
                              item.originalPrice > item.price && (
                                <p className="text-[11px] font-bold text-sv-brown line-through opacity-70 mb-0.5 truncate">
                                  {new Intl.NumberFormat("vi-VN").format(
                                    item.originalPrice,
                                  )}
                                  đ
                                </p>
                              )}
                            <p
                              className={`font-black text-base truncate ${item.originalPrice && item.originalPrice > item.price ? "text-red-600" : "text-sv-brown"}`}
                            >
                              {new Intl.NumberFormat("vi-VN").format(
                                item.price || 0,
                              )}
                              đ
                            </p>
                          </div>
                          <button
                            disabled={isOutOfStock}
                            title={isOutOfStock ? "Hết hàng" : "Thêm vào giỏ"}
                            onClick={(e) => handleAddToCart(e, item)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm shrink-0 ml-2 ${isOutOfStock ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-sv-wheat text-sv-brown hover:bg-sv-brown hover:text-white"}`}
                          >
                            <ShoppingCart size={14} strokeWidth={2.5} />
                          </button>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default HomePage;
