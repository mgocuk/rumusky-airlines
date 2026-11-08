import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Flight, OperationalStatus, Airport } from '../../types';
import { useToast } from '../common/Toast';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import {
  Plane,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  AlertCircle,
  CheckCircle,
  XCircle,
  RotateCcw,
  Sliders,
  Shield,
  Building,
  ArrowRight,
  Settings,
  Save
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    flights,
    bookings,
    airports,
    aircrafts,
    addFlight,
    updateFlightStatus,
    cancelFlight,
    cancelBooking,
    resetAllData,
    toggleAdminMode,
    t,
    language
  } = useApp();

  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'overview' | 'flights' | 'bookings' | 'airports' | 'aircraft' | 'settings'>('overview');
  const [showAddFlightModal, setShowAddFlightModal] = useState(false);
  const [showAddAirportModal, setShowAddAirportModal] = useState(false);

  // New Flight Form state
  const [newFlightNumber, setNewFlightNumber] = useState('RMK-707');
  const [newOriginIata, setNewOriginIata] = useState('IST');
  const [newDestIata, setNewDestIata] = useState('DXB');
  const [newAircraftId, setNewAircraftId] = useState(aircrafts[0]?.id || 'ac-1');
  const [newDepDate, setNewDepDate] = useState('2026-11-15T09:00');
  const [newArrDate, setNewArrDate] = useState('2026-11-15T13:30');
  const [newEconomyPrice, setNewEconomyPrice] = useState(3800);
  const [newBusinessPrice, setNewBusinessPrice] = useState(8900);

  // New Airport Form state
  const [newIata, setNewIata] = useState('ESB');
  const [newIcao, setNewIcao] = useState('LTAC');
  const [newAirportName, setNewAirportName] = useState('Ankara Esenboğa Havalimanı');
  const [newCity, setNewCity] = useState('Ankara');
  const [newCountry, setNewCountry] = useState('Türkiye');

  // Settings state
  const [vatRate, setVatRate] = useState(18);
  const [seatHoldMinutes, setSeatHoldMinutes] = useState(10);
  const [announcementText, setAnnouncementText] = useState('RUMUSKY Airlines: Yaz sezonu erken rezervasyon fırsatları başladı!');

  // Calculate live analytics
  const totalRevenue = bookings
    .filter((b) => b.status === 'confirmed')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const totalPassengers = bookings
    .filter((b) => b.status === 'confirmed')
    .reduce((sum, b) => sum + b.passengers.length, 0);

  const activeFlightsCount = flights.filter((f) => f.bookingStatus === 'open').length;

  // Chart data: bookings count per destination
  const destCounts: Record<string, number> = {};
  flights.forEach((f) => {
    destCounts[f.destinationAirport.iataCode] = (destCounts[f.destinationAirport.iataCode] || 0) + 1;
  });
  const chartData = Object.entries(destCounts).map(([code, count]) => ({
    name: code,
    ucuslar: count
  }));

  const handleCreateFlight = (e: React.FormEvent) => {
    e.preventDefault();
    const origin = airports.find((a) => a.iataCode === newOriginIata) || airports[0];
    const destination = airports.find((a) => a.iataCode === newDestIata) || airports[1];
    const aircraft = aircrafts.find((ac) => ac.id === newAircraftId) || aircrafts[0];

    const dep = new Date(newDepDate);
    const arr = new Date(newArrDate);
    const durationMins = Math.round((arr.getTime() - dep.getTime()) / (1000 * 60)) || 180;

    addFlight({
      flightNumber: newFlightNumber,
      routeId: `rt-${Date.now()}`,
      originAirport: origin,
      destinationAirport: destination,
      aircraftId: aircraft.id,
      aircraftModel: aircraft.model,
      departureTime: newDepDate + ':00',
      arrivalTime: newArrDate + ':00',
      durationMinutes: durationMins,
      priceEconomy: Number(newEconomyPrice),
      priceBusiness: Number(newBusinessPrice),
      baggageAllowanceKg: 25,
      operationalStatus: 'Scheduled',
      bookingStatus: 'open'
    });

    setShowAddFlightModal(false);
    showToast(`${newFlightNumber} seferi başarıyla satışa açıldı!`, 'success');
  };

  const handleCreateAirport = (e: React.FormEvent) => {
    e.preventDefault();
    const newApt: Airport = {
      id: `apt-${Date.now()}`,
      iataCode: newIata.toUpperCase(),
      icaoCode: newIcao.toUpperCase(),
      name: newAirportName,
      city: newCity,
      cityEn: newCity,
      country: newCountry,
      countryEn: newCountry,
      timezone: 'Europe/Istanbul',
      isActive: true
    };
    airports.push(newApt);
    setShowAddAirportModal(false);
    showToast(`${newApt.iataCode} havalimanı sisteme kaydedildi!`, 'success');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Sistem ayarları başarıyla kaydedildi!', 'success');
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Top Admin Bar */}
      <div className="bg-brand-navy text-white px-6 py-4 shadow-md">
        <div className="max-w-[1240px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-blue flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-heading font-extrabold tracking-wide">
                RUMUSKY YÖNETİM PANELİ
              </h1>
              <p className="text-xs text-sky-200">
                Havayolu Operasyon, Uçuş Planlama ve Bilet Kontrol Sistemi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                resetAllData();
                showToast('Tüm simülasyon verileri sıfırlandı.', 'info');
              }}
              title="Tüm veritabanı simülasyonunu fabrika ayarlarına sıfırlar"
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 border border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Verileri Sıfırla</span>
            </button>

            <button
              onClick={toggleAdminMode}
              className="px-4 py-2 rounded-xl bg-brand-cyan hover:bg-sky-400 text-brand-navy text-xs font-extrabold flex items-center gap-1.5 shadow-xs"
            >
              <span>Müşteri Sitesine Dön</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Admin Nav Tabs */}
      <div className="bg-white border-b border-slate-200 px-6">
        <div className="max-w-[1240px] mx-auto flex gap-2 overflow-x-auto py-2">
          {[
            { id: 'overview', label: 'Genel Bakış (Analytics)', icon: TrendingUp },
            { id: 'flights', label: `Uçuşlar (${flights.length})`, icon: Plane },
            { id: 'bookings', label: `Rezervasyonlar (${bookings.length})`, icon: Calendar },
            { id: 'airports', label: `Havalimanları (${airports.length})`, icon: Building },
            { id: 'aircraft', label: `Filo (${aircrafts.length})`, icon: Sliders },
            { id: 'settings', label: 'Sistem Ayarları', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-50 text-brand-blue border border-blue-200 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Admin Content Area */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-8">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-subtle">
                <div className="flex items-center justify-between text-brand-muted text-xs font-bold mb-2">
                  <span>{t('admin_stat_total_bookings')}</span>
                  <Calendar className="w-4 h-4 text-brand-blue" />
                </div>
                <div className="text-3xl font-black font-heading text-brand-navy">
                  {bookings.length}
                </div>
                <div className="text-[11px] text-emerald-600 mt-1 font-semibold">
                  {bookings.filter((b) => b.status === 'confirmed').length} Onaylı Bilet
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-subtle">
                <div className="flex items-center justify-between text-brand-muted text-xs font-bold mb-2">
                  <span>{t('admin_stat_revenue')}</span>
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-3xl font-black font-heading text-brand-navy">
                  {totalRevenue.toLocaleString('tr-TR')} ₺
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Simüle Edilmiş Satış Geliri
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-subtle">
                <div className="flex items-center justify-between text-brand-muted text-xs font-bold mb-2">
                  <span>{t('admin_stat_active_flights')}</span>
                  <Plane className="w-4 h-4 text-brand-cyan" />
                </div>
                <div className="text-3xl font-black font-heading text-brand-navy">
                  {activeFlightsCount}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Satışa Açık Aktif Hat
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-subtle">
                <div className="flex items-center justify-between text-brand-muted text-xs font-bold mb-2">
                  <span>{t('admin_stat_occupancy')}</span>
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-3xl font-black font-heading text-brand-navy">
                  %78.4
                </div>
                <div className="text-[11px] text-emerald-600 mt-1 font-semibold">
                  Yüksek Kapasite Verimi
                </div>
              </div>
            </div>

            {/* Recharts Analytics Card */}
            <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-subtle">
              <h3 className="font-heading font-bold text-base text-brand-navy mb-4">
                Destinasyon Bazında Sefer Dağılımı (Recharts Analytics)
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" stroke="#64748B" fontSize={12} />
                    <YAxis stroke="#64748B" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0B2545',
                        color: '#FFF',
                        borderRadius: '8px',
                        border: 'none'
                      }}
                    />
                    <Bar dataKey="ucuslar" fill="#0D6EFD" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* FLIGHTS TAB */}
        {activeTab === 'flights' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold font-heading text-brand-navy">
                  Uçuş Tarifesi & Operasyon Yönetimi
                </h3>
                <p className="text-xs text-brand-muted mt-0.5">
                  Buradan yeni uçuş ekleyebilir veya durumunu değiştirebilirsiniz.
                </p>
              </div>

              <button
                onClick={() => setShowAddFlightModal(true)}
                className="px-4 py-2.5 bg-brand-blue hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>{t('admin_add_flight')}</span>
              </button>
            </div>

            {/* Flights Table */}
            <div className="bg-white rounded-2xl border border-brand-border shadow-subtle overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-brand-muted uppercase font-bold tracking-wider">
                    <tr>
                      <th className="p-3.5">Uçuş Kodu</th>
                      <th className="p-3.5">Güzergah</th>
                      <th className="p-3.5">Uçak Modeli</th>
                      <th className="p-3.5">Kalkış - Varış</th>
                      <th className="p-3.5">Taban Fiyat</th>
                      <th className="p-3.5">Operasyonel Durum</th>
                      <th className="p-3.5 text-right">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {flights.map((f) => (
                      <tr key={f.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3.5 font-bold font-mono text-brand-navy">
                          {f.flightNumber}
                        </td>
                        <td className="p-3.5 font-semibold">
                          {f.originAirport.iataCode} → {f.destinationAirport.iataCode}
                        </td>
                        <td className="p-3.5 text-slate-600">{f.aircraftModel}</td>
                        <td className="p-3.5">
                          {f.departureTime.split('T')[0]} ({f.departureTime.split('T')[1].substring(0, 5)})
                        </td>
                        <td className="p-3.5 font-bold text-brand-navy">
                          {f.priceEconomy.toLocaleString('tr-TR')} ₺
                        </td>
                        <td className="p-3.5">
                          <select
                            value={f.operationalStatus}
                            onChange={(e) => {
                              updateFlightStatus(f.id, e.target.value as OperationalStatus);
                              showToast(`${f.flightNumber} durumu ${e.target.value} olarak güncellendi.`);
                            }}
                            className="px-2.5 py-1 rounded-lg border border-slate-300 text-xs font-semibold bg-white"
                          >
                            <option value="Scheduled">Scheduled (Planlandı)</option>
                            <option value="Boarding">Boarding (Biniş)</option>
                            <option value="Departed">Departed (Kalktı)</option>
                            <option value="In Air">In Air (Havada)</option>
                            <option value="Landed">Landed (İndi)</option>
                            <option value="Delayed">Delayed (Rötar)</option>
                            <option value="Cancelled">Cancelled (İptal)</option>
                          </select>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => {
                              cancelFlight(f.id);
                              showToast(`${f.flightNumber} uçuşu iptal edildi.`, 'error');
                            }}
                            className="px-2.5 py-1 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            İptal Et
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* BOOKINGS TAB */}
        {activeTab === 'bookings' && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-bold font-heading text-brand-navy">
              Rezervasyon ve Bilet Kayıtları
            </h3>

            {bookings.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-brand-border text-center text-brand-muted">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>Henüz sistemde oluşturulmuş bir rezervasyon bulunmuyor.</p>
                <p className="text-xs text-slate-400 mt-1">Müşteri arayüzünden test uçuşu satın aldığınızda burada listelenecektir.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-brand-border shadow-subtle overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-brand-muted uppercase font-bold tracking-wider">
                    <tr>
                      <th className="p-3.5">PNR</th>
                      <th className="p-3.5">İletişim</th>
                      <th className="p-3.5">Yolcular</th>
                      <th className="p-3.5">Toplam Tutar</th>
                      <th className="p-3.5">Durum</th>
                      <th className="p-3.5">Tarih</th>
                      <th className="p-3.5 text-right">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3.5 font-bold font-mono text-brand-blue">{b.pnr}</td>
                        <td className="p-3.5">
                          <div className="font-semibold text-brand-navy">{b.contactEmail}</div>
                          <div className="text-[10px] text-brand-muted">{b.contactPhone}</div>
                        </td>
                        <td className="p-3.5">
                          {b.passengers.map((p) => `${p.firstName} ${p.lastName} (${p.selectedSeat || 'TBA'})`).join(', ')}
                        </td>
                        <td className="p-3.5 font-bold text-brand-navy">
                          {b.totalAmount.toLocaleString('tr-TR')} ₺
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            b.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                          }`}>
                            {b.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-500">
                          {new Date(b.createdAt).toLocaleDateString('tr-TR')}
                        </td>
                        <td className="p-3.5 text-right">
                          {b.status === 'confirmed' && (
                            <button
                              onClick={() => {
                                cancelBooking(b.id);
                                showToast(`${b.pnr} bilet rezervasyonu iptal edildi.`, 'error');
                              }}
                              className="px-2.5 py-1 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg"
                            >
                              Bileti İptal Et
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* AIRPORTS TAB */}
        {activeTab === 'airports' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold font-heading text-brand-navy">
                Kayıtlı Havalimanları ({airports.length})
              </h3>
              <button
                onClick={() => setShowAddAirportModal(true)}
                className="px-4 py-2 bg-brand-blue text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni Havalimanı Ekle</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {airports.map((a) => (
                <div key={a.id} className="bg-white p-5 rounded-2xl border border-brand-border shadow-subtle flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-black font-heading text-brand-navy">{a.iataCode}</span>
                      <span className="text-xs font-mono font-bold text-slate-400">{a.icaoCode}</span>
                    </div>
                    <div className="font-bold text-sm text-brand-navy">{a.name}</div>
                    <div className="text-xs text-brand-muted mt-0.5">{a.city}, {a.country}</div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                    <span>{a.timezone}</span>
                    <span className="text-emerald-600 font-bold">Aktif</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AIRCRAFT TAB */}
        {activeTab === 'aircraft' && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-bold font-heading text-brand-navy">
              Uçak Filosu ve Oturma Düzeni ({aircrafts.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {aircrafts.map((ac) => (
                <div key={ac.id} className="bg-white p-6 rounded-2xl border border-brand-border shadow-subtle">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl font-bold font-heading text-brand-navy">{ac.model}</span>
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-50 text-brand-blue">
                      {ac.registrationNumber}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 space-y-1.5 mt-4">
                    <div>Üretici: <b>{ac.manufacturer}</b></div>
                    <div>Toplam Kapasite: <b>{ac.totalCapacity} Yolcu</b></div>
                    <div>Kabin Dağılımı: <b>{ac.businessRows} Sıra Business, {ac.economyRows} Sıra Ekonomi</b></div>
                    <div>Koltuk Dizilimi: <b>3 + 3 ({ac.seatsPerRow.join(', ')})</b></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SYSTEM SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-subtle space-y-6 animate-fade-in">
            <div>
              <h3 className="text-xl font-bold font-heading text-brand-navy">
                Sistem ve Operasyon Parametreleri
              </h3>
              <p className="text-xs text-brand-muted mt-1">
                Vergi oranları, para birimi ve koltuk kilitleme sürelerini buradan yönetebilirsiniz.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-brand-muted uppercase block mb-1">
                  KDV & Havalimanı Harç Oranı (%)
                </label>
                <input
                  type="number"
                  value={vatRate}
                  onChange={(e) => setVatRate(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-brand-muted uppercase block mb-1">
                  Geçici Koltuk Kilitleme Süresi (Dakika)
                </label>
                <input
                  type="number"
                  value={seatHoldMinutes}
                  onChange={(e) => setSeatHoldMinutes(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-brand-muted uppercase block mb-1">
                  Web Sitesi Duyuru Bandı Metni
                </label>
                <input
                  type="text"
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-brand-blue hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Ayarları Kaydet</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Add Flight Modal */}
      {showAddFlightModal && (
        <div className="fixed inset-0 bg-brand-navy/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-brand-border">
            <h3 className="text-lg font-bold font-heading text-brand-navy mb-4">
              Yeni Uçuş Tarifesi Oluştur
            </h3>

            <form onSubmit={handleCreateFlight} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-brand-muted block mb-1">Uçuş Kodu</label>
                  <input
                    type="text"
                    required
                    value={newFlightNumber}
                    onChange={(e) => setNewFlightNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold uppercase"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-brand-muted block mb-1">Uçak</label>
                  <select
                    value={newAircraftId}
                    onChange={(e) => setNewAircraftId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                  >
                    {aircrafts.map((ac) => (
                      <option key={ac.id} value={ac.id}>{ac.model} ({ac.registrationNumber})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-brand-muted block mb-1">Kalkış Havalimanı</label>
                  <select
                    value={newOriginIata}
                    onChange={(e) => setNewOriginIata(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                  >
                    {airports.map((a) => (
                      <option key={a.id} value={a.iataCode}>{a.city} ({a.iataCode})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-brand-muted block mb-1">Varış Havalimanı</label>
                  <select
                    value={newDestIata}
                    onChange={(e) => setNewDestIata(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                  >
                    {airports.map((a) => (
                      <option key={a.id} value={a.iataCode}>{a.city} ({a.iataCode})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-brand-muted block mb-1">Kalkış Tarih / Saat</label>
                  <input
                    type="datetime-local"
                    required
                    value={newDepDate}
                    onChange={(e) => setNewDepDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-brand-muted block mb-1">Varış Tarih / Saat</label>
                  <input
                    type="datetime-local"
                    required
                    value={newArrDate}
                    onChange={(e) => setNewArrDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-brand-muted block mb-1">Ekonomi Fiyat (₺)</label>
                  <input
                    type="number"
                    required
                    value={newEconomyPrice}
                    onChange={(e) => setNewEconomyPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-brand-muted block mb-1">Business Fiyat (₺)</label>
                  <input
                    type="number"
                    required
                    value={newBusinessPrice}
                    onChange={(e) => setNewBusinessPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddFlightModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-brand-blue hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Uçuşu Satışa Aç
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Airport Modal */}
      {showAddAirportModal && (
        <div className="fixed inset-0 bg-brand-navy/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-brand-border">
            <h3 className="text-lg font-bold font-heading text-brand-navy mb-4">
              Yeni Havalimanı Tanımla
            </h3>

            <form onSubmit={handleCreateAirport} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-brand-muted block mb-1">IATA Kodu</label>
                  <input
                    type="text"
                    required
                    maxLength={3}
                    placeholder="ESB"
                    value={newIata}
                    onChange={(e) => setNewIata(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold uppercase"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-brand-muted block mb-1">ICAO Kodu</label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    placeholder="LTAC"
                    value={newIcao}
                    onChange={(e) => setNewIcao(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-brand-muted block mb-1">Havalimanı Adı</label>
                <input
                  type="text"
                  required
                  value={newAirportName}
                  onChange={(e) => setNewAirportName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-brand-muted block mb-1">Şehir</label>
                  <input
                    type="text"
                    required
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-brand-muted block mb-1">Ülke</label>
                  <input
                    type="text"
                    required
                    value={newCountry}
                    onChange={(e) => setNewCountry(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddAirportModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-brand-blue hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Havalimanını Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
