import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Filter,
  SlidersHorizontal,
  ShoppingCart,
  Loader2,
  Star,
  Search,
  CircleDollarSign,
} from "lucide-react";
import axiosClient from "../utils/axiosClient";
import useCartStore from "../store/useCartStore";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "";
  const initialMin = searchParams.get("min") || "";
  const initialMax = searchParams.get("max") || "";

  // Dữ liệu & Trạng thái
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // Bộ lọc
  const [sortBy, setSortBy] = useState("newest");
  const [selectedType, setSelectedType] = useState(initialCategory);

  // 👉 State cho Khoảng giá
  const [priceRange, setPriceRange] = useState({
    min: initialMin,
    max: initialMax,
  });

  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    fetchSearchResults();
  }, [searchParams, sortBy, selectedType]);

  const fetchSearchResults = async () => {
    try {
      setLoading(true);
      const query = searchParams.get("q") || "";
      const min = searchParams.get("min") || "";
      const max = searchParams.get("max") || "";

      let endpoint = `/search?q=${encodeURIComponent(query)}&sort=${sortBy}`;
      if (selectedType) endpoint += `&type=${selectedType}`;
      if (min) endpoint += `&minPrice=${min}`;
      if (max) endpoint += `&maxPrice=${max}`;

      const res = await axiosClient.get(endpoint);
      setResults(res.data?.data || res.data || []);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý lọc theo loại
  const handleTypeChange = (type) => {
    const newType = type === selectedType ? "" : type;
    setSelectedType(newType);
    setSearchParams({ ...Object.fromEntries(searchParams), category: newType });
  };

  // 👉 Xử lý áp dụng giá
  const handleApplyPrice = () => {
    const newParams = Object.fromEntries(searchParams);
    if (priceRange.min) newParams.min = priceRange.min;
    else delete newParams.min;

    if (priceRange.max) newParams.max = priceRange.max;
    else delete newParams.max;

    setSearchParams(newParams);
  };

  const handleAddToCart = (e, volume) => {
    e.preventDefault();
    if (addToCart) {
      addToCart({ ...volume, quantity: 1 });
      alert(`Đã thêm vào giỏ hàng!`);
    }
  };

  return (
    <div className="min-h-screen bg-sv-cream py-8 font-nunito">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 bg-white p-6 rounded-3xl border border-sv-tan shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-sv-brown">
              {initialQuery
                ? `Kết quả cho: "${initialQuery}"`
                : "Tàng kinh các"}
            </h1>
            <p className="text-gray-500 font-medium">
              Tìm thấy {results.length} cuốn sách
            </p>
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal size={20} className="text-sv-tan" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-sv-pale border border-sv-tan text-sv-brown font-bold rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sv-brown/50"
            >
              <option value="newest">Mới cập nhật</option>
              <option value="price_asc">Giá: Thấp đến Cao</option>
              <option value="price_desc">Giá: Cao đến Thấp</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* CỘT TRÁI: BỘ LỌC */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="bg-white rounded-3xl border border-sv-tan p-6 shadow-sm sticky top-24 space-y-8">
              {/* Thể loại */}
              <div>
                <h3 className="text-lg font-black text-sv-brown flex items-center gap-2 mb-4 border-b border-sv-pale pb-3">
                  <Filter size={18} /> Thể loại
                </h3>
                <div className="space-y-2">
                  {["MANGA", "LIGHT_NOVEL", "COMIC", "NOVEL"].map((type) => (
                    <label
                      key={type}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedType === type}
                        onChange={() => handleTypeChange(type)}
                        className="w-5 h-5 text-sv-brown rounded border-sv-tan focus:ring-sv-brown"
                      />
                      <span
                        className={`font-bold transition-colors ${selectedType === type ? "text-sv-brown" : "text-gray-500"}`}
                      >
                        {type.replace("_", " ")}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 👉 KHOẢNG GIÁ (Range Filter) */}
              <div>
                <h3 className="text-lg font-black text-sv-brown flex items-center gap-2 mb-4 border-b border-sv-pale pb-3">
                  <CircleDollarSign size={18} /> Khoảng giá
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) =>
                        setPriceRange({ ...priceRange, min: e.target.value })
                      }
                      className="w-full bg-sv-pale border border-sv-tan rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-sv-brown"
                    />
                    <span className="text-sv-tan">—</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) =>
                        setPriceRange({ ...priceRange, max: e.target.value })
                      }
                      className="w-full bg-sv-pale border border-sv-tan rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-sv-brown"
                    />
                  </div>
                  <button
                    onClick={handleApplyPrice}
                    className="w-full bg-sv-brown text-white font-black py-2.5 rounded-xl hover:bg-opacity-90 transition-all shadow-md active:scale-95"
                  >
                    Áp dụng giá
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: KẾT QUẢ */}
          <div className="flex-1">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2
                  className="animate-spin text-sv-brown mb-4"
                  size={48}
                />
                <p className="text-sv-brown font-bold">Đang lục tìm...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {results.map((item) => (
                  <Link
                    key={item.id}
                    to={`/volume/${item.id}`}
                    className="bg-white rounded-2xl border border-sv-tan overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col"
                  >
                    <div className="relative aspect-[2/3] overflow-hidden bg-sv-pale">
                      <img
                        src={item.coverImage}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-black text-sv-brown text-base line-clamp-2 mb-2">
                        {item.series?.title} - Tập {item.volumeNumber}
                      </h3>
                      <div className="mt-auto flex items-center justify-between">
                        <p className="font-black text-lg text-sv-brown">
                          {new Intl.NumberFormat("vi-VN").format(item.price)}đ
                        </p>
                        <button
                          onClick={(e) => handleAddToCart(e, item)}
                          className="w-10 h-10 rounded-full bg-sv-wheat text-sv-brown flex items-center justify-center hover:bg-sv-brown hover:text-white transition-colors"
                        >
                          <ShoppingCart size={18} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-sv-tan p-12 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-sv-pale rounded-full flex items-center justify-center mb-4 text-sv-tan">
                  <Search size={40} />
                </div>
                <h3 className="text-xl font-black text-sv-brown">
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
