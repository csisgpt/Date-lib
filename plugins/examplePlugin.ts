import { DateTime } from '../src/DateTime';

export function examplePlugin(dtClass: typeof DateTime) {
  (dtClass.prototype as any)['nextDay'] = function(): DateTime {
    return (this as DateTime).addDays(1);
  };
}
