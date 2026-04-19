import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set, get) => ({
      // Mảng chứa các sản phẩm
      cart: [],

      // Hàm xử lý Thêm vào giỏ
      addToCart: (product) =>
        set((state) => {
          const existingItem = state.cart.find(
            (item) => item.id === product.id,
          );

          // Bắt lấy số lượng khách chọn truyền vào (mặc định là 1 nếu không có)
          const qtyToAdd = product.quantity || 1;

          if (existingItem) {
            // Nếu đã có trong giỏ -> Cộng dồn số lượng hiện có VỚI số lượng khách vừa chọn
            // Đồng thời chặn không cho vượt quá hàng tồn kho (stock)
            return {
              cart: state.cart.map((item) => {
                if (item.id === product.id) {
                  const newQuantity = item.quantity + qtyToAdd;
                  return {
                    ...item,
                    quantity:
                      newQuantity > item.stock ? item.stock : newQuantity, // Chặn max stock
                  };
                }
                return item;
              }),
            };
          }

          // Nếu chưa có trong giỏ -> Thêm mới với đúng số lượng khách chọn
          return { cart: [...state.cart, { ...product, quantity: qtyToAdd }] };
        }),

      // Các hàm phụ trợ (Dành cho trang Giỏ hàng sau này)
      removeFromCart: (volumeId) => {
        set({ cart: get().cart.filter((item) => item.id !== volumeId) });
      },

      removeMultipleFromCart: (volumeIds) => {
        set({
          cart: get().cart.filter((item) => !volumeIds.includes(item.id)),
        });
      },

      removeSelectedItems: (selectedIds) => {
        set({
          cart: get().cart.filter((item) => !selectedIds.includes(item.id)),
        });
      },

      updateQuantity: (volumeId, quantity) => {
        set({
          cart: get().cart.map((item) =>
            item.id === volumeId ? { ...item, quantity: quantity } : item,
          ),
        });
      },

      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "storyvault-cart", // Tên key lưu trong trình duyệt
    },
  ),
);

export default useCartStore;
