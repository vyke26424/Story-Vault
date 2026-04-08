import { useState, useEffect } from 'react';

// Dữ liệu giả lập (Mock Data) - Cập nhật đầy đủ Category
const MOCK_BOOKS = [
  { id: 1, title: "One Piece - Tập 100", author: "Eiichiro Oda", price: 5.99, image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=400&q=80", isHot: true, category: "manga" },
  { id: 2, title: "Solo Leveling - Vol 1", author: "Chugong", price: 14.50, image: "https://images.unsplash.com/photo-1560942485-b2a11cc13456?auto=format&fit=crop&w=400&q=80", isHot: true, category: "manhwa" },
  { id: 3, title: "Jujutsu Kaisen - Tập 0", author: "Gege Akutami", price: 6.50, image: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&w=400&q=80", isHot: true, category: "manga" },
  { id: 4, title: "Harry Potter", author: "J.K. Rowling", price: 20.00, image: "https://images.unsplash.com/photo-1618666012174-83b441c0bc76?auto=format&fit=crop&w=400&q=80", isHot: true, category: "novel" },
  { id: 5, title: "Spy x Family - Tập 1", author: "Tatsuya Endo", price: 5.99, image: "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?auto=format&fit=crop&w=400&q=80", isHot: false, category: "manga" },
  { id: 6, title: "Attack on Titan", author: "Hajime Isayama", price: 7.99, image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=400&q=80", isHot: true, category: "manga" },
  { id: 7, title: "Nhà Giả Kim", author: "Paulo Coelho", price: 12.00, image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=400&q=80", isHot: false, category: "novel" },
  { id: 8, title: "Demon Slayer", author: "Koyoharu Gotouge", price: 6.99, image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=400&q=80", isHot: true, category: "manga" },
  { id: 9, title: "Batman: Year One", author: "Frank Miller", price: 16.50, image: "https://images.unsplash.com/photo-1608889175123-8ee362201f81?auto=format&fit=crop&w=400&q=80", isHot: false, category: "comic" },
  { id: 10, title: "The Witcher", author: "Andrzej Sapkowski", price: 15.99, image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80", isHot: false, category: "novel" },
];

// Hook 1: Dùng cho Trang chủ và Trang Danh mục (Lấy danh sách)
export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = setTimeout(() => {
      setProducts(MOCK_BOOKS);
      setIsLoading(false);
    }, 500); 
    return () => clearTimeout(fetchProducts);
  }, []);

  const hotProducts = products.filter(product => product.isHot);

  return { products, hotProducts, isLoading };
};

// Hook 2: Dùng cho Trang Chi tiết Sản phẩm (Lấy 1 cuốn sách + Bổ sung thêm Volumes, Reviews)
export const useProduct = (productId) => {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const fetchProduct = setTimeout(() => {
      const foundProduct = MOCK_BOOKS.find(p => p.id === parseInt(productId));
      
      if (foundProduct) {
        // Trộn data cơ bản với các thông tin chi tiết ảo
        setProduct({
          ...foundProduct,
          description: "Đây là một trong những tác phẩm được yêu thích nhất mọi thời đại. Câu chuyện đưa bạn vào một thế giới kỳ ảo với những cuộc phiêu lưu nghẹt thở, những bài học sâu sắc về tình bạn, lòng dũng cảm và ý chí kiên cường.",
          publisher: "NXB Kim Đồng",
          pages: 192,
          stock: 15,
          volumes: ["Tập 1", "Tập 2", "Tập 3", "Tập 4", "Tập 5"],
          reviews: [
            { id: 1, user: "Minh Tuấn", rating: 5, date: "12/04/2026", comment: "Sách bọc màng co cẩn thận, giao hàng nhanh. Nội dung tập này bánh cuốn quá!" },
            { id: 2, user: "Hải Yến", rating: 4, date: "10/04/2026", comment: "Chất lượng giấy in rất tốt, nhưng giá hơi cao xíu." }
          ]
        });
      }
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(fetchProduct);
  }, [productId]);

  return { product, isLoading };
};