import { PrismaClient } from '@prisma/client';
import { seedCategories } from '../seed/category.seed';
import { seedMangaAndLN } from '../seed/manga-ln.seed';
import { seedBookNovelComic } from '../seed/book-novel-comic.seed';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Bắt đầu quá trình Seeding Dữ Liệu...');

  // 1. Chạy seed Thể loại trước và lấy danh sách id để nhét vào truyện
  const categories = await seedCategories(prisma);

  // 2. Chạy seed Manga & Light Novel
  await seedMangaAndLN(prisma, categories);

  // 3. Chạy seed Book, Novel, Comic
  await seedBookNovelComic(prisma, categories);

  console.log(
    '✅ SEEDING HOÀN TẤT THÀNH CÔNG! Đã có 50 Bộ Truyện và Sách các loại.',
  );
}

main()
  .catch((e) => {
    console.error('❌ Lỗi khi Seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
