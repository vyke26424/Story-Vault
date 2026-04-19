import axios from "axios";
import useAuthStore from "../store/useAuthStore";

const axiosClient = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// TỰ ĐỘNG GẮN TOKEN VÀO MỌI CHUYẾN XE GỬI ĐI
axiosClient.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken && accessToken !== "undefined" && accessToken !== "null") {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// BẮT LỖI VÀ GIA HÀN NGẦM (SILENT REFRESH)
axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 1. NẾU LỖI LÀ TỪ TRANG LOGIN HOẶC LOGOUT -> BỎ QUA (Để Frontend tự báo lỗi sai pass)
    if (
      error.response?.status === 401 &&
      (originalRequest.url.includes("/auth/signin") ||
        originalRequest.url.includes("/auth/register") ||
        originalRequest.url.includes("/auth/logout"))
    ) {
      return Promise.reject(error);
    }

    const currentToken = useAuthStore.getState().accessToken;

    // 2. SILENT REFRESH: Nếu token hết hạn khi đang thao tác (Chỉ chạy khi ĐÃ CÓ token)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      currentToken
    ) {
      originalRequest._retry = true; // Đánh dấu để không bị lặp vô tận

      try {
        console.log("🔄 Lỗi 401: Token hết hạn. Đang âm thầm gia hạn ngầm...");

        // Dùng axios gốc (không dùng axiosClient) để gọi API refresh tránh vòng lặp
        const res = await axios.post(
          "http://localhost:3000/auth/refresh",
          {},
          { withCredentials: true },
        );

        // Lấy token mới từ response
        const newAccess = res.data?.accessToken || res.data?.data?.accessToken;

        if (newAccess) {
          console.log(
            "✅ Gia hạn ngầm thành công! Tiếp tục tác vụ bị gián đoạn.",
          );

          // Cập nhật token mới vào kho (Lúc này Popup cũng sẽ tự động reset giờ)
          const currentUser = useAuthStore.getState().user;
          useAuthStore.getState().setAuth(currentUser, newAccess);

          // Gắn token mới vào request đang bị kẹt và gửi lại
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return axiosClient(originalRequest);
        }
      } catch (refreshError) {
        console.error(
          "❌ Gia hạn ngầm thất bại. Trục xuất về Login!",
          refreshError,
        );

        // Hết cứu (RefreshToken cũng chết) -> Đăng xuất thật
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
