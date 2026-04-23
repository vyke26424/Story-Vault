import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useCartStore from "../store/useCartStore";
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from "lucide-react";

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, removeMultipleFromCart, updateQuantity } =
    useCartStore();
  const [selectedIds, setSelectedIds] = useState([]);

  const handleSelectAll = () => {
    selectedIds.length === cart.length
      ? setSelectedIds([])
      : setSelectedIds(cart.map((item) => item.id));
  };
  const handleSelectOne = (id) => {
    selectedIds.includes(id)
      ? setSelectedIds(selectedIds.filter((itemId) => itemId !== id))
      : setSelectedIds([...selectedIds, id]);
  };
  const handleDeleteSelected = () => {
    if (
      window.confirm("Bạn có chắc chắn muốn xóa các mục đã chọn khỏi giỏ hàng?")
    ) {
      removeMultipleFromCart(selectedIds);
      setSelectedIds([]);
    }
  };

  const selectedItems = cart.filter((item) => selectedIds.includes(item.id));
  const totalPrice = selectedItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const handleIncrease = (item) => {
    item.quantity < item.stock
      ? updateQuantity(item.id, item.quantity + 1)
      : alert("Đã đạt giới hạn số lượng trong kho!");
  };
  const handleDecrease = (item) => {
    if (item.quantity > 1) updateQuantity(item.id, item.quantity - 1);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="w-32 h-32 bg-sv-wheat text-sv-brown rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={64} />
        </div>
        <h2 className="text-2xl font-black text-sv-brown mb-2">
          Giỏ hàng của bạn đang trống
        </h2>
        <p className="text-gray-500 font-medium mb-8 text-center max-w-md">
          Chưa có cuốn truyện nào được thêm vào giỏ. Hãy quay lại trang chủ và
          khám phá thêm nhé!
        </p>
        <Link
          to="/"
          className="bg-sv-brown text-white font-bold px-8 py-3.5 rounded-xl hover:bg-opacity-90 hover:shadow-lg transition-all"
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-sv-brown font-bold mb-6 transition-colors"
      >
        <ArrowLeft size={20} /> Tiếp tục mua sắm
      </Link>
      <h1 className="text-3xl font-black text-sv-brown mb-8">
        Giỏ hàng của bạn
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="bg-white border border-sv-tan rounded-3xl p-4 sm:p-6 shadow-sm">
            <div className="flex justify-between items-center border-b border-sv-tan pb-4 mb-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-5 h-5 accent-sv-brown rounded border-gray-300 cursor-pointer"
                  checked={
                    cart.length > 0 && selectedIds.length === cart.length
                  }
                  onChange={handleSelectAll}
                />
                <span className="font-bold text-gray-600 group-hover:text-sv-brown transition-colors">
                  Chọn tất cả ({cart.length} sản phẩm)
                </span>
              </label>
              {selectedIds.length > 0 && (
                <button
                  onClick={handleDeleteSelected}
                  className="text-sm font-bold text-red-500 hover:text-red-700 flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 size={16} /> Xóa ({selectedIds.length}) mục
                </button>
              )}
            </div>

            <div className="space-y-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 sm:gap-5 pb-6 border-b border-sv-tan last:border-0 last:pb-0"
                >
                  <div className="pt-8">
                    <input
                      type="checkbox"
                      className="w-5 h-5 accent-sv-brown rounded border-gray-300 cursor-pointer"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => handleSelectOne(item.id)}
                    />
                  </div>
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-20 h-28 sm:w-24 sm:h-36 object-cover rounded-xl border border-sv-tan shrink-0"
                  />
                  <div className="flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <Link
                          to={`/series/${item.series?.slug || item.slug || ""}`}
                          className="font-black text-sv-brown text-lg line-clamp-2 hover:opacity-80 transition-colors"
                          title={
                            item.title ||
                            `${item.series?.title} - Tập ${item.volumeNumber}`
                          }
                        >
                          {item.title ||
                            `${item.series?.title} - Tập ${item.volumeNumber}`}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                          title="Xóa sản phẩm này"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 font-medium">
                        Kho: {item.stock}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-end justify-between gap-4 mt-4">
                      <div className="flex flex-col">
                        {item.originalPrice &&
                          item.originalPrice > item.price && (
                            <span className="text-sm font-bold text-sv-brown line-through opacity-70 mb-0.5">
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(item.originalPrice)}
                            </span>
                          )}
                        <span
                          className={`font-black text-xl ${item.originalPrice && item.originalPrice > item.price ? "text-red-600" : "text-sv-brown"}`}
                        >
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(item.price)}
                        </span>
                      </div>
                      <div className="flex items-center bg-sv-pale rounded-xl border border-sv-tan overflow-hidden">
                        <button
                          onClick={() => handleDecrease(item)}
                          className="p-2 sm:p-2.5 text-sv-brown hover:bg-sv-wheat transition-colors disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 sm:w-10 text-center font-bold text-sv-brown">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleIncrease(item)}
                          className="p-2 sm:p-2.5 text-sv-brown hover:bg-sv-wheat transition-colors disabled:opacity-50"
                          disabled={item.quantity >= item.stock}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-white border-2 border-sv-tan rounded-3xl p-6 sm:p-8 sticky top-24 shadow-lg">
            <h2 className="text-xl font-black text-sv-brown mb-6 border-b border-sv-tan pb-4">
              Tóm tắt đơn hàng
            </h2>
            <div className="space-y-4 font-medium mb-6 text-gray-600">
              <div className="flex justify-between">
                <span>Đã chọn ({selectedIds.length} sp)</span>
                <span className="font-bold text-sv-brown">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(totalPrice)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển</span>
                <span className="text-gray-400 italic">Chưa tính</span>
              </div>
            </div>
            <div className="flex justify-between items-center border-t border-sv-tan pt-6 mb-8">
              <span className="text-lg font-bold text-sv-brown">Tổng cộng</span>
              <span className="text-2xl font-black text-sv-brown">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(totalPrice)}
              </span>
            </div>
            <button
              onClick={() => navigate("/checkout", { state: { selectedIds } })}
              disabled={selectedIds.length === 0}
              className={`w-full font-black py-4 rounded-xl transition-all shadow-md ${selectedIds.length === 0 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-sv-brown text-white hover:bg-opacity-90 hover:shadow-lg hover:-translate-y-0.5"}`}
            >
              Tiến hành Thanh toán
            </button>{" "}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
