import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import { AlertTriangle, Clock, LogOut, RefreshCw } from "lucide-react";
import axiosClient from "../utils/axiosClient";

// Hàm giải mã JWT Token (Không cần cài thêm thư viện)
const parseJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Lỗi khi giải mã JWT:", error);
    return null;
  }
};

const TokenExpiryPopup = () => {
  const { user, accessToken, logout, setAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [showPopup, setShowPopup] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [isRenewing, setIsRenewing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // 1. NGƯỜI CANH GÁC THỜI GIAN TOKEN
  useEffect(() => {
    if (!accessToken) {
      setShowPopup(false);
      return;
    }

    const decoded = parseJwt(accessToken);
    if (!decoded || !decoded.exp) return;

    // Tính thời gian còn sống của Token (bằng mili-giây)
    const timeRemaining = decoded.exp * 1000 - Date.now();

    // Đặt báo thức kêu trước 30 giây khi token chết
    const triggerTime = timeRemaining - 30000;
    let timeoutId;

    if (triggerTime <= 0) {
      // Nếu load lại trang mà token còn dưới 30s -> Hiện luôn
      if (timeRemaining > 0) {
        setShowPopup(true);
        setCountdown(Math.floor(timeRemaining / 1000));
      } else {
        // Chết ngắc rồi thì out luôn
        handleForceLogout();
      }
    } else {
      // Hẹn giờ bật Popup
      timeoutId = setTimeout(() => {
        setShowPopup(true);
        setCountdown(30);
      }, triggerTime);
    }

    return () => clearTimeout(timeoutId);
  }, [accessToken]); // Lắng nghe mỗi khi có accessToken mới

  // 2. ĐỒNG HỒ ĐẾM NGƯỢC 30s
  useEffect(() => {
    let interval;
    if (showPopup && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (showPopup && countdown <= 0 && !isRenewing) {
      // Hết 30 giây mà không bấm gì -> Đá văng ra ngoài
      handleForceLogout();
    }
    return () => clearInterval(interval);
  }, [showPopup, countdown, isRenewing]);

  const handleForceLogout = async () => {
    // Chặn việc bấm nút nhiều lần
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      // Gọi API để server xóa HttpOnly cookie và token trong DB
      await axiosClient.post("/auth/logout");
      console.log("✅ Đã gọi API /auth/logout phía server để xóa cookie.");
    } catch (error) {
      console.error(
        "⚠️ Lỗi khi gọi API logout, vẫn tiếp tục đăng xuất phía client.",
        error,
      );
    } finally {
      setShowPopup(false);
      logout(); // Xóa state ở client (accessToken, user)
      if (location.pathname !== "/login") {
        navigate("/login");
      }
    }
  };

  const handleRenewToken = async () => {
    try {
      console.log("🔄 Bắt đầu gọi API gia hạn token...");
      setIsRenewing(true);

      // Gọi API refresh token
      // Backend tự đọc refreshToken từ HttpOnly cookie, ta không cần gửi gì lên
      const res = await axiosClient.post("/auth/refresh");
      console.log("✅ API refresh đã được gọi thành công.");

      // LƯU Ý: Do axiosClient.js đã bóc sẵn response.data
      // Nên 'res' ở đây CHÍNH LÀ payload từ backend trả về rồi!
      const newAccess = res.accessToken;

      console.log(
        "🔑 Kiểm tra newAccess:",
        newAccess
          ? "Đã lấy được token mới"
          : "KHÔNG TÌM THẤY TOKEN TRONG RESPONSE",
      );

      if (newAccess) {
        console.log(
          "🎉 Gia hạn thành công! Lưu token mới vào store và đóng popup...",
        );
        // Backend không trả về user, ta dùng lại user cũ trong store
        // refreshToken được tự động cập nhật trong cookie, không cần quản lý ở đây
        setAuth(user, newAccess);
        setShowPopup(false);
      } else {
        console.warn(
          "⚠️ Lỗi: API trả về thành công nhưng không tìm thấy accessToken trong response.",
        );
      }
    } catch (error) {
      console.error("❌ Gia hạn thất bại:", error);
      handleForceLogout();
    } finally {
      setIsRenewing(false);
    }
  };

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl overflow-hidden border-2 border-red-200 scale-100 animate-in zoom-in-95 duration-200">
        <div className="bg-red-50 p-6 flex flex-col items-center text-center border-b border-red-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600 animate-pulse">
            <AlertTriangle size={32} />
          </div>
          <h3 className="font-black text-gray-900 text-xl mb-2">
            Sắp hết phiên đăng nhập!
          </h3>
          <p className="text-gray-600 font-medium text-sm">
            Để bảo mật tài khoản, hệ thống sẽ tự động đăng xuất sau:
          </p>

          <div className="mt-4 flex items-center justify-center gap-2 text-4xl font-black text-red-600">
            <Clock size={32} className="mt-1" /> 00:
            {countdown.toString().padStart(2, "0")}
          </div>
        </div>

        <div className="p-6 bg-white space-y-3">
          <button
            onClick={handleRenewToken}
            disabled={isRenewing}
            className="w-full bg-sv-brown hover:bg-opacity-90 text-white font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            {isRenewing ? (
              <RefreshCw className="animate-spin" size={20} />
            ) : (
              "Tiếp tục duy trì đăng nhập"
            )}
          </button>

          <button
            onClick={handleForceLogout}
            disabled={isLoggingOut}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoggingOut ? (
              <RefreshCw className="animate-spin" size={18} />
            ) : (
              <LogOut size={18} />
            )}
            {isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất ngay"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenExpiryPopup;
