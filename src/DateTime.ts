import { formatDate, parseDate, offsetToString } from '../utils';
import en from '../locales/en.json';
import fa from '../locales/fa.json';

type Locale = typeof en;

const locales: Record<string, Locale> = {
  en,
  fa,
};

export interface Plugin {
  (dtClass: typeof DateTime): void;
}

/**
 * Immutable DateTime wrapper around JavaScript Date.
 */
export class DateTime {
  private readonly _date: Date;
  private readonly _offset: number; // minutes offset from UTC

  /**
   * Create a DateTime instance.
   * @param value Date | string | number or another DateTime
   * @param offset timezone offset in minutes
   */
  constructor(value?: Date | string | number | DateTime, offset: number = 0) {
    if (value instanceof DateTime) {
      this._date = new Date(value._date.getTime());
      this._offset = value._offset;
    } else if (value instanceof Date) {
      this._date = new Date(value.getTime());
      this._offset = offset;
    } else if (typeof value === 'string' || typeof value === 'number') {
      this._date = parseDate(value);
      this._offset = offset;
    } else {
      this._date = new Date();
      this._offset = offset;
    }
  }

  /** Get native Date */
  toDate(): Date {
    return new Date(this._date.getTime());
  }

  /** Milliseconds since epoch */
  valueOf(): number {
    return this._date.getTime();
  }

  /** Format using tokens */
  format(pattern: string, localeCode: string = 'en'): string {
    const loc = locales[localeCode] || locales.en;
    return formatDate(this.toDate(), pattern, loc, this._offset);
  }

  /** Add milliseconds */
  private add(ms: number): DateTime {
    return new DateTime(this._date.getTime() + ms, this._offset);
  }

  /** Add days */
  addDays(days: number): DateTime {
    return this.add(days * 86400000);
  }

  /** Add weeks */
  addWeeks(weeks: number): DateTime {
    return this.addDays(weeks * 7);
  }

  /** Add months (approx, using Date API) */
  addMonths(months: number): DateTime {
    const d = this.toDate();
    d.setMonth(d.getMonth() + months);
    return new DateTime(d, this._offset);
  }

  /** Add years */
  addYears(years: number): DateTime {
    const d = this.toDate();
    d.setFullYear(d.getFullYear() + years);
    return new DateTime(d, this._offset);
  }

  /** Add hours */
  addHours(hours: number): DateTime {
    return this.add(hours * 3600000);
  }

  /** Add minutes */
  addMinutes(minutes: number): DateTime {
    return this.add(minutes * 60000);
  }

  /** Add seconds */
  addSeconds(seconds: number): DateTime {
    return this.add(seconds * 1000);
  }

  /** Set year */
  setYear(year: number): DateTime {
    const d = this.toDate();
    d.setFullYear(year);
    return new DateTime(d, this._offset);
  }

  /** Set month (0 indexed) */
  setMonth(month: number): DateTime {
    const d = this.toDate();
    d.setMonth(month);
    return new DateTime(d, this._offset);
  }

  /** Set day */
  setDay(day: number): DateTime {
    const d = this.toDate();
    d.setDate(day);
    return new DateTime(d, this._offset);
  }

  /** Set hour */
  setHour(hour: number): DateTime {
    const d = this.toDate();
    d.setHours(hour);
    return new DateTime(d, this._offset);
  }

  /** Set minute */
  setMinute(minute: number): DateTime {
    const d = this.toDate();
    d.setMinutes(minute);
    return new DateTime(d, this._offset);
  }

  /** Set second */
  setSecond(second: number): DateTime {
    const d = this.toDate();
    d.setSeconds(second);
    return new DateTime(d, this._offset);
  }

  /** Convert to UTC */
  toUTC(): DateTime {
    return new DateTime(this._date, 0);
  }

  /** Convert to local (offset 0 means local) */
  toLocal(): DateTime {
    return new DateTime(this._date, new Date().getTimezoneOffset());
  }

  /** Convert to offset */
  withOffset(minutes: number): DateTime {
    return new DateTime(this._date, minutes);
  }

  /** Offset string */
  offsetString(): string {
    return offsetToString(this._offset);
  }

  /** Comparison methods */
  isBefore(other: DateTime): boolean {
    return this.valueOf() < other.valueOf();
  }
  isAfter(other: DateTime): boolean {
    return this.valueOf() > other.valueOf();
  }
  isEqual(other: DateTime): boolean {
    return this.valueOf() === other.valueOf();
  }

  /** Same day */
  isSameDay(other: DateTime): boolean {
    return (
      this._date.getFullYear() === other._date.getFullYear() &&
      this._date.getMonth() === other._date.getMonth() &&
      this._date.getDate() === other._date.getDate()
    );
  }

  /** Same week (starting Monday) */
  isSameWeek(other: DateTime): boolean {
    const a = this.startOfWeek();
    const b = other.startOfWeek();
    return a.isEqual(b);
  }

  /** Same month */
  isSameMonth(other: DateTime): boolean {
    return (
      this._date.getFullYear() === other._date.getFullYear() &&
      this._date.getMonth() === other._date.getMonth()
    );
  }

  /** Start of week (Monday) */
  startOfWeek(): DateTime {
    const d = this.toDate();
    const diff = (d.getDay() + 6) % 7; // Monday=0
    d.setDate(d.getDate() - diff);
    d.setHours(0, 0, 0, 0);
    return new DateTime(d, this._offset);
  }

  /** toString */
  toString(): string {
    return this.format('YYYY-MM-DDTHH:mm:ssZ');
  }

  // Plugin system
  private static _plugins: Plugin[] = [];

  static use(plugin: Plugin) {
    if (!this._plugins.includes(plugin)) {
      plugin(this);
      this._plugins.push(plugin);
    }
  }
}
