import { PrismaClient, Category } from '@prisma/client';
import slugify from 'slugify';

export async function seedCategories(prisma: PrismaClient) {
  console.log('--- Đang dọn dẹp Database cũ ---');
  // Xóa theo thứ tự để không dính khóa ngoại
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

  console.log('--- Bắt đầu tạo Thể loại ---');
  const categoryNames = [
    'Hành Động',
    'Phiêu Lưu',
    'Kinh Dị',
    'Hài Hước',
    'Trinh Thám',
    'Tình Cảm',
    'Viễn Tưởng',
    'Kỳ Ảo',
    'Học Đường',
    'Đời Thường',
  ];

  const categories: Category[] = [];
  for (const name of categoryNames) {
    const cat = await prisma.category.create({
      data: {
        name: name,
        slug: slugify(name, { lower: true, locale: 'vi' }),
        description: `Mô tả cho thể loại ${name}`,
      },
    });
    categories.push(cat);
  }
  return categories;
}
