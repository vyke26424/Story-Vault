import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';

export async function seedMangaAndLN(prisma: PrismaClient, categories: any[]) {
  console.log(
    '--- Bắt đầu tạo Manga (10 Bộ x 5 Tập) & Light Novel (10 Bộ x 2 Tập) ---',
  );

  const randomPrice = () =>
    Math.floor(Math.random() * (150000 - 30000 + 1) + 30000);
  const getRandomCategories = () => {
    const shuffled = categories.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 2).map((c) => ({ id: c.id })); // Lấy ngẫu nhiên 2 thể loại
  };

  // 1. Tạo 10 Manga
  for (let i = 1; i <= 10; i++) {
    const title = `Manga Siêu Phẩm Số ${i}`;
    await prisma.series.create({
      data: {
        title: title,
        slug: slugify(title, { lower: true }) + '-' + Date.now(),
        description: `Đây là một siêu phẩm Manga số ${i} cực kỳ hấp dẫn đang chờ bạn khám phá.`,
        coverImage: `https://picsum.photos/seed/manga${i}/400/600`, // Ảnh ngẫu nhiên
        author: `Tác giả Manga ${i}`,
        publisher: 'NXB Kim Đồng',
        type: 'MANGA',
        status: 'ONGOING',
        totalVolumes: 5,
        categories: { connect: getRandomCategories() },
        volumes: {
          create: Array.from({ length: 5 }).map((_, volIndex) => ({
            title: `${title} - Tập ${volIndex + 1}`,
            coverImage: `https://picsum.photos/seed/mangavol${i}${volIndex}/400/600`,
            price: randomPrice(),
            originalPrice: randomPrice() + 20000,
            stock: 20, // Tồn kho cố định 20
            isbn: `MG-${Date.now()}-${i}-${volIndex}`,
            volumeNumber: volIndex + 1,
          })),
        },
      },
    });
  }

  // 2. Tạo 10 Light Novel
  for (let i = 1; i <= 15; i++) {
    const title = `Light Novel Tuyệt Đỉnh ${i}`;
    await prisma.series.create({
      data: {
        title: title,
        slug: slugify(title, { lower: true }) + '-' + Date.now(),
        description: `Câu chuyện phiêu lưu kỳ thú trong thế giới Light Novel số ${i}.`,
        coverImage: `https://picsum.photos/seed/ln${i}/400/600`,
        author: `Tác giả LN ${i}`,
        publisher: 'NXB IPM',
        type: 'LIGHT_NOVEL',
        status: 'COMPLETED',
        totalVolumes: 2,
        categories: { connect: getRandomCategories() },
        volumes: {
          create: Array.from({ length: 2 }).map((_, volIndex) => ({
            title: `${title} - Tập ${volIndex + 1}`,
            coverImage: `https://picsum.photos/seed/lnvol${i}${volIndex}/400/600`,
            price: randomPrice(),
            stock: 20,
            isbn: `LN-${Date.now()}-${i}-${volIndex}`,
            volumeNumber: volIndex + 1,
          })),
        },
      },
    });
  }
}
