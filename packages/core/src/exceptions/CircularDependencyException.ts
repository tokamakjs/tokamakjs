export class CircularDependencyException extends Error {
  constructor(context?: string) {
    const ctx = context ? ` inside ${context}` : ``;
    super(
      `A circular dependency has been detected${ctx}. Please, make sure that each side of a bidirectional relationship is decorated with "forwardRef()".`,
    );
  }
}
