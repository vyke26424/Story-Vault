import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set, get) => ({
      // Mảng chứa các sản phẩm
      cart: [],

      // Hàm xử lý Thêm vào giỏ
      addToCart: (volume) => {
        const currentCart = get().cart;
        // Kiểm tra xem tập truyện này đã có trong giỏ chưa
        const existingItem = currentCart.find((item) => item.id === volume.id);

        if (existingItem) {
          // Nếu có rồi, kiểm tra xem số lượng mua có vượt quá hàng trong kho không
          if (existingItem.quantity >= volume.stock) {
            return {
              success: false,
              message: "Số lượng mua đã đạt giới hạn kho!",
            };
          }

          // Tăng số lượng lên 1
          set({
            cart: currentCart.map((item) =>
              item.id === volume.id
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            ),
          });
          return { success: true, message: "Đã tăng số lượng trong giỏ!" };
        } else {
          // Nếu chưa có, thêm mới với số lượng (quantity) = 1
          set({ cart: [...currentCart, { ...volume, quantity: 1 }] });
          return { success: true, message: "Đã thêm truyện vào giỏ hàng!" };
        }
      },

      // Các hàm phụ trợ (Dành cho trang Giỏ hàng sau này)
      removeFromCart: (volumeId) => {
        set({ cart: get().cart.filter((item) => item.id !== volumeId) });
      },

      removeMultipleFromCart: (volumeIds) => {
        set({ cart: get().cart.filter((item) => !volumeIds.includes(item.id)) });
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
