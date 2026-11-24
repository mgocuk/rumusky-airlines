/**
 * Pure state transition reducer shared by both the local Vite sync middleware
 * and Vercel Serverless Functions so local LAN and cloud deployments stay identical.
 */

export function restoreFlightsCapacity(flights, aircrafts) {
  if (!Array.isArray(flights)) return flights;
  const acList = Array.isArray(aircrafts) ? aircrafts : [];
  return flights.map((f) => {
    const ac = acList.find((a) => a.id === f.aircraftId);
    const cols = Array.isArray(ac?.seatsPerRow) && ac.seatsPerRow.length > 0 ? ac.seatsPerRow.length : 6;
    const econCap = ac?.economyRows ? ac.economyRows * cols : 156;
    const bizCap = ac?.businessRows ? ac.businessRows * cols : 24;
    return {
      ...f,
      availableEconomySeats: econCap,
      availableBusinessSeats: bizCap
    };
  });
}

export function applySyncAction(currentStore, action) {
  const store = currentStore && typeof currentStore === 'object' ? { ...currentStore } : {};
  const { type, payload } = action || {};
  let mutated = true;

  switch (type) {
    case 'INIT_STATE': {
      const hasFlights = Array.isArray(store.flights) && store.flights.length > 0;
      const hasContent = Boolean(store.siteContent);
      if ((!hasFlights && !hasContent) || payload?.force) {
        Object.assign(store, payload?.state || {});
      } else {
        mutated = false;
      }
      break;
    }

    case 'BOOKING_CREATED': {
      const { booking, tickets, updatedFlight } = payload || {};
      const existingBookings = Array.isArray(store.bookings) ? store.bookings : [];
      const isDuplicate = Boolean(booking && existingBookings.some((b) => b.id === booking.id));

      if (booking) {
        store.bookings = [booking, ...existingBookings.filter((b) => b.id !== booking.id)];
      }
      if (tickets && Array.isArray(tickets)) {
        const newIds = new Set(tickets.map((t) => t.id));
        store.tickets = [...tickets, ...(store.tickets || []).filter((t) => !newIds.has(t.id))];
      }
      if (booking && !isDuplicate && Array.isArray(store.flights)) {
        const paxCount = Array.isArray(booking.passengers) ? booking.passengers.length : 1;
        const isBusiness = booking.passengers?.[0]?.cabinClass === 'business';
        store.flights = store.flights.map((f) => {
          if (f.id !== booking.flightId) return f;
          if (isBusiness) {
            return {
              ...f,
              availableBusinessSeats: Math.max(0, (f.availableBusinessSeats ?? 0) - paxCount)
            };
          }
          return {
            ...f,
            availableEconomySeats: Math.max(0, (f.availableEconomySeats ?? 0) - paxCount)
          };
        });
      } else if (updatedFlight && Array.isArray(store.flights)) {
        store.flights = store.flights.map((f) =>
          f.id === updatedFlight.id ? { ...f, ...updatedFlight } : f
        );
      }
      break;
    }

    case 'BOOKING_CANCELLED': {
      const { bookingId, updatedFlight } = payload || {};
      if (bookingId) {
        store.bookings = (store.bookings || []).map((b) =>
          b.id === bookingId ? { ...b, status: 'cancelled' } : b
        );
      }
      if (updatedFlight && Array.isArray(store.flights)) {
        store.flights = store.flights.map((f) =>
          f.id === updatedFlight.id ? { ...f, ...updatedFlight } : f
        );
      }
      break;
    }

    case 'BOOKINGS_CLEARED': {
      store.bookings = [];
      store.tickets = [];
      if (Array.isArray(store.flights)) {
        store.flights = restoreFlightsCapacity(store.flights, store.aircrafts);
      }
      break;
    }

    case 'CHECKIN_COMPLETED': {
      const { ticketId, seatNumber } = payload || {};
      if (ticketId) {
        store.tickets = (store.tickets || []).map((t) =>
          t.id === ticketId ? { ...t, status: 'checked_in', seatNumber: seatNumber || t.seatNumber } : t
        );
      }
      break;
    }

    case 'SITE_CONTENT_UPDATED': {
      store.siteContent = {
        ...(store.siteContent || {}),
        ...(payload || {})
      };
      break;
    }

    case 'FLIGHTS_UPDATED': {
      if (Array.isArray(payload?.flights)) {
        store.flights = payload.flights;
      }
      break;
    }

    case 'FLIGHT_ADDED': {
      if (payload?.flight) {
        store.flights = [payload.flight, ...(store.flights || [])];
      }
      break;
    }

    case 'FLIGHT_CANCELLED': {
      const { flightId } = payload || {};
      if (flightId) {
        store.flights = (store.flights || []).map((f) =>
          f.id === flightId ? { ...f, bookingStatus: 'closed', operationalStatus: 'Cancelled' } : f
        );
      }
      break;
    }

    case 'AIRCRAFTS_UPDATED': {
      if (Array.isArray(payload?.aircrafts)) {
        store.aircrafts = payload.aircrafts;
      }
      break;
    }

    case 'AIRPORT_ADDED': {
      if (payload?.airport) {
        const existing = Array.isArray(store.airports) ? store.airports : [];
        store.airports = [...existing.filter((a) => a.id !== payload.airport.id), payload.airport];
      }
      break;
    }

    case 'NEWS_UPDATED': {
      if (Array.isArray(payload?.news)) {
        store.news = payload.news;
      }
      break;
    }

    case 'INFO_PAGE_UPDATED': {
      if (payload?.page) {
        store.infoPages = (store.infoPages || []).map((p) =>
          p.id === payload.page.id ? { ...p, ...payload.page } : p
        );
      }
      break;
    }

    case 'ROLE_PERMISSIONS_UPDATED': {
      if (payload?.rolePermissions) {
        store.rolePermissions = payload.rolePermissions;
      }
      break;
    }

    case 'STAFF_USERS_UPDATED': {
      if (Array.isArray(payload?.staffUsers)) {
        store.staffUsers = payload.staffUsers;
      }
      break;
    }

    case 'RESET_ALL_DATA': {
      return {
        state: {
          bookings: [],
          tickets: []
        },
        mutated: true
      };
    }

    default:
      mutated = false;
      break;
  }

  return { state: store, mutated };
}
