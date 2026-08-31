import test from 'node:test';
import assert from 'node:assert';
import { formatPaiseToINR, rupeesToPaise, paiseToRupees, applyDiscount, formatCompactINR } from '../money.ts';

test('formatPaiseToINR converts integer paise to formatted INR string', () => {
  assert.strictEqual(formatPaiseToINR(249900), '₹2,499');
  assert.strictEqual(formatPaiseToINR(249900, true), '₹2,499.00');
  assert.strictEqual(formatPaiseToINR(10000000), '₹1,00,000');
  assert.strictEqual(formatPaiseToINR(0), '₹0');
});

test('rupeesToPaise and paiseToRupees convert accurately', () => {
  assert.strictEqual(rupeesToPaise(2499), 249900);
  assert.strictEqual(rupeesToPaise(49.99), 4999);
  assert.strictEqual(paiseToRupees(249900), 2499);
});

test('formatCompactINR formats large amounts gracefully', () => {
  assert.strictEqual(formatCompactINR(1000000000), '₹1.00 Cr'); // ₹1 Crore
  assert.strictEqual(formatCompactINR(50000000), '₹5.0 L');     // ₹5 Lakhs
  assert.strictEqual(formatCompactINR(2500000), '₹25.0 K');     // ₹25 Thousand
});

test('applyDiscount accurately computes discount paise and final amount paise', () => {
  const result = applyDiscount(100000, 10); // ₹1,000 with 10% discount
  assert.strictEqual(result.discountPaise, 10000);
  assert.strictEqual(result.finalAmountPaise, 90000);

  const zeroDiscount = applyDiscount(249900, 0);
  assert.strictEqual(zeroDiscount.discountPaise, 0);
  assert.strictEqual(zeroDiscount.finalAmountPaise, 249900);
});
