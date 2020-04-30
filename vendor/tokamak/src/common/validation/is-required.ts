export function isRequired(message: string = 'This field is required') {
  return (value: any): string | undefined => {
    return value != null && value != '' ? message : undefined;
  };
}
