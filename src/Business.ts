import { DateTime } from './DateTime';

export interface HolidayProvider {
  isHoliday(date: DateTime): boolean;
}

export function workingDaysBetween(start: DateTime, end: DateTime, provider: HolidayProvider): number {
  let count = 0;
  let current = start;
  while (!current.isAfter(end)) {
    const day = current.toDate().getDay();
    if (day !== 0 && day !== 6 && !provider.isHoliday(current)) count++;
    current = current.addDays(1);
  }
  return count;
}
