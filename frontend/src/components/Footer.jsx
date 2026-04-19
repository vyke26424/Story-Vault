import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-stone-200 pt-10 pb-6 text-sm text-stone-700 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Phần trên: Grid 4 cột */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {/* Cột 1: Thông tin công ty (Có border phải ở Desktop) */}
          <div className="w-full md:w-1/3 md:border-r border-stone-200 pr-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-4xl">📚</span>
              <h2 className="text-3xl font-black text-amber-900 tracking-tighter">
                Story Vault.
              </h2>
            </div>
            <p className="mb-1 text-stone-600">
              Lầu 5, 387-389 Hai Bà Trưng Quận 3 TP HCM
            </p>
            <p className="mb-1 text-stone-600 font-semibold">
              Công Ty Cổ Phần Phát Hành Sách - STORY VAULT
            </p>
            <p className="mb-4 text-stone-600">
              60 - 62 Lê Lợi, Quận 1, TP. HCM, Việt Nam
            </p>
            <p className="mb-4 text-stone-500 text-xs leading-relaxed">
              StoryVault.com nhận đặt hàng trực tuyến và giao hàng tận nơi.
              KHÔNG hỗ trợ đặt mua và nhận hàng trực tiếp tại văn phòng cũng như
              tất cả Hệ Thống Story Vault trên toàn quốc.
            </p>

            {/* Logo thông báo BCT (Giả lập) */}
            <div className="mb-4">
              <span className="inline-block bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                ✓ ĐÃ THÔNG BÁO BỘ CÔNG THƯƠNG
              </span>
            </div>

            {/* Social & App Stores */}
            <div className="flex gap-2 mb-4 text-2xl">
              <span className="cursor-pointer opacity-70 hover:opacity-100">
                🔵
              </span>{" "}
              {/* Facebook */}
              <span className="cursor-pointer opacity-70 hover:opacity-100">
                📸
              </span>{" "}
              {/* Insta */}
              <span className="cursor-pointer opacity-70 hover:opacity-100">
                ▶️
              </span>{" "}
              {/* Youtube */}
              <span className="cursor-pointer opacity-70 hover:opacity-100">
                🐦
              </span>{" "}
              {/* Twitter */}
            </div>
            <div className="flex gap-2">
              <div className="bg-black text-white px-3 py-1 rounded cursor-pointer text-xs flex items-center gap-1">
                <span>▶</span> Google Play
              </div>
              <div className="bg-black text-white px-3 py-1 rounded cursor-pointer text-xs flex items-center gap-1">
                <span>🍎</span> App Store
              </div>
            </div>
          </div>

          {/* Cột Phải: Link (Grid) & Liên hệ */}
          <div className="w-full md:w-2/3 flex flex-col gap-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {/* Dịch Vụ */}
              <div>
                <h3 className="font-bold text-stone-900 text-base mb-4 uppercase">
                  Dịch vụ
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link
                      to="/terms"
                      className="hover:text-amber-600 transition"
                    >
                      Điều khoản sử dụng
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/privacy"
                      className="hover:text-amber-600 transition"
                    >
                      Chính sách bảo mật thông tin cá nhân
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/payment-security"
                      className="hover:text-amber-600 transition"
                    >
                      Chính sách bảo mật thanh toán
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/about"
                      className="hover:text-amber-600 transition"
                    >
                      Giới thiệu Story Vault
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Hỗ Trợ */}
              <div>
                <h3 className="font-bold text-stone-900 text-base mb-4 uppercase">
                  Hỗ trợ
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link
                      to="/return-policy"
                      className="hover:text-amber-600 transition"
                    >
                      Chính sách đổi - trả - hoàn tiền
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/warranty-policy"
                      className="hover:text-amber-600 transition"
                    >
                      Chính sách bảo hành - bồi hoàn
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/shipping-policy"
                      className="hover:text-amber-600 transition"
                    >
                      Chính sách vận chuyển
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/wholesale-policy"
                      className="hover:text-amber-600 transition"
                    >
                      Chính sách khách sỉ
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Tài Khoản */}
              <div>
                <h3 className="font-bold text-stone-900 text-base mb-4 uppercase">
                  Tài khoản của tôi
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link
                      to="/login"
                      className="hover:text-amber-600 transition"
                    >
                      Đăng nhập/Tạo mới tài khoản
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/profile"
                      className="hover:text-amber-600 transition"
                    >
                      Chi tiết tài khoản
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/profile/orders"
                      className="hover:text-amber-600 transition"
                    >
                      Lịch sử mua hàng
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Phần Liên hệ (Đã được đưa vào cột phải) */}
            <div className="border-t border-stone-200 pt-6">
              <h3 className="font-bold text-stone-900 text-base mb-4 uppercase">
                Liên hệ
              </h3>
              <div className="flex flex-wrap gap-x-12 gap-y-4 text-stone-600">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📍</span>
                  <span>60-62 Lê Lợi, Q.1, TP. HCM</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">✉️</span>
                  <span>cskh@storyvault.com.vn</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">📞</span>
                  <span className="font-bold text-lg">1900 636467</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Phần Logo Đối tác (Vận chuyển & Thanh toán) */}
        <div className="py-6 flex flex-wrap items-center justify-center md:justify-start gap-8 opacity-80">
          {/* Giả lập logo bằng text có style */}
          <span className="font-black text-blue-700 text-3xl italic">EX</span>
          <span className="font-black text-red-600 text-3xl tracking-tight">
            viettel
            <span className="text-stone-500 font-medium text-2xl">post</span>
          </span>
          <span className="font-bold text-orange-500 flex items-center gap-1 text-2xl">
            🚚 GiaoHangNhanh
          </span>
          <span className="font-black text-blue-500 text-3xl italic tracking-tighter">
            VNPAY<span className="text-lg text-blue-400 ml-1">QR</span>
          </span>
          <span className="bg-pink-600 text-white font-bold px-3 py-1.5 rounded-lg text-xl">
            momo
          </span>
          <span className="font-bold text-orange-600 text-2xl">ShopeePay</span>
          <span className="font-black text-green-500 text-3xl">ZaloPay</span>
        </div>

        {/* Phần Dưới cùng: Copyright */}
        <div className="mt-8 text-center text-xs text-stone-400">
          <p>
            Giấy chứng nhận Đăng ký Kinh doanh số 0304132047 do Sở Kế hoạch và
            Đầu tư Thành phố Hồ Chí Minh cấp ngày 20/12/2005, đăng ký thay đổi
            lần thứ 10, ngày 20/05/2022.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
