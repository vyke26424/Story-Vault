import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Đang dọn dẹp dữ liệu cũ (để tránh lỗi trùng lặp)...');
  // Phải xóa theo thứ tự từ bảng con đến bảng cha để không dính lỗi Ràng buộc khóa ngoại
  await prisma.inventoryTransaction.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.volume.deleteMany();
  await prisma.review.deleteMany();
  await prisma.series.deleteMany();
  await prisma.category.deleteMany();

  console.log('🌱 Đang tạo Danh mục (Categories)...');
  const catManga = await prisma.category.create({
    data: { name: 'Manga / Comic', slug: 'manga-comic' },
  });
  const catBook = await prisma.category.create({
    data: { name: 'Sách Văn Học', slug: 'sach-van-hoc' },
  });

  // HÀM PHỤ TRỢ: Tự động sinh Truyện và số lượng Tập (Volumes) mong muốn
  const createSeriesWithVolumes = async (
    title: string,
    slug: string,
    type: any,
    categoryId: string,
    volCount: number,
  ) => {
    // 1. Tạo Đầu Truyện
    const series = await prisma.series.create({
      data: {
        title: title,
        slug: slug,
        type: type,
        status: 'ONGOING',
        categoryId: categoryId,
        description: `Đây là mô tả mẫu cho bộ ${title}. Truyện này có tổng cộng ${volCount} tập đang được bán.`,
        // Dùng Picsum sinh ảnh ngẫu nhiên theo tên truyện
        coverImage: `https://picsum.photos/seed/${slug}/400/600`,
        author: 'Tác giả ẩn danh',
        publisher: 'NXB Kim Đồng',
      },
    });

    // 2. Dùng vòng lặp tạo ra N tập truyện
    const volumesData = Array.from({ length: volCount }).map((_, index) => {
      const volNum = index + 1;
      return {
        seriesId: series.id,
        title: `${title} - Tập ${volNum}`,
        // Ảnh từng tập sẽ khác nhau một chút
        coverImage: `https://picsum.photos/seed/${slug}-vol${volNum}/400/600`,
        price: 35000 + Math.floor(Math.random() * 5) * 5000, // Giá ngẫu nhiên từ 35k - 55k
        originalPrice: 60000,
        stock: Math.floor(Math.random() * 100) + 10, // Tồn kho ngẫu nhiên 10 - 100 cuốn
        isbn: `978-000-${series.id.slice(0, 4)}-${volNum}`, // Sinh mã ISBN giả
        isActive: true,
      };
    });

    await prisma.volume.createMany({ data: volumesData });
    console.log(`  + Đã tạo xong bộ [${title}] với ${volCount} tập.`);
  };

  console.log('🌱 Đang tạo 3 Truyện tranh (Manga)...');
  await createSeriesWithVolumes(
    'Naruto Truyền Kỳ',
    'naruto',
    'MANGA',
    catManga.id,
    17,
  ); // Bộ 17 tập
  await createSeriesWithVolumes(
    'Thám Tử Conan',
    'conan',
    'COMIC',
    catManga.id,
    5,
  ); // Bộ 5 tập
  await createSeriesWithVolumes(
    'Jujutsu Kaisen',
    'jujutsu-kaisen',
    'MANGA',
    catManga.id,
    3,
  ); // Bộ 3 tập

  console.log('🌱 Đang tạo 5 Sách văn học...');
  for (let i = 1; i <= 5; i++) {
    // Sách thường chỉ có 1 tập
    await createSeriesWithVolumes(
      `Đắc Nhân Tâm - Phần ${i}`,
      `dac-nhan-tam-${i}`,
      'BOOK',
      catBook.id,
      1,
    );
  }

  console.log('✅ Hoàn tất gieo mầm dữ liệu!');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi khi gieo mầm:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
