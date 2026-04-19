import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useAuthStore();

  // 1. NẾU CHƯA ĐĂNG NHẬP -> Đá về trang Login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. NẾU CÓ YÊU CẦU QUYỀN (Ví dụ: ADMIN) MÀ USER KHÔNG ĐỦ QUYỀN -> Đá về Trang chủ
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // 3. RENDER NỘI DUNG NẾU QUA ĐƯỢC BẢO VỆ
  // - Hỗ trợ cả cách bọc cũ: <ProtectedRoute><Page /></ProtectedRoute> (children)
  // - Hỗ trợ cả cách bọc mới: <Route element={<ProtectedRoute />}> (Outlet)
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
