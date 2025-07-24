
import React, { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';

// Import Pages
import LandingPage from './pages/shared/LandingPage';
import BuyerHomePage from './pages/buyer/HomePage';
import BuyerAuthPage from './pages/buyer/AuthPage';
import BuyerOrdersPage from './pages/buyer/OrdersPage';
import FarmerDashboardPage from './pages/farmer/DashboardPage';
import FarmerListingsPage from './pages/farmer/ListingsPage';
import FarmerOrdersPage from './pages/farmer/OrdersPage';
import FarmerAuthPage from './pages/farmer/AuthPage';
import NotFoundPage from './pages/shared/NotFoundPage';

// Import Layouts & Components
import BuyerNavbar from './components/layout/BuyerNavbar';
import FarmerSidebar from './components/layout/FarmerSidebar';
import FarmerNavbar from './components/layout/FarmerNavbar';
import Spinner from './components/common/Spinner';
import Cart from './components/buyer/Cart';

function App() {
  const [page, setPage] = useState('landing');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { isAuthenticated, user, loading } = useAuth();

  const onNavigate = (newPage) => setPage(newPage);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      if (page.startsWith('seller-')) {
        setPage('seller-auth');
      } else if (!['landing', 'auth', 'home'].includes(page)) {
        setPage('home');
      }
    }
  }, [isAuthenticated, loading, page]);
  
  const renderPage = () => {
    if (loading) return <Spinner fullScreen />;

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
      case 'home':
        return <BuyerHomePage onNavigate={onNavigate} />;
      case 'auth':
        if (isAuthenticated && user?.user_type === 'BUYER') {
          onNavigate('home');
          return null;
        }
        return <BuyerAuthPage onNavigate={onNavigate} />;
      case 'my-orders':
        // **THIS IS THE CHANGE**
        // Pass the onNavigate function to the Orders Page
        return isAuthenticated ? <BuyerOrdersPage onNavigate={onNavigate} /> : <BuyerAuthPage onNavigate={onNavigate} />;
      case 'landing':
        return <LandingPage onNavigate={onNavigate} />;
      default:
        return <NotFoundPage onNavigate={onNavigate} />;
    }
  };

  return (
    <div className="min-h-screen font-sans">
      {!page.startsWith('seller-') && page !== 'landing' && <BuyerNavbar onNavigate={onNavigate} onCartClick={() => setIsCartOpen(true)} />}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onNavigate={onNavigate} />
      {renderPage()}
    </div>
  );
}

export default App;
