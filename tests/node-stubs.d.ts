declare module 'assert' {
  const assert: any;
  export default assert;
}

declare module 'node:test' {
  export function test(name: string, fn: () => any): void;
}
