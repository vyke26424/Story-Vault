import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Đang bắt đầu gieo mầm dữ liệu (Seeding)...');

  // Xóa dữ liệu cũ (nếu có) để tránh lỗi trùng lặp khi chạy lệnh nhiều lần
  await prisma.volume.deleteMany();
  await prisma.series.deleteMany();
  await prisma.category.deleteMany();

  // 1. TẠO DANH MỤC (CATEGORY)
  const shounen = await prisma.category.create({
    data: {
      name: 'Shounen',
      slug: 'shounen',
      description: 'Truyện tranh dành cho thiếu niên',
    },
  });

  const seinen = await prisma.category.create({
    data: {
      name: 'Seinen',
      slug: 'seinen',
      description: 'Truyện tranh dành cho thanh niên',
    },
  });

  // 2. TẠO ĐẦU TRUYỆN (SERIES)
  const onePiece = await prisma.series.create({
    data: {
      title: 'One Piece',
      slug: 'one-piece',
      description:
        'Hành trình trở thành Vua Hải Tặc của Monkey D. Luffy và băng Mũ Rơm.',
      coverImage:
        'https://m.media-amazon.com/images/I/81q1XwZ1R9L._AC_UF1000,1000_QL80_.jpg',
      author: 'Eiichiro Oda',
      publisher: 'Kim Đồng',
      type: 'MANGA',
      status: 'ONGOING',
      categoryId: shounen.id,
    },
  });

  const soloLeveling = await prisma.series.create({
    data: {
      title: 'Solo Leveling',
      slug: 'solo-leveling',
      description:
        'Hành trình thăng cấp từ thợ săn yếu nhất thế giới của Sung Jin-Woo.',
      coverImage:
        'https://m.media-amazon.com/images/I/71rI1lXUjKL._AC_UF1000,1000_QL80_.jpg',
      author: 'Chu-Gong',
      publisher: 'IPM',
      type: 'COMIC',
      status: 'COMPLETED',
      categoryId: seinen.id,
    },
  });

  // 3. TẠO CÁC TẬP TRUYỆN (VOLUMES)
  await prisma.volume.createMany({
    data: [
      {
        seriesId: onePiece.id,
        title: 'One Piece - Tập 1: Romance Dawn',
        coverImage:
          'https://m.media-amazon.com/images/I/81q1XwZ1R9L._AC_UF1000,1000_QL80_.jpg',
        price: 25000,
        originalPrice: 25000,
        stock: 100,
        isbn: '978-4-08-872509-3',
      },
      {
        seriesId: onePiece.id,
        title: 'One Piece - Tập 2: Versus!! Băng Hải Tặc Buggy',
        coverImage:
          'https://m.media-amazon.com/images/I/817qGZkE4FL._AC_UF1000,1000_QL80_.jpg',
        price: 25000,
        originalPrice: 25000,
        stock: 80,
        isbn: '978-4-08-872544-4',
      },
      {
        seriesId: soloLeveling.id,
        title: 'Solo Leveling - Tập 1',
        coverImage:
          'https://m.media-amazon.com/images/I/71rI1lXUjKL._AC_UF1000,1000_QL80_.jpg',
        price: 145000,
        originalPrice: 150000,
        stock: 50,
        isbn: '978-1-9753-1927-4',
      },
    ],
  });

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
