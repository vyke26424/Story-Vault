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
    // TRÚNG PHÓC: Lấy đúng tên biến accessToken từ kho của sếp
    const accessToken = useAuthStore.getState().accessToken;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// BẮT LỖI TRẢ VỀ TỪ BACKEND
axiosClient.interceptors.response.use(
  (response) => {
    // Bóc sẵn lớp vỏ data cho sếp nhàn
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("⛔ Lỗi 401: Token không hợp lệ hoặc đã hết hạn!");
      // Nếu sau này sếp muốn hết hạn token thì tự văng ra trang Login, mở comment dòng dưới:
      // useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
