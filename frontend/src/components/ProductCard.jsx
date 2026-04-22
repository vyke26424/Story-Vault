import React from "react";

const ProductCard = ({ product }) => {
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="group flex flex-col bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-amber-100 cursor-pointer">
      {/* Container Hình ảnh */}
      <div className="relative aspect-[3/4] overflow-hidden bg-amber-50">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        {product.isHot && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
            HOT
          </span>
        )}
        {isOutOfStock && (
          <span className="absolute top-3 right-3 bg-gray-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm z-10">
            HẾT HÀNG
          </span>
        )}
      </div>

      {/* Thông tin sản phẩm */}
      <div className="p-4 flex flex-col flex-grow">
        <h3
          className="text-lg font-bold text-stone-800 line-clamp-1"
          title={product.title}
        >
          {product.title}
        </h3>
        <p className="text-sm text-stone-500 mb-3">{product.author}</p>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-xl font-bold text-amber-700">
            ${product.price?.toFixed(2)}
          </span>
          <button
            disabled={isOutOfStock}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${isOutOfStock ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-amber-100 text-amber-900 hover:bg-amber-200"}`}
          >
            {isOutOfStock ? "Hết" : "Thêm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
