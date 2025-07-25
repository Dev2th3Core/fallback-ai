/**
 * Supported AI providers
 */
export enum AIProvider {
    GEMINI = 'gemini',
    GROQ = 'groq',
    MISTRAL = 'mistral',
    CEREBRAS = 'cerebras'
}

/**
 * Configuration for an AI provider
 */
export interface Provider {
    /** The AI provider name */
    aiName: AIProvider;
    /** API key for the provider */
    apiKey: string;
    /** Model name to use */
    model: string;
    /** Priority level (lower = higher priority) */
    priority: number;
    /** Original priority level (for recovery) */
    originalPriority?: number;
    /** Timestamp of last failure (for recovery) */
    lastFailureTime?: number;
    /** Type of last failure (for recovery) */
    lastFailureType?: 'retryable' | 'non-retryable';
    /** Additional parameters for the API call */
    parameters?: Record<string, any>;
}

/**
 * Provider-specific configuration
 */
export interface ProviderConfig {
    /** Base URL for the provider's API */
    baseUrl: string;
    // Add more fields as needed for provider-specific logic
}

/**
 * Response from an AI provider
 * Extends the original API response with provider information
 */
export interface AIResponse {
  /** Provider that generated the response */
  provider: AIProvider;
  /** Errors from failed providers (if any) */
  errors?: AIError[];
  /** All original API response fields */
  [key: string]: any;
}

/**
 * Error information
 * Extends the original API error with provider and retryable info
 */
export interface AIError {
  /** Error message */
  message: string;
  /** Provider that caused the error */
  provider: AIProvider;
  /** HTTP status code if applicable */
  statusCode?: number;
  /** Whether the error is retryable */
  retryable: boolean;
  /** The full error object returned by the API, if available */
  errorBody?: any;
  /** All original error fields */
  [key: string]: any;
}

export interface FallbackAIOptions {
  /** Whether to enable priority updates after failed calls */
  enablePriorityUpdates?: boolean;
  /** Custom timeout for API calls in milliseconds */
  timeout?: number;
  /** Custom retryable status codes */
  retryableCodes?: number[];
  /** Timeout for retryable error priority recovery (milliseconds) */
  retryableErrorTimeout?: number;
  /** Timeout for non-retryable error priority recovery (milliseconds) */
  nonRetryableErrorTimeout?: number;
}