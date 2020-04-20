export function controller(): ClassDecorator {
  return () => {
    // We just need the decorator so reflect-metadata adds
    // TypeScript metadata like "design:paramtypes"
  };
}
