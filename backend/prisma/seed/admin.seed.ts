import { PrismaClient, Role } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const rawPassword: string = process.env.ADMIN_PASS!;
  const adminName: string = process.env.ADMIN_NAME!;
  const hashPassword = await argon2.hash(rawPassword);

  const adminUser = await prisma.user.upsert({
    where: { email: adminName },
    update: {
      password: hashPassword,
      role: Role.ADMIN,
    },
    create: {
      email: adminName,
      name: 'Nguyễn Lê Tứ',
      password: hashPassword,
      role: Role.ADMIN,
    },
  });
  console.log('Tạo admin thành công');
}

main()
  .catch((e) => {
    console.error('Thất bại:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
