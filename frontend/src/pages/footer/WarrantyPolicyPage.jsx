import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home, Wrench } from 'lucide-react';

const WarrantyPolicyPage = () => {
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
          <span className="text-sv-brown">Chính sách bảo hành & bồi hoàn</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-sv-tan">
          
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-sv-pale rounded-full flex items-center justify-center mx-auto mb-4 text-sv-brown border border-sv-tan">
              <Wrench size={32} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-sv-brown mb-4">Chính Sách Bảo Hành - Bồi Hoàn</h1>
            <p className="text-gray-500 font-medium">Quy định về bảo hành các sản phẩm có linh kiện điện tử, máy móc.</p>
          </div>

          <div className="space-y-8 text-gray-700 leading-relaxed font-medium">
            <section>
              <h2 className="text-xl font-black text-sv-brown mb-3">1. Điều kiện được bảo hành</h2>
              <p>Sản phẩm mua tại hệ thống Story Vault được bảo hành miễn phí nếu đảm bảo các điều kiện sau:</p>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li>Sản phẩm thuộc danh mục được bảo hành từ Nhà sản xuất hoặc Nhà phân phối (ví dụ: máy tính cầm tay, bút chấm đọc, từ điển điện tử, đồ chơi dùng pin/điện...).</li>
                <li>Sản phẩm bị lỗi kỹ thuật do lỗi của Nhà sản xuất.</li>
                <li>Sản phẩm vẫn còn trong thời hạn bảo hành. Thời hạn bảo hành được tính từ ngày mua hàng in trên hóa đơn.</li>
                <li>Phiếu bảo hành/Tem bảo hành còn nguyên vẹn, không chắp vá, không bị gạch xóa hay sửa chữa. Thông tin trên phiếu phải trùng khớp với sản phẩm.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-black text-sv-brown mb-3">2. Những trường hợp từ chối bảo hành</h2>
              <p>Story Vault và Nhà cung cấp xin phép từ chối bảo hành đối với các trường hợp sau:</p>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li>Sản phẩm đã hết thời hạn bảo hành.</li>
                <li>Không có tem bảo hành hoặc tem bảo hành, mã vạch bị rách, bị dán đè, hoặc bị sửa đổi.</li>
                <li>Sản phẩm bị hư hỏng do lỗi của người sử dụng (rơi vỡ, móp méo, biến dạng, trầy xước, vô nước, để gần nhiệt độ cao...).</li>
                <li>Sản phẩm bị hư hỏng do thiên tai, hỏa hoạn, lụt lội, sét đánh, côn trùng phá hoại.</li>
                <li>Sản phẩm đã bị tự ý tháo dỡ, sửa chữa bởi các cá nhân hoặc kỹ thuật viên không được sự ủy quyền của Story Vault.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-black text-sv-brown mb-3">3. Thời gian xử lý bảo hành</h2>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li>Thời gian kiểm tra và xử lý bảo hành thường kéo dài từ <strong>07 đến 14 ngày làm việc</strong> (không tính thứ 7, Chủ nhật và ngày Lễ) kể từ khi Story Vault nhận được sản phẩm.</li>
                <li>Tùy thuộc vào mức độ hư hỏng và linh kiện thay thế từ Nhà cung cấp, thời gian này có thể kéo dài hơn, Story Vault sẽ chủ động liên hệ thông báo tiến độ cho quý khách.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-black text-sv-brown mb-3">4. Chính sách Bồi hoàn (Đổi mới / Hoàn tiền)</h2>
              <p>Trong trường hợp sản phẩm đủ điều kiện bảo hành nhưng không thể sửa chữa (hoặc không có linh kiện thay thế), Story Vault sẽ áp dụng chính sách bồi hoàn như sau:</p>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li><strong>Đổi sản phẩm mới:</strong> Quý khách sẽ được đổi sang một sản phẩm mới cùng loại.</li>
                <li><strong>Đổi sản phẩm tương đương:</strong> Nếu sản phẩm cùng loại đã hết hàng/ngưng sản xuất, Story Vault sẽ thỏa thuận để đổi sang một sản phẩm khác có tính năng và giá trị tương đương.</li>
                <li><strong>Hoàn tiền:</strong> Nếu cả 2 phương án trên đều không khả thi, Story Vault sẽ thu hồi sản phẩm hỏng và tiến hành bồi hoàn lại 100% số tiền mà quý khách đã thanh toán cho sản phẩm đó (không bao gồm phí vận chuyển).</li>
              </ul>
            </section>

            <section>
              <div className="bg-sv-wheat/30 p-5 rounded-2xl border border-sv-pale mt-6">
                <h3 className="font-bold text-sv-brown mb-2">📌 Liên hệ gửi bảo hành:</h3>
                <p className="text-sm">Quý khách vui lòng liên hệ Hotline <strong>1900 636467</strong> hoặc gửi email về <strong>cskh@storyvault.com.vn</strong> để được hướng dẫn địa chỉ gửi sản phẩm về Trung tâm bảo hành gần nhất.</p>
              </div>
            </section>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default WarrantyPolicyPage;