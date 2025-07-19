import en from '../locales/en.json';
import fa from '../locales/fa.json';
import { DateTime } from './DateTime';
import { Duration } from './Duration';

export type Locale = typeof en;

const locales: Record<string, Locale> = { en, fa };

/** Immutable closed time interval */
export class Interval {
  readonly start: DateTime;
  readonly end: DateTime;

  constructor(start: DateTime, end: DateTime) {
    if (end.isBefore(start)) throw new Error('End must be after start');
    this.start = start;
    this.end = end;
  }

  contains(dt: DateTime): boolean {
    return !dt.isBefore(this.start) && !dt.isAfter(this.end);
  }

  overlaps(other: Interval): boolean {
    return !(other.end.isBefore(this.start) || other.start.isAfter(this.end));
  }

  intersection(other: Interval): Interval | null {
    if (!this.overlaps(other)) return null;
    const start = this.start.isAfter(other.start) ? this.start : other.start;
    const end = this.end.isBefore(other.end) ? this.end : other.end;
    return new Interval(start, end);
  }

  union(other: Interval): Interval | null {
    if (!this.overlaps(other) && !this.end.isEqual(other.start) && !other.end.isEqual(this.start)) {
      return null;
    }
    const start = this.start.isBefore(other.start) ? this.start : other.start;
    const end = this.end.isAfter(other.end) ? this.end : other.end;
    return new Interval(start, end);
  }

  duration(): Duration {
    return new Duration(this.end.valueOf() - this.start.valueOf());
  }

  splitBy(unit: 'day' | 'week' | 'month'): Interval[] {
    const intervals: Interval[] = [];
    let cursor = this.start;
    while (cursor.isBefore(this.end)) {
      let next: DateTime;
      if (unit === 'day') next = cursor.startOfDay().addDays(1);
      else if (unit === 'week') next = cursor.startOfWeek().addWeeks(1);
      else next = cursor.startOfMonth().addMonths(1);
      const end = next.isAfter(this.end) ? this.end : next;
      intervals.push(new Interval(cursor, end));
      cursor = next;
    }
    return intervals;
  }

  toLocaleString(localeCode: string = 'en'): string {
    const loc = locales[localeCode] || locales.en;
    return `${this.start.format('YYYY-MM-DD HH:mm', localeCode)} - ${this.end.format('YYYY-MM-DD HH:mm', localeCode)}`;
  }

  toString(): string {
    return this.toLocaleString();
  }
}
