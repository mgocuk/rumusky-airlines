import React from 'react';
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

export const App: React.FC = () => {
  const { activeView, isAdmin } = useApp();

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

      {/* Universal Footer */}
      {!isAdmin && activeView !== 'admin' && activeView !== 'seats' && <Footer />}
    </div>
  );
};
