import { FetchError, RateLimitError } from "./errors";

/**
 * Helpers shared by the mock adapters. These exist purely to make Phase 3
 * behave like a real, flaky network so the worker's retry and error-handling
 * paths are genuinely exercised. The live adapters (later) will replace
 * {@link simulateNetwork} with real `fetch` calls.
 */

/** Inclusive random integer in `[min, max]`. */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Pick a random element from a non-empty array. */
export function randomChoice<T>(items: readonly [T, ...T[]]): T {
  // Length is guaranteed >= 1 by the tuple type, so the index is always valid.
  return items[randomInt(0, items.length - 1)] as T;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface SimulateOptions {
  /** Probability [0,1] of a 429 rate-limit error. */
  rateLimitRate?: number;
  /** Probability [0,1] of a transient fetch error. */
  fetchFailureRate?: number;
}

/**
 * Simulate a network round-trip: random latency plus a chance of transient
 * failures. Throws {@link RateLimitError} or {@link FetchError} so callers can
 * rely on the same control flow they'll use against real APIs.
 */
export async function simulateNetwork(
  options: SimulateOptions = {},
): Promise<void> {
  const { rateLimitRate = 0.08, fetchFailureRate = 0.08 } = options;

  await sleep(randomInt(120, 480));

  const roll = Math.random();
  if (roll < rateLimitRate) {
    throw new RateLimitError(randomInt(1_000, 5_000));
  }
  if (roll < rateLimitRate + fetchFailureRate) {
    throw new FetchError("Upstream request failed (simulated 503).");
  }
}
