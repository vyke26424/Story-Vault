import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

describe('CategoryController (e2e)', () => {
  let app: INestApplication;

  const mockPrismaService = {
    category: {
      count: jest.fn().mockResolvedValue(2), // Giả lập tổng số lượng là 2
      findMany: jest.fn().mockResolvedValue([
        {
          id: 'cat-1',
          name: 'Manga',
          slug: 'manga',
          description: 'Truyện tranh Nhật Bản',
        },
        {
          id: 'cat-2',
          name: 'Comic',
          slug: 'comic',
          description: 'Truyện tranh Âu Mỹ',
        },
      ]),
    },
  };

  // Khởi tạo ứng dụng ảo (Mock Application) trước khi chạy test
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      // Ghi đè PrismaService thật bằng DB giả lập của ta ở trên
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // Đóng ứng dụng sau khi test xong để giải phóng bộ nhớ
  afterAll(async () => {
    await app.close();
  });

  it('/category (GET) - Lấy danh sách thể loại thành công', () => {
    return request(app.getHttpServer()) // Bắn Mock Request vào server ảo
      .get('/category')
      .expect(200) // Kỳ vọng mã trạng thái HTTP là 200 (OK)
      .expect((res) => {
        // Kỳ vọng dữ liệu trả về phải khớp với DB giả lập
        expect(res.body.message).toEqual('Lấy toàn bộ category thành công');
        expect(res.body.data).toBeDefined();
        expect(res.body.data).toHaveLength(2); // Kỳ vọng có đúng 2 thể loại
        expect(res.body.data[0].name).toEqual('Manga'); // Thể loại đầu tiên phải là Manga
      });
  });
});
