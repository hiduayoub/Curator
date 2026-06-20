/**
 * Errors raised by platform adapters.
 *
 * The `retryable` flag tells the worker whether to let BullMQ retry the job
 * (transient: rate limits, network blips) or fail it permanently (unsupported
 * URL, malformed upstream payload).
 */
export abstract class AdapterError extends Error {
  abstract readonly retryable: boolean;

  protected constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

/** Upstream API returned HTTP 429 / quota exhausted. Always retryable. */
export class RateLimitError extends AdapterError {
  override readonly retryable = true;

  constructor(public readonly retryAfterMs: number) {
    super(`Rate limited by upstream; retry after ${retryAfterMs}ms`);
  }
}

/** A transient fetch failure (timeout, 5xx, reset). Retryable by default. */
export class FetchError extends AdapterError {
  override readonly retryable: boolean;

  constructor(message: string, retryable = true) {
    super(message);
    this.retryable = retryable;
  }
}

/** Upstream payload could not be normalized. Never retryable. */
export class NormalizationError extends AdapterError {
  override readonly retryable = false;

  constructor(message: string) {
    super(message);
  }
}
