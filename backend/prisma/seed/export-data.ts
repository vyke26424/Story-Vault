import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('⏳ Đang bắt đầu hút dữ liệu...\n');

  // ==========================================
  // 1. Xuất dữ liệu bảng Series
  // ==========================================
  console.log('⏳ Đang hút dữ liệu bảng Series...');
  const allSeries = await prisma.series.findMany();
  const seriesJsonData = JSON.stringify(allSeries, null, 2);
  const seriesFilePath = path.join(__dirname, 'series-seed.json');
  fs.writeFileSync(seriesFilePath, seriesJsonData);
  console.log(`✅ Hút thành công ${allSeries.length} bộ truyện!`);
  console.log(`📁 File Series lưu tại: ${seriesFilePath}\n`);

  // ==========================================
  // 2. Xuất dữ liệu bảng Category
  // ==========================================
  console.log('⏳ Đang hút dữ liệu bảng Category...');
  const allCategories = await prisma.category.findMany();
  const categoryJsonData = JSON.stringify(allCategories, null, 2);
  const categoryFilePath = path.join(__dirname, 'category-seed.json');
  fs.writeFileSync(categoryFilePath, categoryJsonData);
  console.log(`✅ Hút thành công ${allCategories.length} danh mục!`);
  console.log(`📁 File Category lưu tại: ${categoryFilePath}\n`);

  // ==========================================
  // 3. Xuất dữ liệu bảng Volume
  // ==========================================
  console.log('⏳ Đang hút dữ liệu bảng Volume...');
  const allVolumes = await prisma.volume.findMany();
  
  // Lưu ý: Ép kiểu Decimal về Number nếu cần thiết để JSON hiển thị đẹp hơn
  const formattedVolumes = allVolumes.map(vol => ({
    ...vol,
    price: Number(vol.price),
    originalPrice: vol.originalPrice ? Number(vol.originalPrice) : null
  }));

  const volumeJsonData = JSON.stringify(formattedVolumes, null, 2);
  const volumeFilePath = path.join(__dirname, 'volume-seed.json');
  fs.writeFileSync(volumeFilePath, volumeJsonData);
  console.log(`✅ Hút thành công ${allVolumes.length} tập truyện!`);
  console.log(`📁 File Volume lưu tại: ${volumeFilePath}\n`);

  console.log('🎉 Hoàn tất quá trình xuất dữ liệu cho cả 3 bảng!');
}

main()
  .catch((e) => {
    console.error('❌ Có lỗi xảy ra:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });