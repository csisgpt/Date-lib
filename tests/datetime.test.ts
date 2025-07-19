import assert from 'assert';
import { test } from 'node:test';
import { DateTime, Duration, Interval } from '../src';

test('DateTime constructs from ISO string', () => {
  const dt = new DateTime('2020-01-01T00:00:00Z');
  assert.strictEqual(dt.format('YYYY-MM-DD'), '2020-01-01');
});

test('DateTime adds days immutably', () => {
  const dt = new DateTime('2020-01-01T00:00:00Z');
  const dt2 = dt.addDays(1);
  assert.strictEqual(dt.format('YYYY-MM-DD'), '2020-01-01');
  assert.strictEqual(dt2.format('YYYY-MM-DD'), '2020-01-02');
});

test('Duration and Interval intersection', () => {
  const aStart = new DateTime('2020-01-01T00:00:00Z');
  const aEnd = aStart.addDays(10);
  const bStart = aStart.addDays(5);
  const bEnd = bStart.addDays(10);
  const intervalA = new Interval(aStart, aEnd);
  const intervalB = new Interval(bStart, bEnd);
  const inter = intervalA.intersection(intervalB);
  assert.ok(inter);
  assert.strictEqual(inter?.duration().milliseconds, Duration.from({ days: 5 }).milliseconds);
});
