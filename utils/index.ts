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
