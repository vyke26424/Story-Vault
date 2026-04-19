import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home, Truck, Clock, MapPin } from "lucide-react";

const ShippingPolicyPage = () => {
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
          <span className="text-sv-brown">Chính sách vận chuyển</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-sv-tan">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-sv-pale rounded-full flex items-center justify-center mx-auto mb-4 text-sv-brown border border-sv-tan">
              <Truck size={32} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-sv-brown mb-4">
              Chính Sách Vận Chuyển
            </h1>
            <p className="text-gray-500 font-medium">
              Chi tiết về phí giao hàng và thời gian nhận hàng tại Story Vault.
            </p>
          </div>

          <div className="space-y-8 text-gray-700 leading-relaxed font-medium">
            <section>
              <h2 className="text-xl font-black text-sv-brown mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-amber-600" /> 1. Biểu phí giao
                hàng
              </h2>
              <div className="overflow-x-auto rounded-xl border border-sv-tan">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-sv-wheat text-sv-brown">
                      <th className="p-4 border-b border-r border-sv-tan font-black">
                        Khu vực giao hàng
                      </th>
                      <th className="p-4 border-b border-r border-sv-tan font-black">
                        Đơn hàng từ 150.000đ
                      </th>
                      <th className="p-4 border-b border-sv-tan font-black">
                        Đơn hàng dưới 150.000đ
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-sv-tan hover:bg-sv-pale/50">
                      <td className="p-4 border-r border-sv-tan font-bold">
                        TP. HCM & Hà Nội
                      </td>
                      <td className="p-4 border-r border-sv-tan text-green-600 font-bold italic">
                        Miễn phí vận chuyển
                      </td>
                      <td className="p-4 italic">19.000đ / đơn hàng</td>
                    </tr>
                    <tr className="hover:bg-sv-pale/50">
                      <td className="p-4 border-r border-sv-tan font-bold">
                        Các Tỉnh/Thành khác
                      </td>
                      <td className="p-4 border-r border-sv-tan">
                        <span className="text-green-600 font-bold italic">
                          Miễn phí
                        </span>{" "}
                        (Đơn từ 250k)
                      </td>
                      <td className="p-4 italic">29.000đ - 35.000đ</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-sm text-gray-500 italic">
                * Lưu ý: Đối với các đơn hàng quá khổ hoặc khối lượng lớn (trên
                5kg), Story Vault sẽ liên hệ xác nhận phụ phí vận chuyển nếu có.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-sv-brown mb-4 flex items-center gap-2">
                <Clock size={20} className="text-amber-600" /> 2. Thời gian giao
                hàng dự kiến
              </h2>
              <ul className="space-y-4">
                <li className="flex gap-4 p-4 bg-sv-pale/30 rounded-2xl border border-sv-pale">
                  <div className="font-black text-sv-brown shrink-0">
                    Nội thành:
                  </div>
                  <div>
                    Từ 1 - 2 ngày làm việc kể từ khi đơn hàng được xác nhận.
                  </div>
                </li>
                <li className="flex gap-4 p-4 bg-sv-pale/30 rounded-2xl border border-sv-pale">
                  <div className="font-black text-sv-brown shrink-0">
                    Ngoại thành:
                  </div>
                  <div>
                    Từ 2 - 4 ngày làm việc kể từ khi đơn hàng được xác nhận.
                  </div>
                </li>
                <li className="flex gap-4 p-4 bg-sv-pale/30 rounded-2xl border border-sv-pale">
                  <div className="font-black text-sv-brown shrink-0">
                    Vùng sâu/xa:
                  </div>
                  <div>
                    Từ 4 - 7 ngày làm việc tùy vào đơn vị vận chuyển địa phương.
                  </div>
                </li>
              </ul>
              <p className="mt-2">
                Thời gian giao hàng không tính Thứ 7, Chủ nhật và các ngày Lễ,
                Tết.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-sv-brown mb-3">
                3. Quy trình nhận hàng
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Story Vault hỗ trợ khách hàng kiểm tra ngoại quan kiện hàng
                  (còn nguyên băng keo, không bị móp méo, ướt).
                </li>
                <li>
                  Khách hàng vui lòng{" "}
                  <strong>quay video clip khi mở kiện hàng</strong>. Đây là
                  thông tin quan trọng giúp Story Vault xử lý các khiếu nại về
                  thiếu hàng, sai hàng hoặc hàng hỏng nhanh chóng nhất.
                </li>
                <li>
                  Nếu kiện hàng có dấu hiệu bị bóc mở hoặc hư hại nặng khi giao
                  tới, quý khách có quyền từ chối nhận hàng và báo ngay cho
                  Hotline CSKH của chúng tôi.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-black text-sv-brown mb-3">
                4. Đối tác vận chuyển
              </h2>
              <p>
                Hiện tại Story Vault hợp tác với các đơn vị vận chuyển uy tín
                như:{" "}
                <strong>Viettel Post, Giao Hàng Nhanh (GHN), và Ahamove</strong>{" "}
                (cho các đơn hàng hỏa tốc nội thành) để đảm bảo hàng hóa đến tay
                khách hàng nhanh chóng và an toàn nhất.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicyPage;
