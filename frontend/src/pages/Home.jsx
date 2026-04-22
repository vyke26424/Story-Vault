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
  Flame,
} from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Slide1 from "../hooks/slider-images/Slide_01.png";
import Slide2 from "../hooks/slider-images/Slide_02.png";
import Slide3 from "../hooks/slider-images/Slide_03.png";
import Slide4 from "../hooks/slider-images/Slide_04.png";
import LeftBanner from "../hooks/slider-images/Left_Banner.jpg";
import RightBanner from "../hooks/slider-images/Right_Banner.jpg";

const TYPE_LABELS = {
  MANGA: { label: "Manga", Icon: Swords, color: "text-red-500" },
  LIGHT_NOVEL: { label: "Light Novel", Icon: Sparkles, color: "text-pink-500" },
  NOVEL: { label: "Tiểu thuyết", Icon: ScrollText, color: "text-amber-600" },
  COMIC: { label: "Comic", Icon: Zap, color: "text-blue-500" },
  BOOK: { label: "Sách Nổi Tiếng", Icon: Library, color: "text-emerald-600" },
};

const HomePage = () => {
  const [sections, setSections] = useState({});
  const [hotProducts, setHotProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const types = Object.keys(TYPE_LABELS);

        // Chuẩn bị các API cần gọi (Thêm API lấy 12 cuốn HOT nhất lên đầu)
        const promises = [
          axiosClient.get(`/search?sort=sold_desc&limit=12`), // Lấy Top 12 cuốn bán chạy nhất
          ...types.map((type) =>
            axiosClient.get(`/search?type=${type}&limit=30`),
          ),
        ];

        const results = await Promise.all(promises);

        // 1. Bóc tách dữ liệu Sản phẩm HOT
        const hotPayload = results[0].data?.data || results[0].data || [];
        setHotProducts(Array.isArray(hotPayload) ? hotPayload : []);

        // 2. Bóc tách dữ liệu các Danh mục (bỏ qua phần tử đầu tiên đã dùng cho HOT)
        const newSections = {};
        types.forEach((type, index) => {
          const res = results[index + 1];
          const payload = res.data?.data || res.data;
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
    if (addToCart) alert(addToCart({ ...item, quantity: 1 }).message);
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
      {/* z-40 để nổi lên trên nền nhưng chìm dưới Header (z-50) */}
      <div className="hidden 2xl:block">
        {/* Banner Trái */}
        <Link
          to="/catalog?type=MANGA"
          className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hover:scale-105 transition-transform duration-300 shadow-xl rounded-2xl overflow-hidden border-2 border-sv-tan"
        >
          {/* Link ảnh giả lập (Sếp thay bằng link ảnh tĩnh tông màu nâu/cream của sếp nhé) */}
          <img
            src={LeftBanner}
            alt="Banner Trái"
            className="w-[160px] h-[500px] object-cover"
          />
        </Link>

        {/* Banner Phải */}
        <Link
          to="/catalog?type=LIGHT_NOVEL"
          className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hover:scale-105 transition-transform duration-300 shadow-xl rounded-2xl overflow-hidden border-2 border-sv-tan"
        >
          {/* Link ảnh giả lập (Tông màu Tan sáng hơn) */}
          <img
            src={RightBanner}
            alt="Banner Phải"
            className="w-[160px] h-[500px] object-cover"
          />
        </Link>
      </div>

      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-3xl overflow-hidden shadow-lg border border-sv-tan relative">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={0}
            slidesPerView={1}
            loop={true}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true, dynamicBullets: true }}
            navigation={true}
            className="w-full aspect-[21/9] md:aspect-[3/1] bg-sv-pale"
          >
            {[Slide1, Slide2, Slide3, Slide4].map((imgSrc, index) => (
              <SwiperSlide key={index}>
                <img
                  src={imgSrc}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* --- SẢN PHẨM HOT (SLIDER) --- */}
      {hotProducts.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-sv-tan overflow-hidden">
            <div className="flex items-center mb-6 border-b border-sv-pale pb-4">
              <h2 className="text-2xl md:text-3xl font-black text-red-600 uppercase tracking-wider flex items-center gap-3">
                <Flame
                  className="text-orange-500"
                  size={32}
                  strokeWidth={2.5}
                />{" "}
                Sản Phẩm HOT
              </h2>
            </div>

            {/* Slider 6 Sản phẩm, cuộn mượt vô tận */}
            <div className="-mx-2 px-2">
              <Swiper
                modules={[Autoplay, Navigation]}
                spaceBetween={20}
                slidesPerView={2} // Mobile hiện 2 cuốn
                breakpoints={{
                  640: { slidesPerView: 3 }, // Tablet hiện 3 cuốn
                  768: { slidesPerView: 4 }, // Laptop nhỏ hiện 4 cuốn
                  1024: { slidesPerView: 6 }, // PC chuẩn hiện đúng 6 cuốn không bị cắt
                }}
                loop={true}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                navigation={true} // Bật mũi tên chuyển slide
                className="pb-4"
              >
                {hotProducts.map((item) => {
                  const isOutOfStock = item.stock <= 0;
                  return (
                    <SwiperSlide key={item.id} className="h-auto">
                      <Link
                        to={`/series/${item.series?.slug || item.slug}`}
                        className="bg-white rounded-2xl border border-sv-tan overflow-hidden shadow-sm hover:shadow-md hover:border-sv-brown transition-all group flex flex-col h-full"
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
                          {/* Badge HOT */}
                          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-black px-2 py-1 rounded-md shadow-sm">
                            HOT
                          </div>
                          {isOutOfStock && (
                            <div className="absolute top-2 right-2 bg-gray-500 text-white text-xs font-black px-2 py-1 rounded-md shadow-sm z-10">
                              HẾT HÀNG
                            </div>
                          )}
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
                          <p className="text-xs text-gray-500 font-bold mb-2">
                            Đã bán: {item.soldCount || 0}
                          </p>
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
                              onClick={(e) => handleAddToCart(e, item)}
                              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm shrink-0 ml-2 ${isOutOfStock ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"}`}
                            >
                              <ShoppingCart size={14} strokeWidth={2.5} />
                            </button>
                          </div>
                        </div>
                      </Link>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          </div>
        </section>
      )}

      {/* --- CÁC DANH MỤC TRUYỆN  --- */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {Object.entries(TYPE_LABELS).map(([type, { label, Icon, color }]) => {
          const items = sections[type] || [];
          if (items.length === 0) return null;

          return (
            <section
              key={type}
              className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-sv-tan"
            >
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
                        {isOutOfStock && (
                          <div className="absolute top-2 left-2 bg-gray-500 text-white text-xs font-black px-2 py-1 rounded-md shadow-sm z-10">
                            HẾT HÀNG
                          </div>
                        )}
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
