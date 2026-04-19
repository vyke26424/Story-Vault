import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  Home,
  Users,
  Percent,
  Truck,
  Handshake,
} from "lucide-react";

const WholesalePolicyPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-sv-cream min-h-screen pb-20 font-nunito">
      {/* BREADCRUMBS */}
      <div className="bg-white border-b border-sv-tan mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-2 text-sm font-bold text-gray-500">
          <Link to="/" className="hover:text-sv-brown flex items-center gap-1">
            <Home size={16} /> Trang chủ
          </Link>
          <ChevronRight size={16} />
          <span className="text-sv-brown">Chính sách khách sỉ</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-sv-tan">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-sv-pale rounded-full flex items-center justify-center mx-auto mb-4 text-sv-brown border border-sv-tan">
              <Users size={32} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-sv-brown mb-4">
              Chính Sách Khách Sỉ & Doanh Nghiệp
            </h1>
            <p className="text-gray-500 font-medium">
              Đồng hành phát triển, chia sẻ thành công cùng Story Vault.
            </p>
          </div>

          <div className="space-y-8 text-gray-700 leading-relaxed font-medium">
            <section>
              <h2 className="text-xl font-black text-sv-brown mb-3 flex items-center gap-2">
                <Handshake size={20} className="text-amber-600" /> 1. Điều kiện
                áp dụng
              </h2>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li>
                  Chính sách mua sỉ áp dụng cho các cá nhân, đại lý, doanh
                  nghiệp, trường học hoặc thư viện có nhu cầu mua số lượng lớn
                  để kinh doanh, làm quà tặng hoặc phục vụ giảng dạy.
                </li>
                <li>
                  <strong>Giá trị đơn hàng tối thiểu:</strong> Từ{" "}
                  <span className="font-bold text-sv-brown">3.000.000 VNĐ</span>{" "}
                  trở lên (tính trên giá bìa chưa chiết khấu).
                </li>
                <li>
                  Khách hàng được quyền lựa chọn đa dạng các mẫu mã, tựa sách và
                  thể loại trong cùng một đơn hàng.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-black text-sv-brown mb-4 flex items-center gap-2">
                <Percent size={20} className="text-amber-600" /> 2. Chính sách
                chiết khấu (Tham khảo)
              </h2>
              <p className="mb-4">
                Mức chiết khấu được áp dụng linh hoạt tùy theo nhóm ngành hàng,
                số lượng và thời điểm đặt hàng. Dưới đây là khung chiết khấu cơ
                bản:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-sv-pale/50 border border-sv-tan rounded-2xl flex justify-between items-center">
                  <span className="font-bold text-gray-700">
                    Sách Kinh tế, Văn học
                  </span>
                  <span className="font-black text-xl text-green-600">
                    Tới 30%
                  </span>
                </div>
                <div className="p-4 bg-sv-pale/50 border border-sv-tan rounded-2xl flex justify-between items-center">
                  <span className="font-bold text-gray-700">
                    Thiếu nhi, Tâm lý - Kỹ năng
                  </span>
                  <span className="font-black text-xl text-green-600">
                    Tới 20%
                  </span>
                </div>
                <div className="p-4 bg-sv-pale/50 border border-sv-tan rounded-2xl flex justify-between items-center">
                  <span className="font-bold text-gray-700">
                    Manga, Comic, Light Novel
                  </span>
                  <span className="font-black text-xl text-amber-600">
                    Tới 15%
                  </span>
                </div>
                <div className="p-4 bg-sv-pale/50 border border-sv-tan rounded-2xl flex justify-between items-center">
                  <span className="font-bold text-gray-700">
                    Từ điển, Sách Ngoại văn
                  </span>
                  <span className="font-black text-xl text-amber-600">
                    Tới 10%
                  </span>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-500 italic">
                * Lưu ý: Mức chiết khấu thực tế sẽ được nhân viên kinh doanh của
                Story Vault tư vấn và báo giá chi tiết theo từng đơn hàng cụ thể
                của Quý khách.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-sv-brown mb-3">
                3. Quy định thanh toán & Hóa đơn
              </h2>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li>
                  Đối với đơn hàng có giá trị trên 5.000.000 VNĐ, Quý khách vui
                  lòng <strong>đặt cọc 50%</strong> hoặc thanh toán 100% trước
                  khi Story Vault tiến hành đóng gói và giao hàng.
                </li>
                <li>
                  Story Vault hỗ trợ <strong>xuất hóa đơn GTGT (VAT)</strong>{" "}
                  đầy đủ, hợp lệ cho tất cả các đơn hàng sỉ theo thông tin doanh
                  nghiệp Quý khách cung cấp.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-black text-sv-brown mb-3 flex items-center gap-2">
                <Truck size={20} className="text-amber-600" /> 4. Chính sách vận
                chuyển
              </h2>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li>
                  Story Vault hỗ trợ <strong>miễn/giảm phí vận chuyển</strong>{" "}
                  cho đơn sỉ có giá trị từ <strong>30.000.000 VNĐ</strong> (Áp
                  dụng giao hàng tập trung tại 1 địa điểm).
                </li>
                <li>
                  Trong trường hợp Quý doanh nghiệp có nhu cầu phân chia giao
                  hàng đến nhiều địa điểm/chi nhánh khác nhau, bộ phận vận hành
                  của chúng tôi luôn sẵn sàng tư vấn phương án vận chuyển tối ưu
                  chi phí nhất.
                </li>
                <li>
                  Thời gian chuẩn bị hàng sỉ dao động từ 3 - 7 ngày tùy thuộc
                  vào số lượng và tình trạng tồn kho của các tựa sách.
                </li>
              </ul>
            </section>

            <section>
              <div className="bg-sv-brown text-white p-6 rounded-2xl mt-8 text-center shadow-md">
                <h3 className="text-xl font-black mb-2">
                  Trở Thành Đối Tác Của Chúng Tôi Ngay Hôm Nay
                </h3>
                <p className="mb-4 font-medium text-sv-pale">
                  Để nhận báo giá chi tiết và được hỗ trợ nhanh nhất, Quý khách
                  vui lòng liên hệ:
                </p>
                <div className="inline-block bg-white text-sv-brown font-black px-6 py-3 rounded-full text-lg mb-2">
                  Hotline Sỉ: 0909 888 999
                </div>
                <p className="font-medium">
                  Hoặc Email:{" "}
                  <a
                    href="mailto:b2b@storyvault.com.vn"
                    className="underline hover:text-amber-300"
                  >
                    b2b@storyvault.com.vn
                  </a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WholesalePolicyPage;
