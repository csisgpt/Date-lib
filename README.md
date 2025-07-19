# Date-lib

A simple, immutable DateTime library written in TypeScript.

## Example Usage

```ts
import { DateTime } from './src';

const now = new DateTime();
const tomorrow = now.addDays(1);
console.log(tomorrow.format('YYYY-MM-DD HH:mm:ss'));
```

See tests for more examples.
