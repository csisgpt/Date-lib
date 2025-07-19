/** Very naive natural language parsing for demonstration */
import { DateTime } from './DateTime';

export function parseNatural(text: string, base: Date = new Date()): DateTime {
  const lower = text.toLowerCase().trim();
  const dt = new Date(base.getTime());
  const nextMatch = lower.match(/^next (monday|tuesday|wednesday|thursday|friday|saturday|sunday)$/);
  if (nextMatch) {
    const target = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'].indexOf(nextMatch[1]);
    let day = dt.getDay();
    let diff = (target - day + 7) % 7;
    if (diff === 0) diff = 7;
    dt.setDate(dt.getDate() + diff);
    return new DateTime(dt);
  }
  const inMatch = lower.match(/^in (\d+) days?$/);
  if (inMatch) {
    dt.setDate(dt.getDate() + parseInt(inMatch[1], 10));
    return new DateTime(dt);
  }
  const lastMonth = lower === 'last month';
  if (lastMonth) {
    dt.setMonth(dt.getMonth() - 1);
    return new DateTime(dt);
  }
  throw new Error('Unsupported expression');
}
