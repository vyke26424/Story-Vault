import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import NotFoundPage from "../pages/NotFoundPage";

import Header from "./Header";
import Footer from "./Footer";
import FloatingFeedback from "./FloatingFeedback";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useAuthStore();

  // 1. NẾU CHƯA ĐĂNG NHẬP -> Đá về trang Login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. NẾU KHÔNG ĐỦ QUYỀN (Ví dụ: Khách vào Admin) -> Trả về 404 có kèm ĐẦY ĐỦ Header & Footer
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 bg-sv-cream">
          <NotFoundPage />
          <FloatingFeedback />
        </main>
        <Footer />
      </div>
    );
  }

  // 3. RENDER NỘI DUNG NẾU QUA ĐƯỢC BẢO VỆ
  return children ? children : <Outlet />;
};

export default ProtectedRoute;