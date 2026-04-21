import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

describe('Kiểm thử tương tranh Đơn hàng - Race Condition (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    // Dọn dẹp data test và đóng app
    await prisma.payment.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.address.deleteMany();
    await prisma.inventoryTransaction.deleteMany();
    await app.close();
  });

  it('Hai khách hàng cùng mua 1 sản phẩm cuối cùng: Chỉ 1 người được duyệt, kho không bị âm', async () => {
    // 1. CHUẨN BỊ DATA: Set cứng số lượng tồn kho của 1 cuốn sách (VOL_123) về đúng 1 cuốn
    const testVolumeId = 'VOL_123'; // Thay bằng ID volume thật của sếp nếu cần
    await prisma.volume.update({
      where: { id: testVolumeId },
      data: { stock: 1 },
    });

    // 2. TẠO 2 REQUEST GIẢ LẬP
    // Chú ý: Sếp cần thay 'Bearer Token_Cua_A' bằng token thật hoặc dùng hàm sinh token giả
    const requestKhachA = request(app.getHttpServer())
      .post('/order') // Đã sửa thành /order
      .set('Authorization', `Bearer Token_Khach_A`)
      .send({
        phone: '0901234567',
        street: '123 Đường A',
        ward: 'Phường B',
        district: 'Quận C',
        city: 'TP HCM',
        totalAmount: 100000,
        shippingFee: 15000,
        finalAmount: 115000,
        paymentMethod: 'COD',
        items: [{ volumeId: testVolumeId, quantity: 1, price: 100000 }],
      });

    const requestKhachB = request(app.getHttpServer())
      .post('/order')
      .set('Authorization', `Bearer Token_Khach_B`)
      .send({
        phone: '0987654321',
        street: '456 Đường X',
        ward: 'Phường Y',
        district: 'Quận Z',
        city: 'Hà Nội',
        totalAmount: 100000,
        shippingFee: 15000,
        finalAmount: 115000,
        paymentMethod: 'COD',
        items: [{ volumeId: testVolumeId, quantity: 1, price: 100000 }],
      });

    // 3. THỰC THI: Phóng cả 2 request cùng 1 thời điểm (Tính bằng mili-giây)
    const [responseA, responseB] = await Promise.all([
      requestKhachA,
      requestKhachB,
    ]);

    // 4. KỲ VỌNG (ASSERTIONS):
    // Phải có 1 người thành công (Status 201) và 1 người thất bại (Status 400 hoặc 409)
    const statuses = [responseA.status, responseB.status];
    expect(statuses).toContain(201); // Ít nhất 1 cái tạo đơn thành công

    // Nếu API của sếp trả về 400 BadRequest khi hết hàng, test sẽ bắt lỗi ở đây
    const hasFailedRequest = statuses.includes(400) || statuses.includes(409);
    expect(hasFailedRequest).toBe(true);

    // 5. KIỂM TRA CHÉO DATABASE: Tuyệt đối kho (stock) không được rớt xuống -1
    const checkVolume = await prisma.volume.findUnique({
      where: { id: testVolumeId },
    });

    expect(checkVolume.stock).toBeGreaterThanOrEqual(0); // Kho lớn hơn hoặc bằng 0
    expect(checkVolume.stock).toBe(0); // Vì có 1 cuốn, mua xong phải về 0
  });
});
