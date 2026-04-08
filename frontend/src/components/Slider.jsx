import React from 'react';

const Slider = ({ books }) => {
  return (
    <div className="relative w-full py-8">
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-end px-4 md:px-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-stone-800 tracking-tight">
            Khám Phá <span className="text-amber-600">Story Vault</span>
          </h2>
          <p className="text-stone-600 mt-2 text-lg">Tuyển tập Manga, Comic & Tiểu thuyết đỉnh cao nhất tuần này.</p>
        </div>
      </div>

      {/* Slider Container sử dụng CSS Snap */}
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 px-4 md:px-8 pb-8 scroll-smooth hide-scrollbar">
        {books.map((book) => (
          <div key={book.id} className="snap-center shrink-0 w-[280px] md:w-[320px] group cursor-pointer">
            <div className="bg-gradient-to-b from-amber-50 to-amber-100/80 rounded-2xl p-4 flex flex-col h-full border border-amber-200 shadow-sm group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300">
               <div className="overflow-hidden rounded-xl mb-4 shadow-md aspect-[2/3]">
                 <img 
                   src={book.image} 
                   alt={book.title} 
                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                 />
               </div>
               <h3 className="text-xl font-bold text-stone-800 line-clamp-1 mb-1" title={book.title}>
                 {book.title}
               </h3>
               <p className="text-amber-700 font-medium text-sm mb-4">{book.author}</p>
               
               <div className="mt-auto flex items-center justify-between">
                 <span className="text-xl font-black text-stone-800">${book.price.toFixed(2)}</span>
                 <button className="bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded-lg font-bold transition-colors shadow-sm">
                   Khám phá
                 </button>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slider;