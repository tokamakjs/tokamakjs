export class UnknownExportException extends Error {
  constructor(token: string, module: string) {
    super(
      `Cannot export a provider/module that is not a part of the currently processed module (${module}). Please verify whether the exported ${token} is available in this particular context.

Possible Solutions:
- Is ${token} part of the relevant providers/imports within ${module}?
`,
    );
  }
}
