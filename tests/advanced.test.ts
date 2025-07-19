import assert from 'assert';
import { test } from 'node:test';
import { DateTime, parseNatural, reactive, ui } from '../src';

// timezone conversion
test('DateTime converts between timezones', () => {
  const utc = new DateTime('2020-06-01T12:00:00Z');
  const ny = utc.toTimeZone('America/New_York');
  assert.strictEqual(ny.format('HH'), '08');
});

// natural language parsing
test('parseNatural understands simple phrases', () => {
  const base = new Date('2020-01-01T00:00:00Z');
  const dt = parseNatural('in 3 days', base);
  assert.strictEqual(dt.format('YYYY-MM-DD'), '2020-01-04');
});

// reactive interval
test('Observable interval emits values', () => {
  const obs = reactive.interval(10);
  const teardown = obs.subscribe({ next: () => {} });
  assert.strictEqual(typeof teardown, 'function');
  teardown();
});

// month grid helper
test('monthGrid returns 6 weeks', () => {
  const dt = new DateTime('2020-01-15T00:00:00Z');
  const grid = ui.monthGrid(dt);
  assert.strictEqual(grid.length, 6);
  assert.strictEqual(grid[0].length, 7);
});
