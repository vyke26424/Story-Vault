import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/Home';
import LoginPage from './pages/LoginPage';
import SeriesDetailPage from './pages/SeriesDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ProtectedRoute from './components/ProtectedRoute';




const Layout = ({ children }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      {!isAuthPage && <Header />}
      
      {/* Nội dung các trang sẽ được render ở đây */}
      <main className="min-h-screen bg-sv-cream">
        {children}
      </main>

      {!isAuthPage && <Footer />}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/series/:slug" element={<SeriesDetailPage />} />
          <Route path="/cart" element={<CartPage />} />


          {/* CÁC TRANG CẦN BẢO VỆ SẼ ĐƯỢC BỌC BỞI <ProtectedRoute> */}
          <Route 
            path="/checkout" 
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            } 
          />

          
        </Routes>

        
      </Layout>
    </BrowserRouter>
  );
}

export default App;