import { sortProviders, updateProviderPriorities, checkAndRecoverPriority, recoverPriorityOnSuccess } from './priority';
import { Provider, FallbackAIOptions, AIProvider } from './types';

describe('priority.ts', () => {
  let providers: Provider[];

  beforeEach(() => {
    providers = [
      { aiName: AIProvider.GROQ, apiKey: 'a', model: 'm', priority: 2 },
      { aiName: AIProvider.GEMINI, apiKey: 'b', model: 'm', priority: 1 },
    ];
  });

  it('sortProviders sorts by priority', () => {
    sortProviders(providers);
    expect(providers[0]!.priority).toBe(1);
    expect(providers[1]!.priority).toBe(2);
  });

  it('updateProviderPriorities increases priority and sorts', () => {
    const toUpdate = [providers[0]!];
    updateProviderPriorities(providers, toUpdate);
    expect(providers[1]!.priority).toBeGreaterThan(providers[0]!.priority);
  });

  it('checkAndRecoverPriority resets priority after timeout', () => {
    const options = {
      retryableErrorTimeout: 0,
      nonRetryableErrorTimeout: 0,
      enablePriorityUpdates: true,
      timeout: 1000,
      retryableCodes: [429, 500],
    };
    providers[0]!.originalPriority = 2;
    providers[0]!.priority = 10;
    providers[0]!.lastFailureTime = Date.now() - 1000;
    providers[0]!.lastFailureType = 'retryable';
    checkAndRecoverPriority(providers[0]!, options as Required<FallbackAIOptions>);
    expect(providers[0]!.priority).toBe(2);
    expect(providers[0]!.lastFailureTime).toBeUndefined();
  });

  it('recoverPriorityOnSuccess resets priority and clears failure info', () => {
    providers[0]!.originalPriority = 2;
    providers[0]!.priority = 10;
    providers[0]!.lastFailureTime = Date.now();
    providers[0]!.lastFailureType = 'non-retryable';
    recoverPriorityOnSuccess(providers[0]!);
    expect(providers[0]!.priority).toBe(2);
    expect(providers[0]!.lastFailureTime).toBeUndefined();
    expect(providers[0]!.lastFailureType).toBeUndefined();
  });
}); 