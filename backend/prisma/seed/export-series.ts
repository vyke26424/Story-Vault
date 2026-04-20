import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('⏳ Đang hút dữ liệu bảng Series...');

  // 1. Lấy toàn bộ dữ liệu từ bảng Series
  const allSeries = await prisma.series.findMany();

  // 2. Chuyển thành chuỗi JSON đẹp mắt
  const jsonData = JSON.stringify(allSeries, null, 2);

  // 3. Ghi ra một file tên là 'series-seed.json' nằm ngay trong thư mục prisma
  const filePath = path.join(__dirname, 'series-seed.json');
  fs.writeFileSync(filePath, jsonData);

  console.log(`✅ Hút thành công ${allSeries.length} bộ truyện!`);
  console.log(`📁 File được lưu tại: ${filePath}`);
}

main()
  .catch((e) => {
    console.error('❌ Có lỗi xảy ra:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
