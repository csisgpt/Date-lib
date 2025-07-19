import { DateTime } from './DateTime';

/** Generate a grid of DateTime objects for a month */
export function monthGrid(date: DateTime, weekStart = 0): DateTime[][] {
  const first = date.setDay(1);
  const startDay = (first.toDate().getDay() - weekStart + 7) % 7;
  let current = first.addDays(-startDay);
  const grid: DateTime[][] = [];
  for (let w = 0; w < 6; w++) {
    const week: DateTime[] = [];
    for (let d = 0; d < 7; d++) {
      week.push(current);
      current = current.addDays(1);
    }
    grid.push(week);
  }
  return grid;
}
