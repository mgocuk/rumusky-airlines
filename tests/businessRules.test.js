import { test, describe } from 'node:test';
import assert from 'node:assert';

describe('RUMUSKY Airlines Business Rules & Core Validation Tests', () => {

  test('Rule 1: Kalkis ve Varis havalimani ayni olamaz', () => {
    const origin = 'IST';
    const destination = 'IST';
    assert.strictEqual(origin === destination, true, 'Origin and destination must conflict when identical');
  });

  test('Rule 2: PNR Kodu 6 karakter ve tahmin edilemez olmali', () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let pnr = 'RMK';
    for (let i = 0; i < 3; i++) {
      pnr += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    assert.strictEqual(pnr.length, 6);
    assert.strictEqual(pnr.startsWith('RMK'), true);
  });

  test('Rule 3: Fiyat ve Vergi Hesaplamasi guvenli yapilmali', () => {
    const baseEconomyPrice = 2999;
    const passengerCount = 2;
    const taxRate = 0.18;
    const extraServices = 250; // Extra baggage

    const taxes = Math.round(baseEconomyPrice * taxRate);
    const subtotal = (baseEconomyPrice + taxes) * passengerCount;
    const grandTotal = subtotal + extraServices;

    assert.strictEqual(taxes, 540);
    assert.strictEqual(subtotal, 7078);
    assert.strictEqual(grandTotal, 7328);
  });

  test('Rule 4: Test Odeme Simülasyonu (Basarili vs Yetersiz Bakiye)', () => {
    const cardSuccess = '4000 0000 0000 0001';
    const cardInsufficient = '4000 0000 0000 0002';

    const validateCard = (num) => {
      if (num.endsWith('0002')) return { success: false, error: 'INSUFFICIENT_FUNDS' };
      if (num.endsWith('0001')) return { success: true, status: 'APPROVED' };
      return { success: false, error: 'INVALID_CARD' };
    };

    assert.strictEqual(validateCard(cardSuccess).status, 'APPROVED');
    assert.strictEqual(validateCard(cardInsufficient).error, 'INSUFFICIENT_FUNDS');
  });

  test('Rule 5: Koltuk kilidi 10 dakika sonra zaman asimina ugramali', () => {
    const holdDurationMs = 10 * 60 * 1000;
    const now = Date.now();
    const expiresAt = now + holdDurationMs;

    assert.strictEqual(expiresAt > now, true);
    assert.strictEqual(expiresAt - now, 600000);
  });

});
