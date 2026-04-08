import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import LoginPage from './pages/LoginPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import SuccessPage from './pages/SuccessPage';
import SearchPage from './pages/SearchPage';

import AdminLayout from './pages/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Đường dẫn trang chủ */}
        <Route path="/" element={<Home />} />
        <Route path="/category" element={<CategoryPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cart" element={<CheckoutPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/search" element={<SearchPage />} />

        {/* --- LUỒNG QUẢN TRỊ VIÊN (ADMIN) --- */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* Index route: khi vào /admin nó sẽ mặc định load DashboardPage */}
          <Route index element={<DashboardPage />} />
          
          {/* Sau này bạn có thể tạo thêm trang và gắn vào đây: */}
          {/* <Route path="products" element={<AdminProductsPage />} /> */}
          {/* <Route path="orders" element={<AdminOrdersPage />} /> */}
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;