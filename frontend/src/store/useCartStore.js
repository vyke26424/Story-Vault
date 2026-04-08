// file: src/store/useCartStore.js
import { create } from 'zustand';

const useCartStore = create((set, get) => ({
  cart: [],
  
  // 1. Thêm vào giỏ
  addToCart: (product, quantity, volume) => set((state) => {
    const existingItemIndex = state.cart.findIndex(
      (item) => item.id === product.id && item.volume === volume
    );

    if (existingItemIndex >= 0) {
      const newCart = [...state.cart];
      newCart[existingItemIndex].quantity += quantity;
      return { cart: newCart };
    }
    return { cart: [...state.cart, { ...product, quantity, volume }] };
  }),

  // 2. Xóa khỏi giỏ
  removeFromCart: (productId, volume) => set((state) => ({
    cart: state.cart.filter(item => !(item.id === productId && item.volume === volume))
  })),

  // 3. Cập nhật số lượng
  updateQuantity: (productId, volume, newQuantity) => set((state) => ({
    cart: state.cart.map(item => 
      (item.id === productId && item.volume === volume) 
        ? { ...item, quantity: Math.max(1, newQuantity) } 
        : item
    )
  })),

  // 4. Tính tổng số sản phẩm
  getTotalItems: () => {
    return get().cart.reduce((total, item) => total + item.quantity, 0);
  },

  // 5. Tính tổng tiền (Subtotal)
  getCartTotal: () => {
    return get().cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  },

  // 6. Dọn sạch giỏ hàng (Dùng khi thanh toán thành công hoặc đăng xuất)
  clearCart: () => set({ cart: [] })
}));

export default useCartStore;