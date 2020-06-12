export function injectable(): ClassDecorator {
  return () => {
    // We just need to decorate a class for reflect-metadata to add
    // TypeScript specific metadata like "design:paramtypes"
  };
}
