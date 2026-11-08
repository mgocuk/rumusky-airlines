import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Passenger } from '../../types';
import { ArrowLeft, User, Mail, Phone, Calendar, ShieldCheck, ChevronRight } from 'lucide-react';

export const PassengerForm: React.FC = () => {
  const { selectedFlight, searchQuery, passengers, setPassengerDetails, setActiveView, t, language } = useApp();

  const [passengerList, setPassengerList] = useState<Passenger[]>(passengers);
  const [email, setEmail] = useState('mustafa.gocuk@example.com');
  const [phone, setPhone] = useState('+90 555 123 4567');
  const [errors, setErrors] = useState<string[]>([]);

  if (!selectedFlight) {
    setActiveView('home');
    return null;
  }

  const handleInputChange = (index: number, field: keyof Passenger, value: any) => {
    setPassengerList((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: string[] = [];

    // Validate email & phone
    if (!email || !email.includes('@')) {
      newErrors.push(language === 'tr' ? 'Geçerli bir e-posta adresi giriniz.' : 'Please enter a valid email.');
    }
    if (!phone || phone.length < 7) {
      newErrors.push(language === 'tr' ? 'Geçerli bir telefon numarası giriniz.' : 'Please enter a valid phone number.');
    }

    // Validate each passenger
    passengerList.forEach((p, idx) => {
      if (!p.firstName.trim()) {
        newErrors.push(language === 'tr' ? `${idx + 1}. Yolcu adını giriniz.` : `Enter first name for passenger ${idx + 1}.`);
      }
      if (!p.lastName.trim()) {
        newErrors.push(language === 'tr' ? `${idx + 1}. Yolcu soyadını giriniz.` : `Enter last name for passenger ${idx + 1}.`);
      }
      if (!p.idOrPassportNo.trim()) {
        newErrors.push(language === 'tr' ? `${idx + 1}. Yolcu kimlik/pasaport numarasını giriniz.` : `Enter ID/Passport for passenger ${idx + 1}.`);
      }
    });

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors([]);
    setPassengerDetails(passengerList, email, phone);
  };

  return (
    <div className="max-w-[900px] w-full mx-auto px-4 sm:px-6 py-8">
      {/* Header & Back Button */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setActiveView('results')}
          className="p-2.5 rounded-xl bg-white border border-brand-border text-brand-navy hover:text-brand-blue transition-colors shadow-xs"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold font-heading text-brand-navy">
            {t('passengers_title')}
          </h2>
          <p className="text-xs text-brand-muted mt-0.5">
            {selectedFlight.flightNumber} • {selectedFlight.originAirport.city} ({selectedFlight.originAirport.iataCode}) → {selectedFlight.destinationAirport.city} ({selectedFlight.destinationAirport.iataCode})
          </p>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs space-y-1">
          {errors.map((err, i) => (
            <div key={i}>• {err}</div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Passenger Cards */}
        {passengerList.map((passenger, index) => (
          <div key={passenger.id} className="bg-white rounded-2xl p-6 border border-brand-border shadow-subtle">
            <div className="flex items-center gap-3 pb-4 mb-5 border-b border-slate-100">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-brand-blue font-bold flex items-center justify-center text-xs">
                {index + 1}
              </div>
              <h3 className="font-heading font-bold text-base text-brand-navy">
                {index + 1}. {language === 'tr' ? 'Yolcu Bilgileri' : 'Passenger Details'} ({passenger.passengerType.toUpperCase()})
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* First Name */}
              <div>
                <label className="text-xs font-bold text-brand-muted uppercase tracking-wider block mb-1">
                  {t('passengers_first_name')}
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ahmet / Jane"
                  value={passenger.firstName}
                  onChange={(e) => handleInputChange(index, 'firstName', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-brand-bg rounded-xl border border-brand-border text-sm font-semibold focus:border-brand-blue focus:outline-hidden"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="text-xs font-bold text-brand-muted uppercase tracking-wider block mb-1">
                  {t('passengers_last_name')}
                </label>
                <input
                  type="text"
                  required
                  placeholder="Yılmaz / Doe"
                  value={passenger.lastName}
                  onChange={(e) => handleInputChange(index, 'lastName', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-brand-bg rounded-xl border border-brand-border text-sm font-semibold focus:border-brand-blue focus:outline-hidden"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="text-xs font-bold text-brand-muted uppercase tracking-wider block mb-1">
                  {t('passengers_gender')}
                </label>
                <select
                  value={passenger.gender}
                  onChange={(e) => handleInputChange(index, 'gender', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-brand-bg rounded-xl border border-brand-border text-sm font-semibold focus:border-brand-blue focus:outline-hidden"
                >
                  <option value="M">{t('passengers_gender_male')}</option>
                  <option value="F">{t('passengers_gender_female')}</option>
                </select>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="text-xs font-bold text-brand-muted uppercase tracking-wider block mb-1">
                  {t('passengers_dob')}
                </label>
                <input
                  type="date"
                  required
                  value={passenger.dateOfBirth}
                  onChange={(e) => handleInputChange(index, 'dateOfBirth', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-brand-bg rounded-xl border border-brand-border text-sm font-semibold focus:border-brand-blue focus:outline-hidden"
                />
              </div>

              {/* Nationality */}
              <div>
                <label className="text-xs font-bold text-brand-muted uppercase tracking-wider block mb-1">
                  {t('passengers_nationality')}
                </label>
                <select
                  value={passenger.nationality}
                  onChange={(e) => handleInputChange(index, 'nationality', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-brand-bg rounded-xl border border-brand-border text-sm font-semibold focus:border-brand-blue focus:outline-hidden"
                >
                  <option value="TR">Türkiye (TR)</option>
                  <option value="GB">United Kingdom (GB)</option>
                  <option value="US">United States (US)</option>
                  <option value="DE">Germany (DE)</option>
                  <option value="FR">France (FR)</option>
                </select>
              </div>

              {/* ID or Passport Number */}
              <div>
                <label className="text-xs font-bold text-brand-muted uppercase tracking-wider block mb-1">
                  {t('passengers_id_no')}
                </label>
                <input
                  type="text"
                  required
                  placeholder="12345678901 / U1234567"
                  value={passenger.idOrPassportNo}
                  onChange={(e) => handleInputChange(index, 'idOrPassportNo', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-brand-bg rounded-xl border border-brand-border text-sm font-semibold focus:border-brand-blue focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        ))}

        {/* Contact Information Card */}
        <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-subtle">
          <div className="flex items-center gap-3 pb-4 mb-5 border-b border-slate-100">
            <Mail className="w-5 h-5 text-brand-blue" />
            <h3 className="font-heading font-bold text-base text-brand-navy">
              {t('passengers_contact_title')}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-brand-muted uppercase tracking-wider block mb-1">
                {t('passengers_email')}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-brand-bg rounded-xl border border-brand-border text-sm font-semibold focus:border-brand-blue focus:outline-hidden"
              />
              <span className="text-[10px] text-brand-muted mt-1 block">
                Elektronik biletiniz ve PNR kodunuz bu adrese iletilecektir.
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-brand-muted uppercase tracking-wider block mb-1">
                {t('passengers_phone')}
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-brand-bg rounded-xl border border-brand-border text-sm font-semibold focus:border-brand-blue focus:outline-hidden"
              />
              <span className="text-[10px] text-brand-muted mt-1 block">
                Uçuş durumu ve kapı değişiklikleri SMS ile bildirilir.
              </span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-8 py-3.5 bg-brand-blue hover:bg-blue-600 text-white font-heading font-bold rounded-xl shadow-elevated flex items-center gap-2 group transition-all"
          >
            <span>{t('passengers_proceed_seats')}</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </form>
    </div>
  );
};
