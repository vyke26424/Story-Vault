import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Filter,
  SlidersHorizontal,
  ShoppingCart,
  Loader2,
  Search,
  CircleDollarSign,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import axiosClient from "../utils/axiosClient";
import useCartStore from "../store/useCartStore";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const TYPE_LABELS = {
  MANGA: "Manga",
  LIGHT_NOVEL: "Light Novel",
  NOVEL: "Tiểu thuyết",
  COMIC: "Comic",
  BOOK: "Sách Nổi Tiếng",
};

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const initialType =
    searchParams.get("type") || searchParams.get("category") || "";
  const initialMin = parseInt(searchParams.get("min")) || 0;
  const initialMax = parseInt(searchParams.get("max")) || 500000;

  const currentPage = parseInt(searchParams.get("page")) || 1;

  // Dữ liệu & Trạng thái
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // Thanh phân trang
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Bộ lọc
  const [sortBy, setSortBy] = useState("newest");
  const [selectedType, setSelectedType] = useState(initialType);

  // State cho Khoảng giá (Gồm Thanh trượt và Ô nhập)
  const [priceRange, setPriceRange] = useState([initialMin, initialMax]);
  const [minInput, setMinInput] = useState(initialMin.toString());
  const [maxInput, setMaxInput] = useState(initialMax.toString());

  const addToCart = useCartStore((state) => state.addToCart);

  // 1. Đồng bộ số ở ô nhập khi kéo thanh trượt
  useEffect(() => {
    setMinInput(priceRange[0].toString());
    setMaxInput(priceRange[1].toString());
  }, [priceRange]);

  // 2. Fetch API mỗi khi có thay đổi URL
  useEffect(() => {
    fetchSearchResults();
  }, [searchParams, sortBy, selectedType, currentPage]);

  const fetchSearchResults = async () => {
    try {
      setLoading(true);
      const query = searchParams.get("q") || "";
      const min = searchParams.get("min") || "";
      const max = searchParams.get("max") || "";

      // Thêm flag includeOutOfStock để báo backend trả về cả sản phẩm hết hàng
      let endpoint = `/search?q=${encodeURIComponent(query)}&sort=${sortBy}&page=${currentPage}&limit=12&includeOutOfStock=true`;
      if (selectedType) endpoint += `&type=${selectedType}`;
      if (min) endpoint += `&minPrice=${min}`;
      if (max) endpoint += `&maxPrice=${max}`;

      const res = await axiosClient.get(endpoint);

      const payload = res.data;

      if (payload && payload.meta) {
        setResults(payload.data || []);
        setTotalPages(payload.meta.totalPages || 1);
        setTotalItems(payload.meta.totalItems || 0);
      } else if (Array.isArray(payload)) {
        setResults(payload);
        setTotalItems(payload.length);
        // Fallback tự tính số trang nếu Backend chưa cập nhật meta cho API search
        setTotalPages(Math.ceil(payload.length / 12));
      } else {
        setResults([]);
        setTotalItems(0);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý Cập nhật URL và TỰ ĐỘNG RESET TRANG 1
  const updateURLParams = (updates) => {
    const newParams = Object.fromEntries(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) newParams[key] = value;
      else delete newParams[key];
    });
    delete newParams.category;

    if (!("page" in updates)) {
      newParams.page = 1;
    }

    setSearchParams(newParams);
  };

  const handleTypeChange = (type) => {
    const newType = type === selectedType ? "" : type;
    setSelectedType(newType);
    updateURLParams({ type: newType });
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

    updateURLParams({
      min: min > 0 ? min : null,
      max: max < 500000 ? max : null,
    });
  };

  const handleSliderDrop = (val) => {
    updateURLParams({
      min: val[0] > 0 ? val[0] : null,
      max: val[1] < 500000 ? val[1] : null,
    });
  };

  const handleAddToCart = (e, volume) => {
    e.preventDefault();
    e.stopPropagation();
    if (volume.stock <= 0) return;
    if (addToCart) {
      addToCart({ ...volume, quantity: 1 });
      alert(`Đã thêm vào giỏ hàng!`);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      updateURLParams({ page: newPage });
      // Cuộn lên đầu trang nhẹ nhàng
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-sv-cream py-8 font-nunito">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Kết quả */}
        <div className="mb-3 bg-white p-6 rounded-3xl border border-sv-tan shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-sv-brown">
              {initialQuery
                ? `Kết quả cho: "${initialQuery}"`
                : "Tàng kinh các"}
            </h1>
            <p className="text-gray-500 font-medium">
              Tìm thấy {totalItems} cuốn sách{" "}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal size={20} className="text-sv-tan" />
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                updateURLParams({}); // Kích hoạt updateURLParams để reset về trang 1
              }}
              className="bg-sv-pale border border-sv-tan text-sv-brown font-bold rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sv-brown/50 cursor-pointer"
            >
              <option value="newest">Mới cập nhật</option>
              <option value="price_asc">Giá: Thấp đến Cao</option>
              <option value="price_desc">Giá: Cao đến Thấp</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-3">
          
          {/* CỘT TRÁI: BỘ LỌC */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="bg-white rounded-3xl border border-sv-tan p-6 shadow-sm sticky top-24 space-y-8">
              {/* Thể loại */}
              <div>
                <h3 className="text-lg font-black text-sv-brown flex items-center gap-2 mb-4 border-b border-sv-pale pb-3">
                  <Filter size={18} /> Phân Loại
                </h3>
                <div className="space-y-3">
                  {Object.keys(TYPE_LABELS).map((type) => (
                    <label
                      key={type}
                      onClick={(e) => {
                        e.preventDefault();
                        handleTypeChange(type);
                      }}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <div
                        className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedType === type ? "bg-sv-brown border-sv-brown" : "bg-sv-pale border-sv-tan group-hover:border-sv-brown"}`}
                      >
                        {selectedType === type && (
                          <span className="text-white font-bold text-xs">
                            ✓
                          </span>
                        )}
                      </div>
                      <span
                        className={`font-bold transition-colors ${selectedType === type ? "text-sv-brown" : "text-gray-500 group-hover:text-sv-brown"}`}
                      >
                        {TYPE_LABELS[type]}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Khoảng giá */}
              <div>
                <h3 className="text-lg font-black text-sv-brown flex items-center gap-2 mb-6 border-b border-sv-pale pb-3">
                  <CircleDollarSign size={18} /> Khoảng Giá
                </h3>

                <div className="px-2 mb-6">
                  <Slider
                    range
                    min={0}
                    max={500000}
                    step={10000}
                    value={priceRange}
                    onChange={(val) => setPriceRange(val)}
                    onAfterChange={handleSliderDrop}
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

                <div className="flex items-center justify-between text-sm font-black text-sv-brown gap-2">
                  <input
                    type="number"
                    value={minInput}
                    onChange={(e) => setMinInput(e.target.value)}
                    onBlur={handleApplyPrice}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyPrice()}
                    className="w-full bg-sv-pale px-2 py-2 rounded-lg border border-sv-tan focus:outline-none focus:ring-2 focus:ring-sv-brown text-center hide-arrows"
                    placeholder="Tối thiểu"
                  />
                  <span className="text-sv-tan font-bold">-</span>
                  <input
                    type="number"
                    value={maxInput}
                    onChange={(e) => setMaxInput(e.target.value)}
                    onBlur={handleApplyPrice}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyPrice()}
                    className="w-full bg-sv-pale px-2 py-2 rounded-lg border border-sv-tan focus:outline-none focus:ring-2 focus:ring-sv-brown text-center hide-arrows"
                    placeholder="Tối đa"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: KẾT QUẢ VÀ PHÂN TRANG */}
          <div className="flex-1 w-full overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-sv-tan shadow-sm">
                <Loader2
                  className="animate-spin text-sv-brown mb-4"
                  size={48}
                />
                <p className="text-sv-brown font-bold">Đang lục tìm...</p>
              </div>
            ) : results.length > 0 ? (
              <>
                {/* ĐÃ SỬA: grid-cols-2 md:grid-cols-3 xl:grid-cols-4 để hiển thị 4 sản phẩm 1 hàng trên màn hình lớn */}
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                  {results.map((item) => {
                    const isOutOfStock = item.stock <= 0;
                    return (
                      <Link
                        key={item.id}
                        to={`/series/${item.series?.slug || item.slug}`}
                        className="bg-white rounded-2xl border border-sv-tan overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col h-full"
                      >
                        {/* ĐÃ SỬA: Thay thế h-2/3 bằng aspect-[3/4] để khung ảnh luôn đứng và đều nhau */}
                        <div className="relative aspect-[3/4] w-full bg-sv-pale overflow-hidden flex items-center justify-center p-4 border-b border-sv-tan/30">
                          <img
                            src={
                              item.coverImage ||
                              "https://via.placeholder.com/300x450"
                            }
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-md"
                            alt={item.title}
                          />
                          {isOutOfStock && (
                            <div className="absolute top-2 left-2 bg-gray-500 text-white text-[10px] font-black px-2 py-1 rounded shadow-sm z-10">
                              HẾT HÀNG
                            </div>
                          )}
                        </div>

                        {/* ĐÃ SỬA: Để flex-1 để phần text tự động chiếm không gian, không bị đè nén */}
                        <div className="p-3 sm:p-4 flex flex-col flex-1 bg-white">
                          <h3
                            className="font-black text-sv-brown text-sm line-clamp-2 mb-3 group-hover:opacity-80 transition-opacity"
                            title={
                              item.title ||
                              `${item.series?.title} - Tập ${item.volumeNumber}`
                            }
                          >
                            {item.title ||
                              `${item.series?.title} - Tập ${item.volumeNumber}`}
                          </h3>
                          
                          <div className="mt-auto flex items-end justify-between">
                            <div className="flex flex-col">
                              {item.originalPrice &&
                                item.originalPrice > item.price && (
                                  <p className="text-[10px] font-bold text-sv-brown line-through opacity-70 mb-0.5">
                                    {new Intl.NumberFormat("vi-VN").format(
                                      item.originalPrice,
                                    )}
                                    đ
                                  </p>
                                )}
                              <p
                                className={`font-black text-sm sm:text-base ${item.originalPrice && item.originalPrice > item.price ? "text-red-600" : "text-sv-brown"}`}
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
                              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors shrink-0 ${isOutOfStock ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-sv-wheat text-sv-brown hover:bg-sv-brown hover:text-white"}`}
                              title={
                                isOutOfStock ? "Hết hàng" : "Thêm vào giỏ hàng"
                              }
                            >
                              <ShoppingCart size={14} strokeWidth={2.5} />
                            </button>
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
              <div className="bg-white rounded-3xl border border-sv-tan p-12 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-sv-pale rounded-full flex items-center justify-center mb-4 text-sv-tan border border-sv-tan">
                  <Search size={40} />
                </div>
                <h3 className="text-xl font-black text-sv-brown mb-2">
                  Trống trơn!
                </h3>
                <p className="text-gray-500 font-medium">
                  Không tìm thấy bí kíp nào khớp với yêu cầu của sếp.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;