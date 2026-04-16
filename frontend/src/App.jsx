import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/Home';
import LoginPage from './pages/LoginPage';
import SeriesDetailPage from './pages/SeriesDetailPage';

const Layout = ({ children }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      {!isAuthPage && <Header />}
      
      {/* Nội dung các trang sẽ được render ở đây */}
      <main className="min-h-screen">
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
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;