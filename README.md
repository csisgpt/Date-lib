# Date-lib

[![npm version](https://badge.fury.io/js/date-lib.svg)](https://badge.fury.io/js/date-lib)
[![build status](https://github.com/your/repo/actions/workflows/ci.yml/badge.svg)](https://github.com/your/repo/actions)
[![coverage](https://coveralls.io/repos/github/your/repo/badge.svg)](https://coveralls.io/github/your/repo)

**Date-lib** is a comprehensive, immutable and type‑safe DateTime library for TypeScript. It provides multi-format parsing, flexible formatting, timezone and localization support, a plugin system and utilities for durations, intervals and calendars. The library also includes natural language parsing helpers and lightweight reactive APIs.

## Installation

```bash
npm install date-lib
# or
yarn add date-lib
```

## Quick Start

```ts
import { DateTime } from 'date-lib';

const now = new DateTime();
const tomorrow = now.addDays(1);
const formatted = tomorrow.format('YYYY-MM-DD HH:mm:ss');

// Localized formatting
const persian = tomorrow.format('YYYY-MM-DD', 'fa');
```

## Core Concepts

- **Immutability** – all classes return new instances when modified.
- **DateTime** – main class wrapping JavaScript `Date` with timezone awareness.
- **Duration** – represents a span of time and provides arithmetic and formatting helpers.
- **Interval** – closed time interval with math utilities.
- **Plugin system** – extend `DateTime` via pluggable modules.

## API Overview

### DateTime
- `constructor(value?: Date | string | number | DateTime, offset?: number)` – create a new instance.
- `format(pattern: string, locale?: string): string` – format using tokens.
- `addDays/Weeks/Months/Years/Hours/Minutes/Seconds` – immutable addition helpers.
- `toTimeZone(tz: string): DateTime` – convert using IANA timezone.
- `withOffset(minutes: number): DateTime` – set explicit offset.
- Comparison helpers such as `isBefore`, `isAfter`, `isSameDay`, etc.

### Duration
- Factory helpers (`from`, `fromDays`, ...).
- Arithmetic: `add`, `subtract`, `multiply`, `divide`.
- Formatting via `format(locale)`.

### Interval
- `constructor(start: DateTime, end: DateTime)`.
- `contains`, `overlaps`, `intersection`, `union`, `splitBy`.
- `duration()` returns a `Duration`.

### Utilities
- `calendar` – convert between calendar systems.
- `parseNatural(text)` – extremely simple natural language parsing.
- `reactive.interval(ms)` – observable timer compatible with RxJS style.
- `ui.monthGrid(date)` – helper for building a month view grid.

## Localization Support

English (`en`) and Persian (`fa`) locale data are bundled. Select locale when formatting:

```ts
import { DateTime } from 'date-lib';

const dt = new DateTime('2020-01-01T00:00:00Z');
dt.format('YYYY MMMM DD', 'fa');
```

To add your own locale simply provide an object matching the structure in `locales/en.json` and pass the locale code to `format` or `Duration.format`.

## Plugins

Plugins augment the library without modifying core code. Register a plugin once:

```ts
import { DateTime } from 'date-lib';
import { examplePlugin } from 'date-lib/plugins/examplePlugin';

DateTime.use(examplePlugin);
const next = new DateTime().nextDay();
```

Custom plugins should implement the `Plugin` interface and can attach utilities or prototype methods. Use `DateTime.unuse('name')` to remove a plugin.

## Advanced Features

- **Timezone handling** using `toTimeZone` and low level offset helpers.
- **Multiple calendar systems** via the `calendar` utilities (`gregory`, `persian`, `islamic`).
- **Natural language parsing** with the `parseNatural` function.
- **Reactive APIs** providing a minimal observable implementation for timers and operators.

## Testing

Compile and run the test suite:

```bash
npm test
```

To check coverage (requires Node 20+):

```bash
npm run build && node --test --coverage dist/tests
```

## Contribution

Contributions are welcome! Feel free to open issues or pull requests on GitHub.
Please follow the existing TypeScript code style and include appropriate tests
for new features. Run `npm test` before submitting to ensure the build passes.

## License

This project is released under the [ISC License](LICENSE).
