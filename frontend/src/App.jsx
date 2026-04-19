import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

// Import Layout & Component dùng chung
import Header from "./components/Header";
import Footer from "./components/Footer";
import TokenExpiryPopup from "./components/TokenExpiryPopup";
import ProtectedRoute from "./components/ProtectedRoute";

// Import Pages (Khách hàng)
import HomePage from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import SeriesDetailPage from "./pages/SeriesDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import InvoicePage from "./pages/InvoicePage";
import ProfilePage from "./pages/ProfilePage";
import SearchPage from "./pages/SearchPage";

// Import Admin
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProductListPage from "./pages/admin/ProductListPage";
import ProductFormPage from "./pages/admin/ProductFormPage";
import SeriesListPage from "./pages/admin/SeriesListPage";
import SeriesFormPage from "./pages/admin/SeriesFormPage";
import CategoryListPage from "./pages/admin/CategoryListPage";
import CategoryFormPage from "./pages/admin/CategoryFormPage";
import AdminOrdersPage from "./pages/admin/OrderListPage";
import StockListPage from "./pages/admin/StockListPage";
import UserListPage from "./pages/admin/UserListPage";
import ReviewListPage from "./pages/admin/ReviewListPage";




// ==========================================
// LAYOUT DÀNH CHO KHÁCH HÀNG
// (Tự động gắn Header ở trên và Footer ở dưới)
// ==========================================
const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-sv-cream">
        {/* Nơi hiển thị ruột của các trang con (Home, Cart, Profile...) */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      {/* Đặt Popup ở đây để nó làm "Bảo vệ toàn cục", 
        dù khách đang ở trang chủ hay sếp đang ở trang Admin thì nó vẫn canh me token! 
      */}
      <TokenExpiryPopup />

      <Routes>
        {/* ========================================== */}
        {/* NHÓM 1: CÁC TRANG CỦA KHÁCH HÀNG (Có Header/Footer) */}
        {/* ========================================== */}
        <Route element={<PublicLayout />}>
          {/* Các trang ai cũng vào được */}
          <Route path="/" element={<HomePage />} />
          <Route path="/series/:slug" element={<SeriesDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/search" element={<SearchPage />} />

          {/* Các trang BẮT BUỘC ĐĂNG NHẬP (Chỉ dành cho Customer) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/orders" element={<OrderHistoryPage />} />
            <Route path="/order/invoice/:id" element={<InvoicePage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route
              path="/order-success/:orderId"
              element={<OrderSuccessPage />}
            />
          </Route>
        </Route>

        {/* ========================================== */}
        {/* NHÓM 2: TRANG AUTH (Không Header, Không Footer) */}
        {/* ========================================== */}
        <Route path="/login" element={<LoginPage />} />
        {/* Nếu có trang Register thì sếp vứt luôn vào đây: <Route path="/register" element={<RegisterPage />} /> */}

        {/* ========================================== */}
        {/* NHÓM 3: TRANG QUẢN TRỊ ADMIN (Layout hoàn toàn riêng biệt) */}
        {/* ========================================== */}
        {/* Bảo vệ route này: Chỉ cho phép người có role = "ADMIN" vào */}
        <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
          <Route path="/admin" element={<AdminLayout />}>
            {/* Trang mặc định khi gõ /admin */}
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<ProductListPage />} />
            <Route path="products/create" element={<ProductFormPage />} />
            <Route path="products/edit/:id" element={<ProductFormPage />} />
            <Route path="series" element={<SeriesListPage />} />
            <Route path="series/create" element={<SeriesFormPage />} />
            <Route path="series/edit/:id" element={<SeriesFormPage />} />
            <Route path="categories" element={<CategoryListPage />} />
            <Route path="categories/create" element={<CategoryFormPage />} />
            <Route path="categories/edit/:id" element={<CategoryFormPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="stocks" element={<StockListPage />} />
            <Route path="users" element={<UserListPage />} />
            <Route path="reviews" element={<ReviewListPage />} />
            

          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
