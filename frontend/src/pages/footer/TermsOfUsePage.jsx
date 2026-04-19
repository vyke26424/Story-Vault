import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home, ShieldCheck } from "lucide-react";

const TermsOfUsePage = () => {
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
          <span className="text-sv-brown">Điều khoản sử dụng</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-sv-tan">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-sv-pale rounded-full flex items-center justify-center mx-auto mb-4 text-sv-brown border border-sv-tan">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-sv-brown mb-4">
              Điều Khoản Sử Dụng
            </h1>
            <p className="text-gray-500 font-medium">
              Cập nhật lần cuối: Hôm nay
            </p>
          </div>

          <div className="space-y-8 text-gray-700 leading-relaxed font-medium">
            <section>
              <h2 className="text-xl font-black text-sv-brown mb-3">
                1. Chào mừng đến với Story Vault
              </h2>
              <p>
                Chào mừng quý khách đến với website thương mại điện tử Story
                Vault. Khi quý khách truy cập vào trang web của chúng tôi có
                nghĩa là quý khách đồng ý với các điều khoản này. Trang web có
                quyền thay đổi, chỉnh sửa, thêm hoặc lược bỏ bất kỳ phần nào
                trong Điều khoản mua bán hàng hóa này, vào bất cứ lúc nào. Các
                thay đổi có hiệu lực ngay khi được đăng trên trang web mà không
                cần thông báo trước. Và khi quý khách tiếp tục sử dụng trang
                web, sau khi các thay đổi về Điều khoản này được đăng tải, có
                nghĩa là quý khách chấp nhận với những thay đổi đó.
              </p>
              <p className="mt-2">
                Quý khách vui lòng kiểm tra thường xuyên để cập nhật những thay
                đổi của chúng tôi.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-sv-brown mb-3">
                2. Hướng dẫn sử dụng website
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Khi vào web của chúng tôi, khách hàng phải đảm bảo đủ 18 tuổi,
                  hoặc truy cập dưới sự giám sát của cha mẹ hay người giám hộ
                  hợp pháp. Khách hàng đảm bảo có đầy đủ hành vi dân sự để thực
                  hiện các giao dịch mua bán hàng hóa theo quy định hiện hành
                  của pháp luật Việt Nam.
                </li>
                <li>
                  Chúng tôi sẽ cấp một tài khoản (Account) sử dụng để khách hàng
                  có thể mua sắm trên website Story Vault trong khuôn khổ Điều
                  khoản và Điều kiện sử dụng đã đề ra.
                </li>
                <li>
                  Quý khách hàng sẽ phải đăng ký tài khoản với thông tin xác
                  thực về bản thân và phải cập nhật nếu có bất kỳ thay đổi nào.
                  Mỗi người truy cập phải có trách nhiệm với mật khẩu, tài khoản
                  và hoạt động của mình trên web. Hơn nữa, quý khách phải thông
                  báo cho chúng tôi biết khi tài khoản bị truy cập trái phép.
                  Chúng tôi không chịu bất kỳ trách nhiệm nào, dù trực tiếp hay
                  gián tiếp, đối với những thiệt hại hoặc mất mát gây ra do quý
                  khách không tuân thủ quy định.
                </li>
                <li>
                  Nghiêm cấm sử dụng bất kỳ phần nào của trang web này với mục
                  đích thương mại hoặc nhân danh bất kỳ đối tác thứ ba nào nếu
                  không được chúng tôi cho phép bằng văn bản. Nếu vi phạm bất cứ
                  điều nào trong đây, chúng tôi sẽ hủy tài khoản của khách mà
                  không cần báo trước.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-black text-sv-brown mb-3">
                3. Ý kiến của khách hàng
              </h2>
              <p>
                Tất cả nội dung trang web và ý kiến phê bình của quý khách đều
                là tài sản của chúng tôi. Nếu chúng tôi phát hiện bất kỳ thông
                tin giả mạo nào, chúng tôi sẽ khóa tài khoản của quý khách ngay
                lập tức hoặc áp dụng các biện pháp khác theo quy định của pháp
                luật Việt Nam.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-sv-brown mb-3">
                4. Chấp nhận đơn hàng và giá cả
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Chúng tôi có quyền từ chối hoặc hủy đơn hàng của quý khách vì
                  bất kỳ lý do gì liên quan đến lỗi kỹ thuật, hệ thống một cách
                  khách quan vào bất kỳ lúc nào. Chúng tôi có thể hỏi thêm về số
                  điện thoại và địa chỉ trước khi nhận đơn hàng.
                </li>
                <li>
                  Chúng tôi cam kết sẽ cung cấp thông tin giá cả chính xác nhất
                  cho người tiêu dùng. Tuy nhiên, đôi lúc vẫn có sai sót xảy ra,
                  ví dụ như trường hợp giá sản phẩm không hiển thị chính xác
                  trên trang web hoặc sai giá, tùy theo từng trường hợp chúng
                  tôi sẽ liên hệ hướng dẫn hoặc thông báo hủy đơn hàng đó cho
                  quý khách. Chúng tôi cũng có quyền từ chối hoặc hủy bỏ bất kỳ
                  đơn hàng nào dù đơn hàng đó đã hay chưa được xác nhận hoặc đã
                  thanh toán.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-black text-sv-brown mb-3">
                5. Thương hiệu và bản quyền
              </h2>
              <p>
                Mọi quyền sở hữu trí tuệ (đã đăng ký hoặc chưa đăng ký), nội
                dung thông tin và tất cả các thiết kế, văn bản, đồ họa, phần
                mềm, hình ảnh, video, âm nhạc, âm thanh, biên dịch phần mềm, mã
                nguồn và phần mềm cơ bản đều là tài sản của chúng tôi. Toàn bộ
                nội dung của trang web được bảo vệ bởi luật bản quyền của Việt
                Nam và các công ước quốc tế. Bản quyền đã được bảo lưu.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-sv-brown mb-3">
                6. Quyền pháp lý
              </h2>
              <p>
                Các điều kiện, điều khoản và nội dung của trang web này được
                điều chỉnh bởi luật pháp Việt Nam và Tòa án có thẩm quyền tại
                Việt Nam sẽ giải quyết bất kỳ tranh chấp nào phát sinh từ việc
                sử dụng trái phép trang web này.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUsePage;
