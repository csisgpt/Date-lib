declare module 'assert' {
  const assert: any;
  export default assert;
}

declare module 'node:test' {
  export function test(name: string, fn: () => any): void;
}

declare function setTimeout(handler: (...args: any[]) => void, timeout: number): any;
declare function setInterval(handler: (...args: any[]) => void, timeout: number): any;
declare function clearInterval(handle: any): void;
