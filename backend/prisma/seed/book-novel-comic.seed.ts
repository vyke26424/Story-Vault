import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';

export async function seedBookNovelComic(
  prisma: PrismaClient,
  categories: any[],
) {
  console.log('--- Bắt đầu tạo Books, Novels, và Comics ---');

  const randomPrice = () =>
    Math.floor(Math.random() * (200000 - 50000 + 1) + 50000);
  const getRandomCategories = () => {
    const shuffled = categories.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 1).map((c) => ({ id: c.id }));
  };

  const types = [
    { type: 'BOOK', name: 'Sách Nổi Tiếng', vols: 2, publisher: 'NXB Trẻ' },
    {
      type: 'NOVEL',
      name: 'Tiểu Thuyết KInh Điển',
      vols: 1,
      publisher: 'Nhã Nam',
    },
    {
      type: 'COMIC',
      name: 'Comic Siêu Anh Hùng',
      vols: 1,
      publisher: 'Marvel/DC',
    },
  ];

  for (const t of types) {
    for (let i = 1; i <= 20; i++) {
      const title = `${t.name} Số ${i}`;
      await prisma.series.create({
        data: {
          title: title,
          slug: slugify(title, { lower: true }) + '-' + Date.now(),
          description: `Mô tả cực kỳ lôi cuốn cho ${t.name} số ${i}.`,
          coverImage: `https://picsum.photos/seed/${t.type}${i}/400/600`,
          author: `Tác giả ${t.type} ${i}`,
          publisher: t.publisher,
          // Báo lỗi đỏ ở t.type là do TypeScript cẩn thận, ta ép kiểu (any) cho nhanh
          type: t.type as any,
          status: 'COMPLETED',
          totalVolumes: t.vols,
          categories: { connect: getRandomCategories() },
          volumes: {
            create: Array.from({ length: t.vols }).map((_, volIndex) => ({
              title: `${title} - Tập ${volIndex + 1}`,
              coverImage: `https://picsum.photos/seed/${t.type}vol${i}${volIndex}/400/600`,
              price: randomPrice(),
              stock: 20,
              isbn: `${t.type}-${Date.now()}-${i}-${volIndex}`,
              volumeNumber: volIndex + 1,
            })),
          },
        },
      });
    }
  }
}
