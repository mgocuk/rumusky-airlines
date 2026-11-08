export type Language = 'tr' | 'en';

export type UserRole = 'super_admin' | 'flight_manager' | 'booking_manager' | 'customer';

export interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  role: UserRole;
  phone?: string;
}

export interface Airport {
  id: string;
  iataCode: string;
  icaoCode: string;
  name: string;
  city: string;
  cityEn: string;
  country: string;
  countryEn: string;
  timezone: string;
  terminalInfo?: string;
  isActive: boolean;
}

export interface Aircraft {
  id: string;
  model: string;
  registrationNumber: string;
  manufacturer: string;
  totalCapacity: number;
  economyRows: number;
  businessRows: number;
  seatsPerRow: string[]; // e.g. ['A', 'B', 'C', 'D', 'E', 'F']
  isActive: boolean;
}

export interface FlightSeat {
  id: string;
  flightId: string;
  seatNumber: string; // e.g. "12A"
  rowNumber: number;
  seatLetter: string;
  cabinClass: 'economy' | 'business';
  isExtraLegroom: boolean;
  isExitRow: boolean;
  priceModifier: number; // e.g. +150 TL for exit row
  status: 'available' | 'held' | 'booked' | 'blocked';
  heldBySessionId?: string;
  heldUntil?: number; // timestamp ms
}

export interface Route {
  id: string;
  originAirportId: string;
  destinationAirportId: string;
  distanceKm: number;
  estimatedDurationMinutes: number;
  isActive: boolean;
}

export type OperationalStatus = 'Scheduled' | 'Boarding' | 'Departed' | 'In Air' | 'Landed' | 'Delayed' | 'Cancelled';
export type BookingStatus = 'open' | 'closed';

export interface Flight {
  id: string;
  flightNumber: string; // e.g. "RMK-104"
  routeId: string;
  originAirport: Airport;
  destinationAirport: Airport;
  aircraftId: string;
  aircraftModel: string;
  departureTime: string; // ISO string
  arrivalTime: string;   // ISO string
  durationMinutes: number;
  priceEconomy: number;
  priceBusiness: number;
  baggageAllowanceKg: number;
  operationalStatus: OperationalStatus;
  bookingStatus: BookingStatus;
  availableEconomySeats: number;
  availableBusinessSeats: number;
}

export type PassengerType = 'adult' | 'child' | 'infant';

export interface Passenger {
  id: string;
  firstName: string;
  lastName: string;
  gender: 'M' | 'F';
  dateOfBirth: string;
  passengerType: PassengerType;
  nationality: string;
  idOrPassportNo: string;
  selectedSeat?: string;
  cabinClass: 'economy' | 'business';
}

export type BookingState = 'pending' | 'confirmed' | 'cancelled' | 'expired';

export interface ExtraService {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  price: number;
  icon: string;
}

export interface SystemSettings {
  announcement: string;
  taxRate: number;
  currency: string;
  seatHoldMinutes: number;
}

export interface Booking {
  id: string;
  pnr: string; // e.g. "RMK78F"
  flightId: string;
  returnFlightId?: string;
  passengers: Passenger[];
  contactEmail: string;
  contactPhone: string;
  totalAmount: number;
  currency: string;
  status: BookingState;
  createdAt: string;
  expiresAt: string;
  paymentDetails?: Payment;
  selectedServices?: string[];
}

export interface Ticket {
  id: string;
  ticketNumber: string; // e.g. "235-9012849102"
  bookingId: string;
  pnr: string;
  passenger: Passenger;
  flight: Flight;
  seatNumber: string;
  cabinClass: 'economy' | 'business';
  baggageKg: number;
  qrCodeData: string;
  status: 'issued' | 'checked_in' | 'cancelled';
  issuedAt: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  transactionRef: string;
  cardLastFour: string;
  cardBrand: string;
  amount: number;
  currency: string;
  status: 'successful' | 'failed';
  errorMessage?: string;
  paidAt: string;
}

export interface Campaign {
  id: string;
  title: string;
  titleEn: string;
  subtitle: string;
  subtitleEn: string;
  imageUrl: string;
  ctaLabel: string;
  ctaLabelEn: string;
  badgeText: string;
  badgeTextEn: string;
  targetOrigin: string;
  targetDestination: string;
  discountPercentage?: number;
}

export interface PopularDestination {
  id: string;
  city: string;
  cityEn: string;
  country: string;
  countryEn: string;
  iataCode: string;
  imageUrl: string;
  startingPrice: number;
  currency: string;
}

export interface SearchQuery {
  tripType: 'one-way' | 'round-trip';
  originIata: string;
  destinationIata: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children: number;
  infants: number;
  cabinClass: 'economy' | 'business';
}
