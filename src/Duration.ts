import en from '../locales/en.json';
import fa from '../locales/fa.json';

export type Locale = typeof en;

const locales: Record<string, Locale> = { en, fa };

/** Immutable duration representing milliseconds */
export class Duration {
  private readonly _ms: number;
  private _cache: Record<string, number> = {};

  constructor(ms: number) {
    this._ms = ms;
  }

  static from(opts: {
    days?: number; hours?: number; minutes?: number; seconds?: number; milliseconds?: number;
  }): Duration {
    const { days = 0, hours = 0, minutes = 0, seconds = 0, milliseconds = 0 } = opts;
    const ms = (((days * 24 + hours) * 60 + minutes) * 60 + seconds) * 1000 + milliseconds;
    return new Duration(ms);
  }

  static fromMilliseconds(ms: number): Duration { return new Duration(ms); }
  static fromSeconds(sec: number): Duration { return new Duration(sec * 1000); }
  static fromMinutes(min: number): Duration { return new Duration(min * 60000); }
  static fromHours(hr: number): Duration { return new Duration(hr * 3600000); }
  static fromDays(d: number): Duration { return new Duration(d * 86400000); }

  private convert(unit: string, divisor: number): number {
    if (!(unit in this._cache)) {
      this._cache[unit] = this._ms / divisor;
    }
    return this._cache[unit];
  }

  asMilliseconds(): number { return this._ms; }
  asSeconds(): number { return this.convert('s', 1000); }
  asMinutes(): number { return this.convert('m', 60000); }
  asHours(): number { return this.convert('h', 3600000); }
  asDays(): number { return this.convert('d', 86400000); }

  add(other: Duration): Duration { return new Duration(this._ms + other._ms); }
  subtract(other: Duration): Duration { return new Duration(this._ms - other._ms); }
  multiply(n: number): Duration { return new Duration(this._ms * n); }
  divide(n: number): Duration { return new Duration(this._ms / n); }

  equals(other: Duration): boolean { return this._ms === other._ms; }
  greaterThan(other: Duration): boolean { return this._ms > other._ms; }
  lessThan(other: Duration): boolean { return this._ms < other._ms; }

  format(localeCode: string = 'en'): string {
    const loc = locales[localeCode] || locales.en;
    const nf = new Intl.NumberFormat(localeCode);
    const units = (loc as any).durationUnits as Record<string, string>;
    const parts: string[] = [];
    let ms = this._ms;
    const d = Math.floor(ms / 86400000); ms %= 86400000;
    const h = Math.floor(ms / 3600000); ms %= 3600000;
    const m = Math.floor(ms / 60000); ms %= 60000;
    const s = Math.floor(ms / 1000);
    if (d) parts.push(nf.format(d) + units.day);
    if (h) parts.push(nf.format(h) + units.hour);
    if (m) parts.push(nf.format(m) + units.minute);
    if (s || parts.length === 0) parts.push(nf.format(s) + units.second);
    return parts.join(' ');
  }

  valueOf(): number { return this._ms; }

  toString(): string { return this.format(); }
}
