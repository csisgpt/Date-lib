export interface LocaleData {
  months: string[];
  weekdays: string[];
}

export function parseDate(value: string | number): Date {
  if (typeof value === 'number') return new Date(value);
  const d = new Date(value);
  if (isNaN(d.getTime())) throw new Error('Invalid date');
  return d;
}

export function pad(n: number, len: number = 2): string {
  return String(n).padStart(len, '0');
}

export function offsetToString(offset: number): string {
  const sign = offset > 0 ? '-' : '+'; // JS offset is opposite sign
  const abs = Math.abs(offset);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `${sign}${pad(h)}:${pad(m)}`;
}

export function formatDate(date: Date, pattern: string, loc: LocaleData, offset: number): string {
  const d = new Date(date.getTime() - offset * 60000);
  const map: Record<string, string> = {
    YYYY: pad(d.getUTCFullYear(), 4),
    MM: pad(d.getUTCMonth() + 1),
    DD: pad(d.getUTCDate()),
    HH: pad(d.getUTCHours()),
    mm: pad(d.getUTCMinutes()),
    ss: pad(d.getUTCSeconds()),
    Z: offsetToString(offset),
  };

  return pattern.replace(/YYYY|MM|DD|HH|mm|ss|Z/g, (t) => map[t]);
}

/** Get timezone offset in minutes for a specific IANA timezone */
export function getTimeZoneOffset(date: Date, timeZone: string): number {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const parts = dtf.formatToParts(date);
  const data: Record<string, number> = {};
  for (const p of parts) {
    if (p.type !== 'literal') data[p.type] = parseInt(p.value, 10);
  }
  const asUTC = Date.UTC(
    data.year,
    data.month - 1,
    data.day,
    data.hour,
    data.minute,
    data.second
  );
  return -(asUTC - date.getTime()) / 60000;
}

/** Convert date to a different IANA timezone */
export function convertToTimeZone(date: Date, timeZone: string): Date {
  const offset = getTimeZoneOffset(date, timeZone);
  return new Date(date.getTime() - (date.getTimezoneOffset() - offset) * 60000);
}
