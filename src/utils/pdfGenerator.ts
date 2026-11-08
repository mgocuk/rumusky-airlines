import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { Ticket, Flight, Passenger } from '../types';
import { realtimeSync } from '../services/realtimeSync';

export async function generateTicketPDF(ticket: Ticket, flight: Flight, passenger: Passenger): Promise<void> {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [210, 100] // Standard IATA boarding pass aspect ratio (210mm x 100mm)
  });

  // Generate QR Code data URL with live verification link
  let base = typeof window !== 'undefined' ? window.location.origin : 'http://192.168.137.252:3000';
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    try {
      const netInfo = await realtimeSync.fetchNetworkInfo();
      if (netInfo && netInfo.url) {
        base = netInfo.url;
      }
    } catch {
      // fallback
    }
  }

  const qrUrl = `${base}/#ticket=${ticket.pnr}&tkt=${ticket.ticketNumber}`;

  const qrDataUrl = await QRCode.toDataURL(qrUrl, {
    margin: 1,
    width: 200,
    errorCorrectionLevel: 'M',
    color: {
      dark: '#0B2545',
      light: '#FFFFFF'
    }
  });

  // Navy Top Header Bar
  doc.setFillColor(11, 37, 69); // #0B2545 Primary Navy
  doc.rect(0, 0, 210, 18, 'F');

  // Brand Name
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('RUMUSKY AIRLINES', 12, 12);

  // Subtitle / Document Type - Commemorative Pass
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(245, 158, 11); // Amber / Gold
  doc.text('HATIRA BİLETİ • GAZİANTEP ÜNİVERSİTESİ ÖZEL BİNİŞ KARTI', 60, 12);

  // PNR on Header Right
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(`PNR: ${ticket.pnr}`, 175, 12);

  // Perforation Divider Line (for ticket stub effect)
  doc.setDrawColor(200, 215, 230);
  doc.setLineDashPattern([2, 2], 0);
  doc.line(152, 18, 152, 100);
  doc.setLineDashPattern([], 0); // reset

  // --- MAIN FLIGHT SECTION (Left) ---
  doc.setTextColor(23, 43, 73); // Main text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text(flight.originAirport.iataCode, 14, 34);

  doc.setTextColor(13, 110, 253); // Blue arrow
  doc.text('----->', 42, 34);

  doc.setTextColor(23, 43, 73);
  doc.text(flight.destinationAirport.iataCode, 78, 34);

  // City Names Under Airport Codes
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(92, 107, 122);
  doc.text(flight.originAirport.city, 14, 40);
  doc.text(flight.destinationAirport.city, 78, 40);

  // Passenger Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(92, 107, 122);
  doc.text('YOLCU / PASSENGER', 14, 48);
  doc.setFontSize(12);
  doc.setTextColor(11, 37, 69);
  doc.text(`${passenger.firstName.toUpperCase()} ${passenger.lastName.toUpperCase()}`, 14, 54);

  // Flight Details Grid (Row 1)
  doc.setFontSize(7.5);
  doc.setTextColor(92, 107, 122);
  doc.text('UÇUŞ / FLIGHT', 14, 63);
  doc.text('TARİH / DATE', 45, 63);
  doc.text('KALKIŞ / DEP', 80, 63);
  doc.text('KABİN / CLASS', 115, 63);

  doc.setFontSize(10.5);
  doc.setTextColor(11, 37, 69);
  doc.setFont('helvetica', 'bold');
  doc.text(flight.flightNumber, 14, 69);
  doc.text(flight.departureTime.split('T')[0], 45, 69);
  doc.text(flight.departureTime.split('T')[1].substring(0, 5), 80, 69);
  doc.text(ticket.cabinClass.toUpperCase(), 115, 69);

  // Flight Details Grid (Row 2)
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(92, 107, 122);
  doc.text('KOLTUK / SEAT', 14, 78);
  doc.text('KAPI / GATE', 45, 78);
  doc.text('BİNİŞ / BOARDING', 80, 78);
  doc.text('BAGAJ / BAGGAGE', 115, 78);

  doc.setFontSize(12);
  doc.setTextColor(13, 110, 253);
  doc.setFont('helvetica', 'bold');
  doc.text(ticket.seatNumber, 14, 85);
  doc.setTextColor(11, 37, 69);
  doc.setFontSize(10.5);
  doc.text(flight.originAirport.terminalInfo ? 'A-12' : 'TBA', 45, 85);
  
  // Calculate boarding time (45 mins before departure)
  const [depH, depM] = flight.departureTime.split('T')[1].substring(0, 5).split(':').map(Number);
  const boardingMin = depM - 45;
  const boardingTimeStr = `${boardingMin < 0 ? depH - 1 : depH}:${(boardingMin < 0 ? boardingMin + 60 : boardingMin).toString().padStart(2, '0')}`;
  doc.text(boardingTimeStr, 80, 85);
  doc.text(`${ticket.baggageKg} KG`, 115, 85);

  // Footer Disclaimer & Commemorative Note
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(140, 150, 165);
  doc.text('* Gaziantep Üniversitesi Projesi Hatıra Belgesidir. QR kodu kameranızla okutarak canlı doğrulayabilirsiniz.', 14, 94);

  // --- STUB / PASSENGER COUPON (Right) ---
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(11, 37, 69);
  doc.text('BİNİŞ KUPONU', 158, 26);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(92, 107, 122);
  doc.text(`${passenger.firstName.toUpperCase()} ${passenger.lastName.toUpperCase()}`, 158, 31);
  doc.text(`${flight.originAirport.iataCode} - ${flight.destinationAirport.iataCode}`, 158, 36);
  doc.text(`Uçuş: ${flight.flightNumber}`, 158, 41);
  doc.text(`Koltuk: ${ticket.seatNumber}`, 158, 46);

  // Stamp QR Code onto the stub
  doc.addImage(qrDataUrl, 'PNG', 158, 50, 42, 42);

  // Save the PDF file to user browser
  doc.save(`RUMUSKY-Ticket-${ticket.pnr}-${ticket.seatNumber}.pdf`);
}
