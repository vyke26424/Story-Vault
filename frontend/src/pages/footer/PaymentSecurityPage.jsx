import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home, CreditCard } from 'lucide-react';

const PaymentSecurityPage = () => {
  // Cuộn lên đầu khi vào trang
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-sv-cream min-h-screen pb-20 font-nunito">
      {/* BREADCRUMBS */}
      <div className="bg-white border-b border-sv-tan mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-2 text-sm font-bold text-gray-500">
          <Link to="/" className="hover:text-sv-brown flex items-center gap-1"><Home size={16} /> Trang chủ</Link>
          <ChevronRight size={16} />
          <span className="text-sv-brown">Bảo mật thanh toán</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-sv-tan">
          
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-sv-pale rounded-full flex items-center justify-center mx-auto mb-4 text-sv-brown border border-sv-tan">
              <CreditCard size={32} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-sv-brown mb-4">Chính Sách Bảo Mật Thanh Toán</h1>
            <p className="text-gray-500 font-medium">An toàn giao dịch của bạn là ưu tiên số một của Story Vault.</p>
          </div>

          <div className="space-y-8 text-gray-700 leading-relaxed font-medium">
            <section>
              <h2 className="text-xl font-black text-sv-brown mb-3">1. Cam kết bảo mật</h2>
              <p>Hệ thống thanh toán của Story Vault được kết nối với các đối tác thứ ba như VNPay, Momo, ZaloPay, ShopeePay... theo tiêu chuẩn an toàn bảo mật của pháp luật Việt Nam. Theo đó, các tiêu chuẩn bảo mật thanh toán thẻ của Story Vault đảm bảo tuân thủ theo các tiêu chuẩn bảo mật của các Đối tác Cổng thanh toán.</p>
              <p className="mt-2">Ngoài ra, Story Vault còn có các tiêu chuẩn bảo mật giao dịch thanh toán riêng, đảm bảo thông tin thanh toán của khách hàng được an toàn tuyệt đối.</p>
            </section>

            <section>
              <h2 className="text-xl font-black text-sv-brown mb-3">2. Quy định bảo mật thanh toán</h2>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li><strong>Không lưu trữ thông tin thẻ:</strong> Thông tin thẻ thanh toán/tài khoản ngân hàng của quý khách KHÔNG bị lưu giữ trên hệ thống của Story Vault. Khi tiến hành thanh toán, khách hàng sẽ được chuyển hướng sang môi trường thanh toán an toàn của Cổng thanh toán đối tác.</li>
                <li><strong>Ghi nhận thông tin giao dịch:</strong> Story Vault chỉ lưu giữ thông tin chi tiết về đơn hàng bao gồm: Mã đơn hàng, Tên sản phẩm, Số tiền, Thời gian giao dịch và Phương thức thanh toán khách hàng đã chọn.</li>
                <li><strong>Mã hóa dữ liệu:</strong> Mọi thông tin trao đổi giữa trình duyệt của khách hàng và hệ thống Story Vault (bao gồm cả quá trình chuyển hướng sang Cổng thanh toán) đều được mã hóa bằng giao thức SSL/TLS (Secure Sockets Layer/Transport Layer Security) chuẩn quốc tế.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-black text-sv-brown mb-3">3. Tiêu chuẩn bảo mật của Đối tác Cổng thanh toán</h2>
              <p>Các đối tác thanh toán của chúng tôi cam kết tuân thủ các tiêu chuẩn bảo mật sau:</p>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li>Tiêu chuẩn bảo mật dữ liệu thẻ thanh toán quốc tế PCI DSS (Payment Card Industry Data Security Standard) do hội đồng tiêu chuẩn bảo mật thẻ thanh toán quốc tế thiết lập.</li>
                <li>Mật khẩu sử dụng một lần (OTP) được gửi trực tiếp qua SMS hoặc xác thực qua Smart OTP trên ứng dụng ngân hàng/ví điện tử của khách hàng.</li>
                <li>Hệ thống phòng chống rủi ro, gian lận (Fraud Prevention) luôn hoạt động 24/7 để phát hiện các giao dịch bất thường.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-black text-sv-brown mb-3">4. Trách nhiệm của khách hàng</h2>
              <p>Để đảm bảo an toàn tối đa cho giao dịch, quý khách cần lưu ý:</p>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li>Tuyệt đối <strong>KHÔNG</strong> chia sẻ mã OTP, mật khẩu thanh toán, mã PIN thẻ hoặc các thông tin bảo mật khác cho bất kỳ ai, kể cả người tự xưng là nhân viên của Story Vault.</li>
                <li>Chỉ thực hiện thanh toán trên các thiết bị cá nhân đáng tin cậy và không sử dụng mạng Wi-Fi công cộng khi nhập thông tin thanh toán.</li>
                <li>Đăng xuất khỏi tài khoản Story Vault sau khi hoàn tất mua sắm nếu sử dụng chung thiết bị với người khác.</li>
                <li>Nếu nghi ngờ thông tin thẻ/ví điện tử bị lộ hoặc có giao dịch bất thường, vui lòng liên hệ ngay với Ngân hàng/Ví điện tử phát hành và Hotline CSKH của Story Vault để được hỗ trợ khóa giao dịch kịp thời.</li>
              </ul>
            </section>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default PaymentSecurityPage;