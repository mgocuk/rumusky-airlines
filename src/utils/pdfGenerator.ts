import { jsPDF } from 'jspdf';
import { Ticket, Flight, Passenger } from '../types';
import { formatTicketDisplayFields, isChildPassenger } from '../components/customer/TicketCard';

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
  ctx.font = `700 ${size}px "Times New Roman", Times, Georgia, serif`;
  while (size > minFontSize && ctx.measureText(text).width > maxWidth) {
    size -= 1;
    ctx.font = `700 ${size}px "Times New Roman", Times, Georgia, serif`;
  }
  ctx.fillText(text, x, y, maxWidth);
}

export async function generateTicketPDF(ticket: Ticket, flight: Flight, passenger: Passenger): Promise<void> {
  const isChild = isChildPassenger(passenger);
  const templateSrc = isChild ? '/tickets/child-ticket-template.png' : '/tickets/souvenir-ticket-template.png';
  const templateImg = await loadImage(templateSrc);

  // Render at 3x template resolution for crisp print quality and native Unicode/Turkish font support
  const scale = 3;
  const w = (templateImg.naturalWidth || (isChild ? 962 : 941)) * scale;
  const h = (templateImg.naturalHeight || (isChild ? 292 : 293)) * scale;

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

  if (isChild) {
    drawFittedText(ctx, fields.passengerName, w * 0.488, h * 0.278, w * 0.3, Math.round(w * 0.0205), 22);
    drawFittedText(ctx, fields.fromText, w * 0.488, h * 0.415, w * 0.3, Math.round(w * 0.0205), 22);
    drawFittedText(ctx, fields.toText, w * 0.488, h * 0.546, w * 0.3, Math.round(w * 0.0205), 22);
    drawFittedText(ctx, fields.formattedDate, w * 0.402, h * 0.752, w * 0.105, Math.round(w * 0.0138), 16);
    drawFittedText(ctx, fields.depTime, w * 0.524, h * 0.752, w * 0.085, Math.round(w * 0.0144), 16);
    drawFittedText(ctx, fields.gateCode, w * 0.638, h * 0.752, w * 0.085, Math.round(w * 0.0144), 16);
    drawFittedText(ctx, fields.seatLabel, w * 0.742, h * 0.752, w * 0.07, Math.round(w * 0.0148), 16);
  } else {
    drawFittedText(ctx, fields.fromText, w * 0.403, h * 0.282, w * 0.375, Math.round(w * 0.0232), 24);
    drawFittedText(ctx, fields.toText, w * 0.403, h * 0.429, w * 0.375, Math.round(w * 0.0232), 24);
    drawFittedText(ctx, fields.flightNo, w * 0.411, h * 0.608, w * 0.088, Math.round(w * 0.0162), 18);
    drawFittedText(ctx, fields.formattedDate, w * 0.536, h * 0.608, w * 0.106, Math.round(w * 0.0162), 18);
    drawFittedText(ctx, fields.gateCode, w * 0.685, h * 0.608, w * 0.11, Math.round(w * 0.0162), 18);
    drawFittedText(ctx, fields.passengerName, w * 0.363, h * 0.741, w * 0.134, Math.round(w * 0.0132), 15);
    drawFittedText(ctx, fields.depTime, w * 0.536, h * 0.693, w * 0.12, Math.round(w * 0.0162), 18);
    drawFittedText(ctx, fields.seatLabel, w * 0.411, h * 0.774, w * 0.088, Math.round(w * 0.0168), 18);
  }

  const imgDataUrl = canvas.toDataURL('image/png');

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

  // Include Dream Big Fly High commemorative back side on page 2 for child tickets
  if (isChild) {
    try {
      const backImg = await loadImage('/tickets/child-ticket-back.png');
      const bw = backImg.naturalWidth || 959;
      const bh = backImg.naturalHeight || 254;
      const backCanvas = document.createElement('canvas');
      backCanvas.width = bw * 2;
      backCanvas.height = bh * 2;
      const bctx = backCanvas.getContext('2d');
      if (bctx) {
        bctx.drawImage(backImg, 0, 0, backCanvas.width, backCanvas.height);
        doc.addPage([220, 80], 'landscape');
        const bHeightMm = targetWidthMm * (bh / bw);
        const bOffsetY = (80 - bHeightMm) / 2;
        doc.addImage(backCanvas.toDataURL('image/png'), 'PNG', offsetX, bOffsetY, targetWidthMm, bHeightMm);
      }
    } catch {
      // gracefully omit back page if unavailable
    }
  }

  doc.save(`${isChild ? 'Cocuk-Hatira-Bileti' : 'Hatira-Bileti'}-${ticket.pnr}-${fields.seatLabel}.pdf`);
}
