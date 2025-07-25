import { Provider, FallbackAIOptions } from "./types";

/**
 * Sorts providers by priority (lower priority = higher precedence)
 */
export function sortProviders(providers: Provider[]): void {
  providers.sort((a, b) => a.priority - b.priority);
}

/**
 * Updates priorities for providers that failed with non-retryable errors
 * @param providers - All providers
 * @param providersToUpdate - Providers to update
 */
export function updateProviderPriorities(providers: Provider[], providersToUpdate: Provider[]): void {
  for (const provider of providersToUpdate) {
    provider.priority += providers.length;
  }
  sortProviders(providers);
}

/**
 * Checks and recovers provider priority based on failure type and time
 * @param provider - Provider to check
 * @param options - FallbackAI options
 */
export function checkAndRecoverPriority(provider: Provider, options: Required<FallbackAIOptions>): void {
  if (!provider.lastFailureTime || !provider.lastFailureType) {
    return; // No previous failure
  }

  const now = Date.now();
  const timeSinceFailure = now - provider.lastFailureTime;
  let shouldRecover = false;

  if (provider.lastFailureType === 'retryable') {
    shouldRecover = timeSinceFailure > options.retryableErrorTimeout;
  } else {
    shouldRecover = timeSinceFailure > options.nonRetryableErrorTimeout;
  }

  if (shouldRecover) {
    provider.priority = provider.originalPriority!;
    delete provider.lastFailureTime;
    delete provider.lastFailureType;
  }
}

/**
 * Recovers provider priority on successful API call
 * @param provider - Provider that succeeded
 */
export function recoverPriorityOnSuccess(provider: Provider): void {
  if (provider.lastFailureTime && provider.lastFailureType) {
    // Reset to original priority on success
    provider.priority = provider.originalPriority!;
    delete provider.lastFailureTime;
    delete provider.lastFailureType;
  }
} 