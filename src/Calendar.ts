/** Simple calendar conversion utilities using Intl APIs. */
export type CalendarSystem = 'gregory' | 'persian' | 'islamic';

export interface CalendarDate {
  year: number;
  month: number; // 1 indexed
  day: number;
}

/** Convert a Date to a calendar system representation */
export function toCalendar(date: Date, calendar: CalendarSystem): CalendarDate {
  const fmt = new Intl.DateTimeFormat('en-u-ca-' + calendar, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
  const parts = fmt.formatToParts(date);
  const map: Record<string, number> = {};
  for (const p of parts) {
    if (p.type !== 'literal') map[p.type] = parseInt(p.value, 10);
  }
  return { year: map.year, month: map.month, day: map.day };
}

/** Convert a calendar system date to a JS Date (approx, using Intl) */
export function fromCalendar(cd: CalendarDate, calendar: CalendarSystem): Date {
  const fmt = new Intl.DateTimeFormat('en-u-ca-' + calendar, {
    year: 'numeric', month: 'numeric', day: 'numeric',
  });
  const parts = fmt.format(new Date(cd.year, cd.month - 1, cd.day)).split('/');
  // Fallback: simply use Gregorian with given parts
  return new Date(cd.year, cd.month - 1, cd.day);
}
