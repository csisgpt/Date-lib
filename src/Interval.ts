import { DateTime } from './DateTime';
import { Duration } from './Duration';

export class Interval {
  constructor(public readonly start: DateTime, public readonly end: DateTime) {
    if (end.isBefore(start)) {
      throw new Error('End must be after start');
    }
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

  duration(): Duration {
    return new Duration(this.end.valueOf() - this.start.valueOf());
  }
}
