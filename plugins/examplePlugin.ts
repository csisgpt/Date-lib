import { DateTime, Plugin } from '../src';

export const examplePlugin: Plugin = {
  name: 'example',
  initialize({ DateTime }) {
    (DateTime.prototype as any).nextDay = function(): DateTime {
      return (this as DateTime).addDays(1);
    };
  },
  teardown({ DateTime }) {
    delete (DateTime.prototype as any).nextDay;
  }
};

declare module '../src/DateTime' {
  interface DateTime {
    nextDay(): DateTime;
  }
}
