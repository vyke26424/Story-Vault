import React from "react";
import { Link } from "react-router-dom";
import { MapPinOff, Home } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-sv-cream flex flex-col items-center justify-center p-6 font-nunito text-center">
      <div className="text-amber-500 mb-6 animate-bounce">
        <MapPinOff size={100} strokeWidth={1.5} />
      </div>
      <h1 className="text-7xl sm:text-9xl font-black text-sv-brown mb-4 drop-shadow-md">
        404
      </h1>
      <h2 className="text-2xl sm:text-3xl font-bold text-stone-800 mb-4">
        Lạc đường rồi bạn ơi!
      </h2>
      <p className="text-stone-500 font-medium max-w-md mb-8 leading-relaxed">
        Trang đang tìm kiếm không tồn tại, đã bị xóa.
      </p>
      <Link
        to="/"
        className="bg-sv-brown hover:bg-opacity-90 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md flex items-center gap-2 hover:scale-105 active:scale-95"
      >
        <Home size={20} /> Quay Về Trang Chủ
      </Link>
    </div>
  );
};

export default NotFoundPage;
