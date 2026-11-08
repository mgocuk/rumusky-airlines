import React from 'react';
import { useApp } from '../../context/AppContext';
import { generateTicketPDF } from '../../utils/pdfGenerator';
import { User, Award, Plane, Calendar, Download, ShieldCheck, ArrowRight, Clock } from 'lucide-react';

export const AccountView: React.FC = () => {
  const { activeUser, bookings, flights, tickets, setActiveView, t, language } = useApp();

  const userBookings = bookings.filter((b) => b.status === 'confirmed');

  const handleDownloadTicket = async (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    const flight = flights.find((f) => f.id === booking.flightId);
    const bookingTicket = tickets.find((t) => t.bookingId === booking.id);
    const passenger = booking.passengers[0];

    if (flight && bookingTicket && passenger) {
      await generateTicketPDF(bookingTicket, flight, passenger);
    }
  };

  return (
    <div className="max-w-[1000px] w-full mx-auto px-4 sm:px-6 py-10">
      
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-elevated mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-brand-navy text-white flex items-center justify-center font-heading font-extrabold text-2xl shadow-md">
              {activeUser ? activeUser.name.charAt(0) : 'Y'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold font-heading text-brand-navy">
                  {activeUser ? `${activeUser.name} ${activeUser.surname}` : 'Değerli Yolcumuz'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                  <Award className="w-3 h-3 text-amber-600" />
                  <span>SkyClub Gold</span>
                </span>
              </div>
              <p className="text-xs text-brand-muted mt-0.5">
                {activeUser?.email || 'yolcu@rumusky.com'} • Üyelik No: RMK-902814
              </p>
            </div>
          </div>

          {/* Loyalty Miles Box */}
          <div className="bg-brand-bg rounded-2xl p-4 border border-brand-border flex items-center gap-5">
            <div>
              <span className="text-[10px] text-brand-muted uppercase font-bold tracking-wider block">
                {t('account_miles')}
              </span>
              <span className="text-2xl font-black font-heading text-brand-navy">
                24.500 <span className="text-xs text-brand-blue font-bold">Mil</span>
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center">
              <Plane className="w-5 h-5 rotate-45" />
            </div>
          </div>
        </div>
      </div>

      {/* Bookings & Trips Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold font-heading text-brand-navy flex items-center gap-2">
            <Calendar className="w-5 h-5 text-brand-blue" />
            <span>Kayıtlı Rezervasyonlarım ({userBookings.length})</span>
          </h3>

          <button
            onClick={() => setActiveView('home')}
            className="text-xs font-bold text-brand-blue hover:underline flex items-center gap-1"
          >
            <span>Yeni Uçuş Ara</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {userBookings.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 border border-brand-border text-center">
            <Plane className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="font-heading font-bold text-base text-brand-navy">
              Henüz Kayıtlı Bir Uçuşunuz Yok
            </h4>
            <p className="text-xs text-brand-muted mt-1 max-w-sm mx-auto mb-4">
              Ana sayfadan dilediğiniz rotayı seçerek ilk test biletinizi anında oluşturabilirsiniz.
            </p>
            <button
              onClick={() => setActiveView('home')}
              className="px-6 py-2.5 bg-brand-blue text-white rounded-xl text-xs font-bold shadow-md"
            >
              Uçuş Ara
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {userBookings.map((b) => {
              const f = flights.find((flight) => flight.id === b.flightId);
              if (!f) return null;

              return (
                <div
                  key={b.id}
                  className="bg-white rounded-2xl p-6 border border-brand-border shadow-subtle hover:shadow-elevated transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono font-black text-brand-blue text-sm">
                        PNR: {b.pnr}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                        Onaylandı
                      </span>
                      <span className="text-xs text-brand-muted">
                        {f.flightNumber} • {f.aircraftModel}
                      </span>
                    </div>

                    <div className="flex items-center gap-6 mt-3">
                      <div>
                        <div className="text-xl font-black text-brand-navy">{f.originAirport.iataCode}</div>
                        <div className="text-xs text-brand-muted">{f.originAirport.city}</div>
                      </div>
                      <div className="text-slate-400">→</div>
                      <div>
                        <div className="text-xl font-black text-brand-navy">{f.destinationAirport.iataCode}</div>
                        <div className="text-xs text-brand-muted">{f.destinationAirport.city}</div>
                      </div>
                      <div className="border-l border-slate-200 pl-4 text-xs">
                        <div className="font-bold text-slate-700">
                          {f.departureTime.split('T')[0]} ({f.departureTime.split('T')[1].substring(0, 5)})
                        </div>
                        <div className="text-brand-muted mt-0.5">
                          {b.passengers.length} Yolcu: {b.passengers.map(p => `${p.firstName} ${p.lastName}`).join(', ')}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-center">
                    <button
                      onClick={() => handleDownloadTicket(b.id)}
                      className="px-4 py-2.5 bg-brand-navy hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
                    >
                      <Download className="w-4 h-4 text-brand-cyan" />
                      <span>PDF Bilet İndir</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
