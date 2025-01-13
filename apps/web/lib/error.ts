export class APIError extends Error {
  readonly name = 'APIError';

  constructor(
    public readonly status: number,
    message: string,
    public readonly data?: Record<string, unknown>,
    public readonly cause?: Error,
  ) {
    super(message);
    Object.setPrototypeOf(this, APIError.prototype);
  }

  toString(): string {
    return `${this.name} [${this.status}]: ${this.message}`;
  }

  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      status: this.status,
      message: this.message,
      data: this.data,
    };
  }
}
