declare module 'initial-app-message' {
  function initialMessage(
    name: string,
    port: string | number,
    envVars: Array<string>,
  ): Array<string>;

  export = initialMessage;
}
