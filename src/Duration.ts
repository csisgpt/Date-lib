/** Duration represents a time span in milliseconds. */
export class Duration {
  constructor(public readonly milliseconds: number) {}

  static from({ days = 0, hours = 0, minutes = 0, seconds = 0, milliseconds = 0 }: {
    days?: number; hours?: number; minutes?: number; seconds?: number; milliseconds?: number;
  }): Duration {
    const ms =
      (((days * 24 + hours) * 60 + minutes) * 60 + seconds) * 1000 + milliseconds;
    return new Duration(ms);
  }

  add(other: Duration): Duration {
    return new Duration(this.milliseconds + other.milliseconds);
  }

  subtract(other: Duration): Duration {
    return new Duration(this.milliseconds - other.milliseconds);
  }

  valueOf(): number {
    return this.milliseconds;
  }

  toString(): string {
    const s = Math.floor(this.milliseconds / 1000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    const d = Math.floor(h / 24);
    return `${d}d ${h % 24}h ${m % 60}m ${s % 60}s`;
  }
}
