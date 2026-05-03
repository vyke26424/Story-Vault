import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Bắt đầu quá trình Seeding Dữ Liệu từ file JSON...');

  // 1. Chỉ định đường dẫn tới các file JSON
  const categoryPath = path.join(__dirname, 'category-seed.json');
  const seriesPath = path.join(__dirname, 'series-seed.json');
  const volumePath = path.join(__dirname, 'volume-seed.json');

  // 2. Đọc và parse dữ liệu JSON
  const categoriesData = JSON.parse(fs.readFileSync(categoryPath, 'utf8'));
  const seriesData = JSON.parse(fs.readFileSync(seriesPath, 'utf8'));
  const volumesData = JSON.parse(fs.readFileSync(volumePath, 'utf8'));

  // 3. Dọn dẹp Database cũ (để tránh lỗi trùng lặp ID hoặc dính khóa ngoại)
  console.log('🧹 Đang dọn dẹp Database cũ...');
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.inventoryTransaction.deleteMany();
  await prisma.volume.deleteMany();
  await prisma.series.deleteMany();
  await prisma.category.deleteMany();

  // 4. Nhập dữ liệu Thể loại (Category)
  console.log(`⏳ Đang nhập ${categoriesData.length} Danh mục...`);
  await prisma.category.createMany({
    data: categoriesData,
  });

  // 5. Nhập dữ liệu Bộ truyện (Series)
  console.log(`⏳ Đang nhập ${seriesData.length} Bộ truyện...`);
  await prisma.series.createMany({
    data: seriesData,
  });

  // Vì Series và Category có quan hệ Nhiều-Nhiều, file JSON xuất ra không chứa bảng trung gian.
  // Ta sẽ chạy một vòng lặp nhỏ để kết nối ngẫu nhiên 1-2 thể loại cho mỗi bộ truyện.
  console.log(`🔗 Đang kết nối Thể loại vào Bộ truyện...`);
  for (const series of seriesData) {
    const shuffledCats = [...categoriesData].sort(() => 0.5 - Math.random()).slice(0, 2);
    await prisma.series.update({
      where: { id: series.id },
      data: {
        categories: {
          connect: shuffledCats.map(c => ({ id: c.id }))
        }
      }
    });
  }

  // 6. Nhập dữ liệu Tập truyện (Volume)
  console.log(`⏳ Đang nhập ${volumesData.length} Tập truyện...`);
  await prisma.volume.createMany({
    data: volumesData,
  });

  console.log('✅ SEEDING HOÀN TẤT THÀNH CÔNG TỪ FILE JSON!');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi khi Seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });