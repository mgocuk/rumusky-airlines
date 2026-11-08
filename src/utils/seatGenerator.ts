import { FlightSeat } from '../types';

export function generateSeatsForFlight(
  flightId: string, 
  totalRows: number = 28,
  realBookedSeats: string[] = []
): FlightSeat[] {
  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
  const seats: FlightSeat[] = [];
  const bookedSet = new Set(realBookedSeats.map((s) => s.trim().toUpperCase()));

  for (let row = 1; row <= totalRows; row++) {
    const isBusiness = row <= 4;
    const isExit = row === 12 || row === 13;
    const isExtraLegroom = row === 1 || isExit;

    letters.forEach((letter) => {
      const seatNumber = `${row}${letter}`;
      
      // Deterministically occupy some seats for realism based on hash
      const charCode = seatNumber.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
      const isSimulatedOccupied = (charCode % 5 === 0) || (row === 3 && (letter === 'A' || letter === 'B')) || (row === 15 && letter === 'C');
      const isRealBooked = bookedSet.has(seatNumber);
      const isOccupied = isSimulatedOccupied || isRealBooked;

      let priceModifier = 0;
      if (isBusiness) priceModifier = 500;
      else if (isExit) priceModifier = 250;
      else if (letter === 'A' || letter === 'F') priceModifier = 100; // Window seat surcharge

      seats.push({
        id: `seat-${flightId}-${seatNumber}`,
        flightId,
        seatNumber,
        rowNumber: row,
        seatLetter: letter,
        cabinClass: isBusiness ? 'business' : 'economy',
        isExtraLegroom,
        isExitRow: isExit,
        priceModifier,
        status: isOccupied ? 'booked' : 'available'
      });
    });
  }

  return seats;
}
