import test from 'node:test';
import assert from 'node:assert';

test('Realtime Multi-User Sync Integration Tests', async (t) => {
  const BASE_URL = 'http://localhost:3000';

  await t.test('Step 1: Network info endpoint returns local IP and port', async () => {
    const res = await fetch(`${BASE_URL}/api/network-info`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.ip, 'IP address must be provided');
    assert.ok(data.port, 'Port must be provided');
    assert.ok(data.url.startsWith('http://'), 'URL must be a valid http link');
  });

  await t.test('Step 2: Client A dispatches a booking creation action', async () => {
    const mockBooking = {
      id: `bk-test-${Date.now()}`,
      pnr: 'RMK99T',
      flightId: 'fl-1',
      passengers: [{ id: 'p-1', firstName: 'Mehmet', lastName: 'Demir', selectedSeat: '14C' }],
      totalAmount: 3250,
      currency: '₺',
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    const actionPayload = {
      id: `act-test-${Date.now()}`,
      type: 'BOOKING_CREATED',
      payload: {
        booking: mockBooking,
        tickets: [{
          id: `tkt-test-${Date.now()}`,
          ticketNumber: '235-9876543210',
          bookingId: mockBooking.id,
          pnr: mockBooking.pnr,
          seatNumber: '14C',
          status: 'issued'
        }],
        updatedFlight: { id: 'fl-1', availableEconomySeats: 149 }
      },
      originClientId: 'client-A',
      timestamp: new Date().toISOString()
    };

    const res = await fetch(`${BASE_URL}/api/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(actionPayload)
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
  });

  await t.test('Step 3: Client B queries server state and sees Client A booking immediately', async () => {
    const res = await fetch(`${BASE_URL}/api/state`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.state, 'State must exist');
    assert.ok(Array.isArray(data.state.bookings), 'Bookings must be an array');
    
    const found = data.state.bookings.find((b) => b.pnr === 'RMK99T');
    assert.ok(found, 'Client A booking with PNR RMK99T must be present in shared state');
    assert.strictEqual(found.passengers[0].firstName, 'Mehmet');
    assert.strictEqual(found.passengers[0].selectedSeat, '14C');
  });

  await t.test('Step 4: Super Admin dispatches CMS Brand update, reflected across all clients', async () => {
    const cmsUpdate = {
      companyName: 'RUMUSKY TEST',
      companySubtitle: 'GLOBAL AIRWAYS',
      navbar: {
        companyName: 'RUMUSKY TEST',
        navSearchFlights: 'Bilet Bul',
        navSearchFlightsEn: 'Find Tickets'
      }
    };

    const actionPayload = {
      id: `act-cms-${Date.now()}`,
      type: 'SITE_CONTENT_UPDATED',
      payload: cmsUpdate,
      originClientId: 'client-super-admin',
      timestamp: new Date().toISOString()
    };

    const res = await fetch(`${BASE_URL}/api/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(actionPayload)
    });

    assert.strictEqual(res.status, 200);

    // Verify in server state
    const stateRes = await fetch(`${BASE_URL}/api/state`);
    const stateData = await stateRes.json();
    assert.strictEqual(stateData.state.siteContent.companyName, 'RUMUSKY TEST');
    assert.strictEqual(stateData.state.siteContent.navbar.navSearchFlights, 'Bilet Bul');
  });
});
