import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home, ShieldAlert } from "lucide-react";

const PrivacyPolicyPage = () => {
  // Cuộn lên đầu khi vào trang
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
          <span className="text-sv-brown">Chính sách bảo mật</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-sv-tan">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-sv-pale rounded-full flex items-center justify-center mx-auto mb-4 text-sv-brown border border-sv-tan">
              <ShieldAlert size={32} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-sv-brown mb-4">
              Chính Sách Bảo Mật Thông Tin
            </h1>
            <p className="text-gray-500 font-medium">
              Bảo vệ quyền riêng tư của khách hàng là ưu tiên hàng đầu của chúng
              tôi.
            </p>
          </div>

          <div className="space-y-8 text-gray-700 leading-relaxed font-medium">
            <section>
              <h2 className="text-xl font-black text-sv-brown mb-3">
                1. Mục đích và phạm vi thu thập thông tin
              </h2>
              <p>
                Việc thu thập dữ liệu chủ yếu trên website Story Vault bao gồm:
                email, điện thoại, mật khẩu đăng nhập, địa chỉ khách hàng. Đây
                là các thông tin mà Story Vault cần quý khách cung cấp bắt buộc
                khi đăng ký sử dụng dịch vụ và để chúng tôi liên hệ xác nhận khi
                quý khách đăng ký mua hàng trên website nhằm đảm bảo quyền lợi
                cho cho người tiêu dùng.
              </p>
              <p className="mt-2">
                Khách hàng sẽ tự chịu trách nhiệm về bảo mật và lưu giữ mọi hoạt
                động sử dụng dịch vụ dưới tên đăng ký, mật khẩu và hộp thư điện
                tử của mình.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-sv-brown mb-3">
                2. Phạm vi sử dụng thông tin
              </h2>
              <p>
                Website Story Vault sử dụng thông tin khách hàng cung cấp để:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li>Cung cấp các dịch vụ/sản phẩm đến khách hàng.</li>
                <li>Giao hàng theo địa chỉ mà quý khách cung cấp.</li>
                <li>
                  Gửi các thông báo về các hoạt động trao đổi thông tin giữa
                  khách hàng và Story Vault.
                </li>
                <li>
                  Ngăn ngừa các hoạt động phá hủy tài khoản người dùng của khách
                  hàng hoặc các hoạt động giả mạo khách hàng.
                </li>
                <li>
                  Liên lạc và giải quyết với khách hàng trong những trường hợp
                  đặc biệt.
                </li>
                <li>
                  Không sử dụng thông tin cá nhân của khách hàng ngoài mục đích
                  xác nhận và liên hệ có liên quan đến giao dịch tại Story
                  Vault.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-black text-sv-brown mb-3">
                3. Thời gian lưu trữ thông tin
              </h2>
              <p>
                Dữ liệu cá nhân của khách hàng sẽ được lưu trữ cho đến khi có
                yêu cầu hủy bỏ hoặc tự khách hàng đăng nhập và thực hiện hủy bỏ.
                Còn lại trong mọi trường hợp thông tin cá nhân khách hàng sẽ
                được bảo mật tuyệt đối trên máy chủ của Story Vault.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-sv-brown mb-3">
                4. Những người hoặc tổ chức có thể tiếp cận thông tin
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Ban quản trị Story Vault:</strong> Phục vụ cho việc
                  quản lý tài khoản và xử lý đơn hàng.
                </li>
                <li>
                  <strong>Đối tác vận chuyển:</strong> Thông tin tên người nhận,
                  số điện thoại và địa chỉ giao hàng sẽ được cung cấp cho các
                  đối tác vận chuyển (Viettel Post, Giao Hàng Nhanh...) để thực
                  hiện việc giao nhận hàng hóa.
                </li>
                <li>
                  <strong>Cơ quan nhà nước có thẩm quyền:</strong> Trong trường
                  hợp có yêu cầu của pháp luật, chúng tôi có trách nhiệm hợp tác
                  cung cấp thông tin cá nhân khách hàng.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-black text-sv-brown mb-3">
                5. Phương tiện và công cụ để tiếp cận và chỉnh sửa dữ liệu cá
                nhân
              </h2>
              <p>
                Khách hàng có quyền tự kiểm tra, cập nhật, điều chỉnh hoặc hủy
                bỏ thông tin cá nhân của mình bằng cách đăng nhập vào tài khoản
                và chỉnh sửa thông tin cá nhân hoặc yêu cầu Story Vault thực
                hiện việc này thông qua hotline hoặc email CSKH.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-sv-brown mb-3">
                6. Cam kết bảo mật thông tin cá nhân khách hàng
              </h2>
              <p>
                Thông tin cá nhân của khách hàng trên Story Vault được cam kết
                bảo mật tuyệt đối theo chính sách bảo vệ thông tin cá nhân của
                Story Vault. Việc thu thập và sử dụng thông tin của mỗi khách
                hàng chỉ được thực hiện khi có sự đồng ý của khách hàng đó trừ
                những trường hợp pháp luật có quy định khác.
              </p>
              <p className="mt-2 text-red-600 font-bold">
                Chúng tôi cam kết không sử dụng, không chuyển giao, cung cấp hay
                tiết lộ cho bên thứ 3 nào về thông tin cá nhân của khách hàng
                khi không có sự cho phép đồng ý từ khách hàng.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
