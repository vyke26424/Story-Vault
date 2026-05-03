import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axiosClient from "../utils/axiosClient";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import {
  Loader2,
  ChevronRight,
  Home,
  Filter,
  SlidersHorizontal,
  BookOpen,
  ChevronLeft,
} from "lucide-react";

const TYPE_LABELS = {
  MANGA: "Manga",
  LIGHT_NOVEL: "Light Novel",
  NOVEL: "Tiểu thuyết",
  COMIC: "Comic",
  BOOK: "Sách Nổi Tiếng",
};

const CatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentType = searchParams.get("type") || "MANGA";
  const currentPage = parseInt(searchParams.get("page")) || 1;

  const [series, setSeries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "",
  );
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [minInput, setMinInput] = useState("0");
  const [maxInput, setMaxInput] = useState("500000");

  useEffect(() => {
    setMinInput(priceRange[0].toString());
    setMaxInput(priceRange[1].toString());
  }, [priceRange]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosClient.get("/category");
        setCategories(res.data?.data || res.data || []);
      } catch (error) {
        console.error("Lỗi lấy thể loại:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setLoading(true);
        const query = new URLSearchParams({
          type: currentType,
          sortBy: searchParams.get("sortBy") || "newest",
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          page: currentPage,
          limit: 12,
        });
        if (selectedCategory) query.append("category", selectedCategory);

        const res = await axiosClient.get(
          `/series/catalog?${query.toString()}`,
        );

        const payload = res.data;

        if (payload && payload.meta) {
          setSeries(payload.data || []);
          setTotalPages(payload.meta.totalPages || 1);
          setTotalItems(payload.meta.totalItems || 0);
        } else if (Array.isArray(payload)) {
          setSeries(payload);
          setTotalItems(payload.length);
        } else {
          setSeries([]);
          setTotalItems(0);
        }
      } catch (error) {
        console.error("Lỗi lấy Catalog:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, [
    currentType,
    selectedCategory,
    searchParams.get("sortBy"),
    priceRange,
    currentPage,
  ]);

  const updateURLParams = (key, value) => {
    setSearchParams((prev) => {
      if (value) prev.set(key, value);
      else prev.delete(key);
      if (key !== "page") prev.set("page", 1);
      return prev;
    });
  };

  const handleCategoryChange = (slug) => {
    setSelectedCategory(slug === selectedCategory ? "" : slug);
    updateURLParams("category", slug === selectedCategory ? "" : slug);
  };

  const handleSortChange = (e) => {
    updateURLParams("sortBy", e.target.value);
  };

  const handleApplyPrice = () => {
    let min = parseInt(minInput) || 0;
    let max = parseInt(maxInput) || 0;
    if (min > max) {
      const temp = min;
      min = max;
      max = temp;
    }
    setPriceRange([min, max]);
    setSearchParams((prev) => {
      prev.set("page", 1);
      return prev;
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      updateURLParams("page", newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-sv-cream min-h-screen py-8 font-nunito">
      {/* BREADCRUMBS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 flex items-center gap-2 text-sm font-bold text-gray-500">
        <Link to="/" className="hover:text-sv-brown flex items-center gap-1">
          <Home size={16} /> Trang chủ
        </Link>
        <ChevronRight size={16} />
        <span>Danh mục</span>
        <ChevronRight size={16} />
        <span className="text-sv-brown">{TYPE_LABELS[currentType]}</span>
      </div>

      {/* 👉 ĐÃ SỬA: Thu hẹp gap giữa Sidebar và Lưới kết quả xuống gap-3 (~3mm) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-3">
        {/* CỘT TRÁI - SIDEBAR */}
        <aside className="w-full lg:w-72 shrink-0 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-sv-tan">
            <h3 className="text-lg font-black text-sv-brown flex items-center gap-2 mb-4 border-b border-sv-pale pb-3">
              <Filter size={18} /> Thể Loại
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar pr-2">
              {categories.map((cat) => (
                <label
                  key={cat.id}
                  onClick={(e) => {
                    e.preventDefault();
                    handleCategoryChange(cat.slug);
                  }}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div
                    className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedCategory === cat.slug ? "bg-sv-brown border-sv-brown" : "bg-sv-pale border-sv-tan group-hover:border-sv-brown"}`}
                  >
                    {selectedCategory === cat.slug && (
                      <span className="text-white font-bold text-xs">✓</span>
                    )}
                  </div>
                  <span
                    className={`font-bold transition-colors ${selectedCategory === cat.slug ? "text-sv-brown" : "text-gray-500 group-hover:text-sv-brown"}`}
                  >
                    {cat.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-sv-tan">
            <h3 className="text-lg font-black text-sv-brown flex items-center gap-2 mb-6 border-b border-sv-pale pb-3">
              <SlidersHorizontal size={18} /> Khoảng Giá
            </h3>
            <div className="px-2 mb-6">
              <Slider
                range
                min={0}
                max={500000}
                step={10000}
                value={priceRange}
                onChange={(val) => setPriceRange(val)}
                onAfterChange={() =>
                  setSearchParams((prev) => {
                    prev.set("page", 1);
                    return prev;
                  })
                }
                trackStyle={[{ backgroundColor: "#8B6969", height: 6 }]}
                handleStyle={[
                  {
                    borderColor: "#8B6969",
                    backgroundColor: "white",
                    opacity: 1,
                    height: 20,
                    width: 20,
                    marginTop: -7,
                  },
                  {
                    borderColor: "#8B6969",
                    backgroundColor: "white",
                    opacity: 1,
                    height: 20,
                    width: 20,
                    marginTop: -7,
                  },
                ]}
                railStyle={{ backgroundColor: "#D2B48C", height: 6 }}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={minInput}
                onChange={(e) => setMinInput(e.target.value)}
                onBlur={handleApplyPrice}
                onKeyDown={(e) => e.key === "Enter" && handleApplyPrice()}
                className="w-full bg-sv-pale px-3 py-2 rounded-xl border border-sv-tan text-sm font-bold focus:outline-none focus:ring-2 focus:ring-sv-brown text-center hide-arrows"
                placeholder="Min"
              />
              <span className="text-sv-tan">—</span>
              <input
                type="number"
                value={maxInput}
                onChange={(e) => setMaxInput(e.target.value)}
                onBlur={handleApplyPrice}
                onKeyDown={(e) => e.key === "Enter" && handleApplyPrice()}
                className="w-full bg-sv-pale px-3 py-2 rounded-xl border border-sv-tan text-sm font-bold focus:outline-none focus:ring-2 focus:ring-sv-brown text-center hide-arrows"
                placeholder="Max"
              />
            </div>
          </div>
        </aside>

        {/* CỘT PHẢI */}
        <div className="flex-1 w-full overflow-hidden">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-sv-tan mb-3 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-2xl font-black text-sv-brown">
                {TYPE_LABELS[currentType]}
              </h1>
              <p className="text-gray-500 font-medium">
                Tìm thấy {totalItems} bộ sách
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-500 hidden sm:block">
                Sắp xếp:
              </span>
              <select
                value={searchParams.get("sortBy") || "newest"}
                onChange={handleSortChange}
                className="bg-sv-pale border border-sv-tan text-sv-brown font-bold rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sv-brown/50 cursor-pointer"
              >
                <option value="newest">Mới cập nhật</option>
                <option value="oldest">Cũ nhất</option>
                <option value="a-z">Tên A-Z</option>
                <option value="z-a">Tên Z-A</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-sv-tan shadow-sm">
              <Loader2 className="animate-spin text-sv-brown mb-4" size={48} />
              <p className="text-sv-brown font-bold">Đang lục tìm...</p>
            </div>
          ) : series.length > 0 ? (
            <>
              {/* 👉 ĐÃ SỬA: Lưới 4 sản phẩm, gap-3, dùng thẻ dạng chữ nhật đứng (aspect-[3/4]) giống SearchPage */}
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                {series.map((item) => {
                  const firstVolume = item.volumes?.[0];
                  return (
                    <Link
                      key={item.id}
                      to={`/series/${item.slug}`}
                      className="bg-white rounded-2xl border border-sv-tan overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col h-full"
                    >
                      <div className="relative aspect-[3/4] w-full bg-sv-pale overflow-hidden flex items-center justify-center p-4 border-b border-sv-tan/30">
                        <img
                          src={
                            item.coverImage ||
                            "https://via.placeholder.com/300x450"
                          }
                          alt={item.title}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-md"
                        />
                      </div>
                      
                      <div className="p-3 sm:p-4 flex flex-col flex-1 bg-white">
                        <h3 className="font-black text-sv-brown text-sm sm:text-base line-clamp-2 mb-1 group-hover:opacity-80 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-xs font-bold text-gray-500 mb-3 line-clamp-1">
                          {item.author || "Đang cập nhật"}
                        </p>
                        
                        <div className="mt-auto">
                          <p className="text-[10px] font-bold text-gray-400 mb-0.5">
                            Giá chỉ từ:
                          </p>
                          <p className="text-lg sm:text-xl font-black text-sv-brown">
                            {firstVolume
                              ? `${new Intl.NumberFormat("vi-VN").format(firstVolume.price)}đ`
                              : "Đang cập nhật"}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* THANH PHÂN TRANG */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl border border-sv-tan bg-white text-sv-brown hover:bg-sv-wheat disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 rounded-xl font-black text-sm border transition-colors shadow-sm ${
                          currentPage === pageNum
                            ? "bg-sv-brown text-white border-sv-brown"
                            : "bg-white text-sv-brown border-sv-tan hover:bg-sv-wheat"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-xl border border-sv-tan bg-white text-sv-brown hover:bg-sv-wheat disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white p-12 text-center rounded-3xl border border-sv-tan shadow-sm">
              <div className="w-16 h-16 bg-sv-pale rounded-full flex items-center justify-center mx-auto mb-4 text-sv-brown border border-sv-tan">
                <BookOpen size={32} />
              </div>
              <h3 className="text-xl font-black text-sv-brown mb-2">
                Không tìm thấy kết quả phù hợp!
              </h3>
              <p className="text-gray-500 font-medium">
                Hãy thử thay đổi khoảng giá hoặc bỏ bớt thể loại xem sao.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;