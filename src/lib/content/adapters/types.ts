import {
  type Platform,
  type UnifiedContentModel,
} from "../unified-content-model";

/**
 * A platform adapter fetches a URL from its upstream API and maps the raw
 * response into the {@link UnifiedContentModel}. In Phase 3 these are mocked;
 * the signature is the real contract the live adapters will implement.
 */
export interface PlatformAdapter {
  readonly platform: Platform;
  /**
   * @throws {RateLimitError | FetchError} on transient failures (retryable)
   * @throws {NormalizationError} when the payload can't be mapped (permanent)
   */
  fetchAndNormalize(url: string): Promise<UnifiedContentModel>;
}
