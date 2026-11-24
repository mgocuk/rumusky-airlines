import { jsPDF } from 'jspdf';
import { Ticket, Flight, Passenger } from '../types';
import { formatTicketDisplayFields } from '../components/customer/TicketCard';

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

function drawFittedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  initialFontSize: number,
  minFontSize: number
) {
  let size = initialFontSize;
  ctx.font = `700 ${size}px Georgia, "Times New Roman", serif`;
  while (size > minFontSize && ctx.measureText(text).width > maxWidth) {
    size -= 1;
    ctx.font = `700 ${size}px Georgia, "Times New Roman", serif`;
  }
  ctx.fillText(text, x, y, maxWidth);
}

export async function generateTicketPDF(ticket: Ticket, flight: Flight, passenger: Passenger): Promise<void> {
  const templateImg = await loadImage('/tickets/souvenir-ticket-template.png');

  // Render at 3x template resolution for crisp print quality and native Unicode/Turkish font support
  const scale = 3;
  const w = (templateImg.naturalWidth || 941) * scale;
  const h = (templateImg.naturalHeight || 293) * scale;

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not initialize canvas context for PDF generation');
  }

  ctx.drawImage(templateImg, 0, 0, w, h);

  const syntheticBooking = {
    id: ticket.bookingId,
    pnr: ticket.pnr,
    flightId: flight.id,
    passengers: [passenger],
    contactEmail: '',
    contactPhone: '',
    totalAmount: 0,
    currency: '₺',
    status: 'confirmed' as const,
    createdAt: ticket.issuedAt,
    expiresAt: ticket.issuedAt
  };

  const ticketForFormatting: Ticket = {
    ...ticket,
    passenger
  };

  const fields = formatTicketDisplayFields(syntheticBooking, flight, ticketForFormatting);

  ctx.fillStyle = '#182230';
  ctx.textBaseline = 'top';

  drawFittedText(ctx, fields.fromText, w * 0.405, h * 0.296, w * 0.37, Math.round(w * 0.0162), 18);
  drawFittedText(ctx, fields.toText, w * 0.405, h * 0.444, w * 0.37, Math.round(w * 0.0162), 18);
  drawFittedText(ctx, fields.flightNo, w * 0.415, h * 0.617, w * 0.085, Math.round(w * 0.0116), 14);
  drawFittedText(ctx, fields.formattedDate, w * 0.542, h * 0.617, w * 0.10, Math.round(w * 0.0116), 14);
  drawFittedText(ctx, fields.gateCode, w * 0.688, h * 0.617, w * 0.09, Math.round(w * 0.0116), 14);
  drawFittedText(ctx, fields.passengerName, w * 0.364, h * 0.748, w * 0.14, Math.round(w * 0.0096), 12);
  drawFittedText(ctx, fields.depTime, w * 0.542, h * 0.703, w * 0.10, Math.round(w * 0.0116), 14);
  drawFittedText(ctx, fields.seatLabel, w * 0.415, h * 0.784, w * 0.085, Math.round(w * 0.0116), 14);

  const imgDataUrl = canvas.toDataURL('image/png');

  // Landscape PDF matching the exact 941:293 aspect ratio cleanly centered with subtle page margins
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [220, 80]
  });

  const targetWidthMm = 204;
  const targetHeightMm = targetWidthMm * (h / w);
  const offsetX = (220 - targetWidthMm) / 2;
  const offsetY = (80 - targetHeightMm) / 2;

  doc.addImage(imgDataUrl, 'PNG', offsetX, offsetY, targetWidthMm, targetHeightMm);
  doc.save(`Hatira-Bileti-${ticket.pnr}-${fields.seatLabel}.pdf`);
}
