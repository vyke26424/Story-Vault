import axios from 'axios';
import useAuthStore from '../store/useAuthStore';

// Cấu hình Base URL chung
const baseURL = 'http://localhost:3000';

const axiosClient = axios.create({
  baseURL: baseURL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Request Interceptor
axiosClient.interceptors.request.use(
  (config) => {
    // Khớp với tên biến trong Zustand mới của chúng ta
    const token = useAuthStore.getState().accessToken; 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor
axiosClient.interceptors.response.use(
  (response) => response.data, // Trả thẳng data ra ngoài cho tiện
  async (error) => {
    const originalRequest = error.config;

    // --- 1. NẾU LỖI TỪ API SIGNIN/REGISTER THÌ BỎ QUA REFRESH ---
    // (Lưu ý: Backend mới của ta dùng đường dẫn /auth/signin)
    if (
      error.response?.status === 401 &&
      (originalRequest.url.includes('/auth/signin') || originalRequest.url.includes('/auth/register'))
    ) {
      return Promise.reject(error);
    }

    // --- LOG LỖI SERVER (500) ĐỂ DỄ DEBUG ---
    if (error.response?.status === 500) {
      console.error(
        `🔥 Lỗi Server (500) tại ${originalRequest.url}:`,
        error.response.data,
      );
    }

    // --- 2. XỬ LÝ LỖI 503 (BẢO TRÌ) ---
    if (error.response && error.response.status === 503) {
      if (window.location.pathname !== '/maintenance') {
        window.location.href = '/maintenance';
      }
      return new Promise(() => {}); // Treo promise để UI không giật cục
    }

    // --- 3. XỬ LÝ REFRESH TOKEN ---
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log('⚠️ Token hết hạn! Đang gọi Refresh Token...');

        const res = await axios.post(
          `${baseURL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        // API backend mới trả về: { accessToken: "..." }
        const newAccessToken = res.data.accessToken; 

        // Cập nhật Token mới vào Zustand
        useAuthStore.getState().setAccessToken(newAccessToken);

        // Gắn token mới vào header của request hiện tại và default
        axiosClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        // Gọi lại request cũ
        return axiosClient(originalRequest);
        
      } catch (refreshError) {
        console.error('Phiên đăng nhập hết hạn hẳn:', refreshError);
        useAuthStore.getState().logout(); // Đăng xuất khỏi Zustand

        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosClient;