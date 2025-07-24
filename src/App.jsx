// src/App.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import LandingPage from './pages/shared/LandingPage';
import ContactUs from './pages/shared/ContactUs';
import BuyerLandingPage from './pages/buyer/BuyerLandingPage';
import FarmerLandingPage from './pages/farmer/FarmerLandingPage';
import BuyerHomePage from './pages/buyer/HomePage';
import BuyerAuthPage from './pages/buyer/AuthPage';
import BuyerOrdersPage from './pages/buyer/OrdersPage';
import FarmerDashboardPage from './pages/farmer/DashboardPage';
import FarmerListingsPage from './pages/farmer/ListingsPage';
import FarmerOrdersPage from './pages/farmer/OrdersPage';
import FarmerAuthPage from './pages/farmer/AuthPage';
import NotFoundPage from './pages/shared/NotFoundPage';
import BuyerNavbar from './components/layout/BuyerNavbar';
import FarmerSidebar from './components/layout/FarmerSidebar';
import FarmerNavbar from './components/layout/FarmerNavbar';
import Spinner from './components/common/Spinner';
import Cart from './components/buyer/Cart';

function App() {
  const [page, setPage] = useState('landing');
  const [redirecting, setRedirecting] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { isAuthenticated, user, loading } = useAuth();

  const onNavigate = (newPage) => {
    setRedirecting(true);
    setPage(newPage);
  };

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      if (page.startsWith('seller-')) {
        setPage('seller-auth');
      } else if (
        !['landing', 'landing-buyer', 'landing-farmer', 'auth', 'home', 'contact'].includes(page)
      ) {
        setPage('home');
      }
    }
  }, [isAuthenticated, loading, page]);

  useEffect(() => {
    if (redirecting) {
      const timeout = setTimeout(() => setRedirecting(false), 50);
      return () => clearTimeout(timeout);
    }
  }, [page, redirecting]);

  const renderPage = () => {
    if (loading || redirecting) return <Spinner fullScreen />;

    if (page.startsWith('seller-')) {
      if (!isAuthenticated || user?.user_type !== 'FARMER') {
        return <FarmerAuthPage onNavigate={onNavigate} />;
      }
      return (
        <div className="flex h-screen bg-gray-100">
          <FarmerSidebar onNavigate={onNavigate} currentPage={page} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <FarmerNavbar onNavigate={onNavigate} />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
              {page === 'seller-dashboard' && <FarmerDashboardPage />}
              {page === 'seller-listings' && <FarmerListingsPage />}
              {page === 'seller-orders' && <FarmerOrdersPage />}
            </main>
          </div>
        </div>
      );
    }

    switch (page) {
      case 'landing':
        return <LandingPage onNavigate={onNavigate} />;
      case 'landing-buyer':
        return <BuyerLandingPage onNavigate={onNavigate} />;
      case 'landing-farmer':
        return <FarmerLandingPage onNavigate={onNavigate} />;
      case 'home':
        return <BuyerHomePage onNavigate={onNavigate} />;
      case 'auth':
        if (isAuthenticated && user?.user_type === 'BUYER') {
          onNavigate('home');
          return null;
        }
        return <BuyerAuthPage onNavigate={onNavigate} />;
      case 'my-orders':
        return isAuthenticated ? (
          <BuyerOrdersPage onNavigate={onNavigate} />
        ) : (
          <BuyerAuthPage onNavigate={onNavigate} />
        );
      case 'contact':
        return <ContactUs />;
      default:
        return <NotFoundPage onNavigate={onNavigate} />;
    }
  };

  return (
    <div className="min-h-screen font-sans">
      {!page.startsWith('seller-') &&
        !page.startsWith('landing') &&
        <BuyerNavbar onNavigate={onNavigate} onCartClick={() => setIsCartOpen(true)} />
      }
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onNavigate={onNavigate} />
      {renderPage()}
    </div>
  );
}

export default App;
