import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  Home,
  BookOpen,
  Target,
  Heart,
  Award,
} from "lucide-react";

const AboutUsPage = () => {
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
          <span className="text-sv-brown">Giới thiệu Story Vault</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-sv-tan">
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-sv-pale rounded-full flex items-center justify-center mx-auto mb-6 text-sv-brown border border-sv-tan">
              <BookOpen size={40} />
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-sv-brown mb-4 tracking-tight">
              Về Story Vault
            </h1>
            <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto">
              Hành trình lan tỏa tri thức và kiến tạo không gian văn hóa đọc
              hàng đầu tại Việt Nam.
            </p>
          </div>

          {/* Phần 1: Giới thiệu chung */}
          <div className="flex flex-col md:flex-row gap-8 items-center mb-16">
            <div className="w-full md:w-1/2">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Nhà sách Story Vault"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 space-y-4 text-gray-700 leading-relaxed font-medium">
              <h2 className="text-2xl font-black text-sv-brown mb-4">
                Câu Chuyện Của Chúng Tôi
              </h2>
              <p>
                Được thành lập với khát vọng mang đến một không gian văn hóa đọc
                hiện đại,{" "}
                <strong>Công ty Cổ phần Phát hành Sách Story Vault</strong> đã
                và đang từng bước khẳng định vị thế là một trong những doanh
                nghiệp hàng đầu ngành phát hành sách tại Việt Nam.
              </p>
              <p>
                Chúng tôi không ngừng đổi mới, hiện đại hóa mô hình kinh doanh,
                phát triển chuỗi Nhà sách chuyên nghiệp hiện đại song song với
                việc đẩy mạnh trang thương mại điện tử, nhằm mang đến cho bạn
                đọc những trải nghiệm văn hóa chất lượng, thân thiện và tiện lợi
                nhất.
              </p>
            </div>
          </div>

          {/* Phần 2: Tầm nhìn & Sứ mệnh (Dạng Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-sv-pale/50 p-8 rounded-2xl border border-sv-tan hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-amber-600 mb-4 shadow-sm">
                <Target size={24} />
              </div>
              <h3 className="text-xl font-black text-sv-brown mb-3">
                Tầm Nhìn
              </h3>
              <p className="text-gray-700 font-medium leading-relaxed">
                Trở thành hệ sinh thái văn hóa tri thức số 1 Việt Nam, nơi hội
                tụ tinh hoa tri thức nhân loại và là điểm đến yêu thích của mọi
                thế hệ độc giả. Chúng tôi hướng tới việc xây dựng mạng lưới nhà
                sách rộng khắp và sàn thương mại điện tử hiện đại, vươn tầm khu
                vực.
              </p>
            </div>

            <div className="bg-sv-pale/50 p-8 rounded-2xl border border-sv-tan hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-amber-600 mb-4 shadow-sm">
                <Heart size={24} />
              </div>
              <h3 className="text-xl font-black text-sv-brown mb-3">Sứ Mệnh</h3>
              <p className="text-gray-700 font-medium leading-relaxed">
                Với sứ mệnh{" "}
                <strong>"Lan tỏa tri thức – phục vụ cộng đồng"</strong>, Story
                Vault không chỉ là điểm đến của hàng triệu độc giả mỗi năm, mà
                còn là nhịp cầu văn hóa kết nối Việt Nam với thế giới, góp phần
                xây dựng một xã hội học tập, nhân văn và phát triển bền vững.
              </p>
            </div>
          </div>

          {/* Phần 3: Những con số ấn tượng */}
          <div className="text-center">
            <h2 className="text-2xl font-black text-sv-brown mb-8 flex items-center justify-center gap-2">
              <Award className="text-amber-500" size={28} /> Dấu ấn Story Vault
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-6 border border-sv-tan rounded-2xl">
                <p className="text-4xl font-black text-sv-brown mb-2">140+</p>
                <p className="text-sm text-gray-500 font-bold uppercase">
                  Nhà sách toàn quốc
                </p>
              </div>
              <div className="p-6 border border-sv-tan rounded-2xl">
                <p className="text-4xl font-black text-sv-brown mb-2">10M+</p>
                <p className="text-sm text-gray-500 font-bold uppercase">
                  Khách hàng tin dùng
                </p>
              </div>
              <div className="p-6 border border-sv-tan rounded-2xl">
                <p className="text-4xl font-black text-sv-brown mb-2">50k+</p>
                <p className="text-sm text-gray-500 font-bold uppercase">
                  Tựa sách đa dạng
                </p>
              </div>
              <div className="p-6 border border-sv-tan rounded-2xl">
                <p className="text-4xl font-black text-sv-brown mb-2">24/7</p>
                <p className="text-sm text-gray-500 font-bold uppercase">
                  Hỗ trợ trực tuyến
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
