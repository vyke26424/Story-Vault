import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation(); // Lấy đường dẫn hiện tại mà khách đang cố vào

  // Nếu chưa đăng nhập -> Đá về trang /login
  // Kèm theo cái "vé" ghi nhớ đường dẫn cũ (state: { from: location })
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Đã đăng nhập -> Mời vào trong
  return children;
};

export default ProtectedRoute;