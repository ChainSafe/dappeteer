declare module 'solc' {
  export function version(): string;
  export function semver(): string;
  export function license(): string;

  export let lowlevel: {
    compileSingle: (input: string) => string;
    compileMulti: (input: string) => string;
    compileCallback: (input: string) => string;
    compileStandard: (input: string) => string;
  };

  export let features: {
    legacySingleInput: boolean;
    multipleInputs: boolean;
    importCallback: boolean;
    nativeStandardJSON: boolean;
  };

  export type ReadCallbackResult = { contents: string } | { error: string };
  export type ReadCallback = (path: string) => ReadCallbackResult;
  export type Callbacks = { import: ReadCallback };
  export function compile(input: string, readCallback?: Callbacks): string;
}
