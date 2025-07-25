/**
 * @copyright 2025 Dev2th3Core <dev2th3core@gmail.com>
 * @license MIT
 */

import { AIProvider, Provider, ProviderConfig, AIResponse, AIError, FallbackAIOptions } from "./types";
import { sortProviders, updateProviderPriorities, checkAndRecoverPriority, recoverPriorityOnSuccess } from "./priority";

export { AIProvider, Provider, ProviderConfig, AIResponse, AIError } from "./types";

export const PROVIDER_MAP: Record<AIProvider, ProviderConfig> = {
  [AIProvider.GROQ]: {
    baseUrl: "https://api.groq.com/openai/v1",
  },
  [AIProvider.GEMINI]: {
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai",
  },
  [AIProvider.MISTRAL]: {
    baseUrl: "https://api.mistral.ai/v1",
  },
  [AIProvider.CEREBRAS]: {
    baseUrl: "https://api.cerebras.ai/v1",
  }
};

const RETRYABLE_CODES = [429, 500];

export class FallbackAI {
  private providers: Provider[];
  private options: Required<FallbackAIOptions>;

  /**
   * Creates a new FallbackAI instance
   * @param providers - Array of AI providers to use
   * @param options - Configuration options
   */
  constructor(providers: Provider[], options: FallbackAIOptions = {}) {
    if (!providers || providers.length === 0) {
      throw new Error("At least one provider must be specified");
    }

    this.providers = providers.map(provider => ({
      ...provider,
      originalPriority: provider.originalPriority ?? provider.priority,
    }));
    this.options = {
      enablePriorityUpdates: options.enablePriorityUpdates ?? true,
      timeout: options.timeout ?? 30000,
      retryableCodes: options.retryableCodes ?? RETRYABLE_CODES,
      retryableErrorTimeout: options.retryableErrorTimeout ?? 300000, // 5 minutes
      nonRetryableErrorTimeout: options.nonRetryableErrorTimeout ?? 1800000, // 30 minutes
    };

    sortProviders(this.providers);
  }

  /**
   * Makes an API call to AI providers with automatic fallback
   * @param prompt - The prompt to send to the AI providers
   * @returns Promise resolving to the AI response
   * @throws Error if all providers fail
   */
  async call(prompt: string): Promise<AIResponse> {
    if (!prompt || typeof prompt !== 'string') {
      throw new Error("Prompt must be a non-empty string");
    }

    const providersToUpdate: Provider[] = [];
    const errors: AIError[] = [];

    for (const provider of this.providers) {
      checkAndRecoverPriority(provider, this.options);
      try {
        const response = await this.makeProviderCall(provider, prompt);
        if(provider.originalPriority != provider.priority) recoverPriorityOnSuccess(provider);
        if (providersToUpdate.length > 0) {
          updateProviderPriorities(this.providers, providersToUpdate);
        }
        return {
          ...response,
          provider: provider.aiName,
          ...(errors.length > 0 && { errors }),
        };
      } catch (error) {
        const aiError = this.createAIError(provider, error);
        errors.push(aiError);
        if (!aiError.retryable && this.options.enablePriorityUpdates) {
          providersToUpdate.push(provider);
        }
        provider.lastFailureTime = Date.now();
        provider.lastFailureType = aiError.retryable ? 'retryable' : 'non-retryable';
        continue;
      }
    }
    throw new Error(`All providers failed. Errors: ${errors.map(e => `${e.provider}: ${e.message}`).join(', ')}`);
  }

  /**
   * Makes a single API call to a specific provider
   * @param provider - The provider to call
   * @param prompt - The prompt to send
   * @returns Promise resolving to the API response
   */
  private async makeProviderCall(provider: Provider, prompt: string): Promise<any> {
    const body = this.generateRequestBody(provider, prompt);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.options.timeout);

    try {
      const response = await fetch(`${PROVIDER_MAP[provider.aiName].baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${provider.apiKey}`,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({})) as any;
        const errorObj = Array.isArray(errorBody) ? errorBody[0] : errorBody;
        const statusCode = response.status;
        const isRetryable = this.options.retryableCodes.includes(statusCode);

        const error = new Error(
          `${isRetryable ? 'Retryable' : 'Non-retryable'} error for "${provider.aiName}": ${errorObj?.error?.message || "Unknown error"}`
        );
        (error as any).statusCode = statusCode;
        (error as any).errorBody = errorObj; // Attach the full error object
        throw error;
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Generates the request body for an API call
   * @param provider - The provider configuration
   * @param prompt - The prompt to send
   * @returns The request body object
   */
  private generateRequestBody(provider: Provider, prompt: string): any {
    const body: any = {
      model: provider.model,
      messages: [
        { role: "user", content: prompt }
      ],
    };
    if (provider.parameters) {
      Object.assign(body, provider.parameters);
    }
    return body;
  }

  /**
   * Creates an AIError object from a caught error
   * @param provider - The provider that caused the error
   * @param error - The caught error
   * @returns AIError object
   */
  private createAIError(provider: Provider, error: any): AIError {
    const message = error.message || "Unknown error";
    const statusCode = (error as any).statusCode;
    const isRetryable = statusCode ? this.options.retryableCodes.includes(statusCode) : false;
    return {
      ...error,
      message,
      provider: provider.aiName,
      statusCode,
      retryable: isRetryable,
      errorBody: error.errorBody, // Add this line
    };
  }

  /**
   * Gets the current list of providers
   * @returns Array of providers
   */
  getProviders(): Provider[] {
    return [...this.providers];
  }

  /**
   * Adds a new provider to the list (Advanced feature)
   * @warning This method automatically re-sorts providers by priority.
   * For most use cases, prefer static configuration in the constructor.
   * 
   * @param provider - Provider to add
   */
  addProvider(provider: Provider): void {
    this.providers.push(provider);
    sortProviders(this.providers);
  }

  /**
   * Removes a provider from the list
   * @param provider - Provider to remove
   */
  removeProvider(provider: Provider): void {
    const index = this.providers.findIndex(p => p === provider);
    if (index !== -1) {
      this.providers.splice(index, 1);
    }
  }
}