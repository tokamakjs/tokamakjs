// Type definitions for @larsbs/progress
// Project: @larsbs/progress
// Definitions by: Lars

declare module '@larsbs/progress' {
  type ProgressCallback = (instance?: Progress) => void;

  interface ProgressOptions {
    readonly total: number;
    readonly curr?: number;
    readonly width?: number;
    readonly stream?: NodeJS.WriteStream;
    readonly head?: string;
    readonly complete?: string;
    readonly incomplete?: string;
    readonly renderThrottle?: number;
    readonly callback?: ProgressCallback;
    readonly clear?: boolean;
    readonly silent?: boolean;
  }

  class Progress {
    lastDraw: string;
    constructor(format: string, options: ProgressOptions);
    tick(len: number): void;
    tick(len: number, tokens: { [key: string]: string }): void;
    render(tokens: { [key: string]: string }): void;
    update(ratio: number, tokens: { [key: string]: string }): void;
    interrupt(message: string): void;
    terminate(): void;
  }

  export = Progress;
}
