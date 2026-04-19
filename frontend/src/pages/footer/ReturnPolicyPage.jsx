import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home, RefreshCcw } from "lucide-react";

const ReturnPolicyPage = () => {
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
          <span className="text-sv-brown">Chính sách đổi trả - hoàn tiền</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-sv-tan">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-sv-pale rounded-full flex items-center justify-center mx-auto mb-4 text-sv-brown border border-sv-tan">
              <RefreshCcw size={32} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-sv-brown mb-4">
              Chính Sách Đổi - Trả - Hoàn Tiền
            </h1>
            <p className="text-gray-500 font-medium">
              Áp dụng cho toàn bộ đơn hàng của Quý Khách tại Story Vault
            </p>
          </div>

          <div className="space-y-8 text-gray-700 leading-relaxed font-medium">
            <section>
              <p>
                Chúng tôi luôn trân trọng sự tin tưởng và ủng hộ của quý khách
                hàng khi trải nghiệm mua hàng tại Story Vault. Do đó chúng tôi
                luôn cố gắng hoàn thiện dịch vụ tốt nhất để phục vụ mọi nhu cầu
                mua sắm của quý khách.
              </p>
              <p className="mt-2">
                Story Vault luôn cam kết tất cả các sản phẩm bán ra đều là những
                sản phẩm chất lượng, có xuất xứ nguồn gốc rõ ràng, hợp pháp cũng
                như an toàn cho người tiêu dùng. Để việc mua sắm là một trải
                nghiệm thân thiện, chúng tôi hy vọng quý khách sẽ kiểm tra kỹ
                các nội dung sau trước khi nhận hàng:
              </p>
              <ul className="list-disc pl-5 mt-2 font-bold text-sv-brown">
                <li>
                  Thông tin sản phẩm: tên sản phẩm và chất lượng sản phẩm.
                </li>
                <li>Số lượng sản phẩm.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-black text-sv-brown mb-4">
                1. Thời gian áp dụng đổi/trả
              </h2>
              <div className="overflow-x-auto rounded-xl border border-sv-tan">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-sv-wheat text-sv-brown">
                      <th className="p-4 border-b border-r border-sv-tan font-black">
                        Thời gian (kể từ khi nhận hàng)
                      </th>
                      <th className="p-4 border-b border-r border-sv-tan font-black">
                        Sản phẩm lỗi (do nhà cung cấp)
                      </th>
                      <th className="p-4 border-b border-r border-sv-tan font-black">
                        Sản phẩm không lỗi
                      </th>
                      <th className="p-4 border-b border-sv-tan font-black">
                        Sản phẩm lỗi do người dùng
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-sv-tan hover:bg-sv-pale/50">
                      <td className="p-4 border-r border-sv-tan font-bold">
                        7 - 30 ngày đầu tiên
                      </td>
                      <td className="p-4 border-r border-sv-tan text-green-600 font-bold">
                        Đổi mới
                      </td>
                      <td className="p-4 border-r border-sv-tan">
                        Trả hàng không thu phí (Tùy ngành hàng)
                      </td>
                      <td className="p-4">Không hỗ trợ đổi/trả</td>
                    </tr>
                    <tr className="hover:bg-sv-pale/50">
                      <td className="p-4 border-r border-sv-tan font-bold">
                        Từ 30 ngày trở đi
                      </td>
                      <td className="p-4 border-r border-sv-tan">
                        Bảo hành (Nếu có)
                      </td>
                      <td className="p-4 border-r border-sv-tan">
                        Không hỗ trợ đổi/trả
                      </td>
                      <td className="p-4">Không hỗ trợ đổi/trả</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-sm text-gray-500 italic">
                * Quý khách vui lòng thông báo về cho Story Vault ngay trong
                vòng 2 ngày kể từ khi nhận hàng thành công nếu kiện hàng có dấu
                hiệu hư hại, trầy xước, gãy bìa, ướt, móp méo, hoặc giao
                sai/thiếu hàng.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-sv-brown mb-3">
                2. Các trường hợp yêu cầu đổi trả
              </h2>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li>
                  <strong>Lỗi kỹ thuật của sản phẩm - do nhà cung cấp:</strong>{" "}
                  Sách thiếu trang, sút gáy, trùng nội dung... sẽ được đổi/trả
                  không thu phí.
                </li>
                <li>
                  <strong>Sản phẩm hỏng do quý khách:</strong> Không hỗ trợ
                  đổi/trả.
                </li>
                <li>
                  <strong>Giao nhầm/ giao thiếu:</strong> Giao nhầm sẽ được đổi
                  lại đúng sản phẩm. Giao thiếu sẽ được giao bù thêm số lượng
                  còn thiếu. Cả 2 đều miễn phí đổi trả.
                </li>
                <li>
                  <strong>Chất lượng hàng hóa kém do vận chuyển:</strong> Khi
                  nhận gói hàng bị móp méo, ướt, vui lòng phản ánh hiện trạng
                  lên bill nhận hàng của nhân viên giao nhận và liên hệ Hotline
                  trong 48 giờ để được hỗ trợ.
                </li>
                <li>
                  <strong>Lý do cá nhân (đặt nhầm, không còn nhu cầu):</strong>{" "}
                  Hỗ trợ thu hồi và hoàn tiền 100% giá trị sản phẩm. Lưu ý:
                  Không hoàn lại chi phí vận chuyển trong trường hợp này.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-black text-sv-brown mb-3">
                3. Cách thức đóng gói gửi trả
              </h2>
              <p>Khi yêu cầu đổi trả được giải quyết, quý khách vui lòng:</p>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li>
                  Đóng gói sản phẩm như hiện trạng khi nhận hàng ban đầu (bao
                  gồm sản phẩm, quà tặng, phụ kiện kèm theo... nếu có).
                </li>
                <li>
                  Kèm theo Hóa đơn giá trị gia tăng của Story Vault (nếu có).
                </li>
                <li>
                  <strong className="text-amber-600">Lưu ý quan trọng:</strong>{" "}
                  Quý khách cần quay video clip đóng gói sản phẩm để làm bằng
                  chứng đối chiếu/khiếu nại liên quan đến đổi trả về sau (nếu
                  cần). Quý khách vui lòng chịu trách nhiệm về trạng thái nguyên
                  vẹn của sản phẩm khi gửi về.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-black text-sv-brown mb-3">
                4. Thời gian hoàn tiền
              </h2>
              <p className="mb-4">
                Tùy thuộc vào phương thức thanh toán mà quý khách đã sử dụng,
                thời gian hoàn tiền sẽ khác nhau:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li>
                  <strong>Ví Momo / ZaloPay / ShopeePay:</strong> Từ 1 - 3 ngày
                  làm việc.
                </li>
                <li>
                  <strong>ATM Nội địa / Chuyển khoản VNPay:</strong> Từ 5 - 7
                  ngày làm việc.
                </li>
                <li>
                  <strong>Thẻ Visa / Master / JCB:</strong> Từ 5 - 7 ngày làm
                  việc (Tùy theo chính sách của từng ngân hàng, số tiền hoàn có
                  thể mất từ 1-3 tuần để nổi trong tài khoản).
                </li>
              </ul>
              <p className="mt-2 text-sm text-gray-500 italic">
                * Thời gian hoàn tiền được tính kể từ thời điểm Story Vault nhận
                được hàng hoàn trả và xác nhận hàng hóa đáp ứng đủ các điều kiện
                trả hàng. Nếu thanh toán bằng tiền mặt (COD), tiền sẽ được hoàn
                qua tài khoản Ngân hàng do quý khách chỉ định.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicyPage;
