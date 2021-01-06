export class NoProviderMetadataException extends Error {
  constructor(name: string) {
    super(
      `Could not resolve provider ${name} metadata. Make sure it's decorated with @Injectable().`,
    );
  }
}
