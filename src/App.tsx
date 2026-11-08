import React, { useEffect } from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { Hero } from './components/customer/Hero';
import { Benefits } from './components/customer/Benefits';
import { Campaigns } from './components/customer/Campaigns';
import { PopularDestinations } from './components/customer/PopularDestinations';
import { FlightResults } from './components/customer/FlightResults';
import { PassengerForm } from './components/customer/PassengerForm';
import { SeatMap } from './components/customer/SeatMap';
import { CheckoutModal } from './components/customer/CheckoutModal';
import { BookingConfirmation } from './components/customer/BookingConfirmation';
import { ManageBooking } from './components/customer/ManageBooking';
import { AccountView } from './components/customer/AccountView';
import { CheckinView } from './components/customer/CheckinView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { FlightDetailsModal } from './components/customer/FlightDetailsModal';
import { AuthModal } from './components/common/AuthModal';
import { NewsSection } from './components/customer/NewsSection';
import { NewsDetailModal } from './components/customer/NewsDetailModal';
import { InfoPageModal } from './components/customer/InfoPageModal';
import { ShareLiveModal } from './components/common/ShareLiveModal';

export const App: React.FC = () => {
  const { activeView, isAdmin, setAuthModalOpen, shareModalOpen, setShareModalOpen } = useApp();

  useEffect(() => {
    // Secret shortcut for administrator/staff login: Alt + A or Ctrl + Shift + A
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && (e.key === 'a' || e.key === 'A')) || (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a'))) {
        e.preventDefault();
        setAuthModalOpen(true);
      }
    };

    // Secret URL hash trigger: #admin or #staff or #login
    const handleHash = () => {
      if (window.location.hash === '#admin' || window.location.hash === '#staff' || window.location.hash === '#login') {
        setAuthModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('hashchange', handleHash);
    handleHash();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', handleHash);
    };
  }, [setAuthModalOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg font-sans">
      {/* Universal Sticky Navbar */}
      <Navbar />

      {/* Main View Switcher */}
      <main className="flex-1">
        {isAdmin || activeView === 'admin' ? (
          <AdminDashboard />
        ) : (
          <>
            {activeView === 'home' && (
              <div className="space-y-6">
                <Hero />
                <Benefits />
                <Campaigns />
                <PopularDestinations />
                <NewsSection />
              </div>
            )}

            {activeView === 'news' && (
              <div className="py-6">
                <NewsSection />
              </div>
            )}

            {activeView === 'results' && <FlightResults />}
            {activeView === 'passengers' && <PassengerForm />}
            {activeView === 'seats' && <SeatMap />}
            {activeView === 'checkout' && <CheckoutModal />}
            {activeView === 'confirmation' && <BookingConfirmation />}
            {activeView === 'manage' && <ManageBooking />}
            {activeView === 'account' && <AccountView />}
            {activeView === 'checkin' && <CheckinView />}
          </>
        )}
      </main>

      {/* Modals */}
      <FlightDetailsModal />
      <AuthModal />
      <NewsDetailModal />
      <InfoPageModal />
      <ShareLiveModal isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} />

      {/* Universal Footer */}
      {!isAdmin && activeView !== 'admin' && activeView !== 'seats' && <Footer />}
    </div>
  );
};
