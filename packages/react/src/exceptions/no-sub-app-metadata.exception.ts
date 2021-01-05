export class NoSubAppMetadataException extends Error {
  constructor(name: string) {
    super(`Could not resolve sub app ${name} metadata. Make sure it's decorated with @SubApp().`);
  }
}
