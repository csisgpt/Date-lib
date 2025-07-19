/** Minimal reactive helpers compatible with RxJS Observable API */
export type TeardownLogic = () => void;

export interface Observer<T> {
  next(value: T): void;
  error?(err: any): void;
  complete?(): void;
}

export class Observable<T> {
  constructor(private _subscribe: (obs: Observer<T>) => TeardownLogic | void) {}

  subscribe(obs: Observer<T>): TeardownLogic {
    return this._subscribe(obs) || (() => {});
  }

  map<U>(fn: (v: T) => U): Observable<U> {
    return new Observable<U>((observer) => this.subscribe({
      next: (v) => observer.next(fn(v)),
      error: (e) => observer.error && observer.error(e),
      complete: () => observer.complete && observer.complete(),
    }));
  }
}

export function interval(ms: number): Observable<number> {
  return new Observable<number>((observer) => {
    let i = 0;
    const handle = setInterval(() => observer.next(i++), ms);
    return () => clearInterval(handle);
  });
}
