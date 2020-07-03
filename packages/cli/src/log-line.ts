export function logLine(...messages: Array<string>): void {
  if (messages.length <= 0) {
    process.stdout.write('\n');
  } else {
    process.stdout.write(messages.join(' ') + '\n');
  }
}
