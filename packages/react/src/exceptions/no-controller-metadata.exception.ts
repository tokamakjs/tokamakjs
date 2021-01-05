export class NoControllerMetadataException extends Error {
  constructor(name: string) {
    super(
      `Could not resolve controller ${name} metadata. Make sure it's decorated with @Controller().`,
    );
  }
}
