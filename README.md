# Fallback AI

A professional TypeScript library for making API calls to multiple AI providers with automatic fallback and priority management.

## Features

- 🔄 **Automatic Fallback**: Automatically tries the next provider if one fails
- 🎯 **Priority Management**: Providers are tried in priority order (lower number = higher priority)
- 🔧 **Configurable**: Customizable timeouts, retryable errors, and priority updates
- 🛡️ **Error Handling**: Comprehensive error handling with detailed error information
- 📦 **TypeScript**: Full TypeScript support with type definitions
- ⚡ **Lightweight**: No heavy dependencies, uses native fetch API

## Installation

```bash
npm install fallback-ai
```

## Quick Start

```typescript
import { FallbackAI, AIProvider } from 'fallback-ai';

// Configure your providers
const providers = [
  {
    aiName: AIProvider.GROQ,
    apiKey: 'your-groq-api-key',
    model: 'llama3-8b-8192',
    priority: 1, // Highest priority
    parameters: {
      temperature: 0.7,
      max_tokens: 1000,
    },
  },
  {
    aiName: AIProvider.GEMINI,
    apiKey: 'your-gemini-api-key',
    model: 'gemini-pro',
    priority: 2, // Lower priority
    parameters: {
      temperature: 0.8,
    },
  },
];

// Create the client
const fallbackAI = new FallbackAI(providers);

// Make a call
try {
  const response = await fallbackAI.call('Hello, how are you?');
  console.log('Response:', response.content);
  console.log('Provider used:', response.provider);
} catch (error) {
  console.error('All providers failed:', error.message);
}
```

## API Reference

### FallbackAI

The main class for making AI API calls with fallback.

#### Constructor

```typescript
new FallbackAI(providers: Provider[], options?: FallbackAIOptions)
```

**Parameters:**
- `providers`: Array of AI providers to use
- `options`: Optional configuration (see `FallbackAIOptions`)

#### Methods

##### `call(prompt: string): Promise<AIResponse>`

Makes an API call to AI providers with automatic fallback.

**Parameters:**
- `prompt`: The prompt to send to the AI providers

**Returns:** Promise resolving to the AI response

**Throws:** Error if all providers fail

##### `getProviders(): Provider[]`

Gets the current list of providers.

**Returns:** Array of providers

##### `addProvider(provider: Provider): void`

Adds a new provider to the list.

**Parameters:**
- `provider`: Provider to add

##### `removeProvider(provider: Provider): void`

Removes a provider from the list.

**Parameters:**
- `provider`: Provider to remove

### Types

#### Provider

```typescript
interface Provider {
  aiName: AIProvider;
  apiKey: string;
  model: string;
  priority: number;
  parameters?: Record<string, any>;
}
```

#### AIResponse

```typescript
interface AIResponse {
  content: string;
  provider: AIProvider;
  metadata?: Record<string, any>;
}
```

#### AIError

```typescript
interface AIError {
  message: string;
  provider: AIProvider;
  statusCode?: number;
  retryable: boolean;
}
```

#### FallbackAIOptions

```typescript
interface FallbackAIOptions {
  enablePriorityUpdates?: boolean; // Default: true
  timeout?: number; // Default: 30000ms
  retryableCodes?: number[]; // Default: [408, 429, 500, 502, 503, 504]
}
```

### Enums

#### AIProvider

```typescript
enum AIProvider {
  GEMINI = 'gemini',
  GROQ = 'groq'
}
```

## Configuration

### Priority Updates

When a provider fails with a non-retryable error, its priority is automatically increased to move it lower in the queue:

```typescript
const fallbackAI = new FallbackAI(providers, {
  enablePriorityUpdates: true, // Default: true
});
```

### Custom Timeouts

Set custom timeouts for API calls:

```typescript
const fallbackAI = new FallbackAI(providers, {
  timeout: 60000, // 60 seconds
});
```

### Custom Retryable Errors

Define which HTTP status codes should be considered retryable:

```typescript
const fallbackAI = new FallbackAI(providers, {
  retryableCodes: [408, 429, 500, 502, 503, 504, 520], // Add 520
});
```

## Error Handling

The library provides comprehensive error handling:

```typescript
try {
  const response = await fallbackAI.call('Your prompt');
  // Success
} catch (error) {
  if (error.message.includes('All providers failed')) {
    // All providers failed
    console.error('No providers available');
  } else {
    // Other errors
    console.error('Unexpected error:', error);
  }
}
```

## Supported Providers

Currently supported AI providers:

- **Groq**: Fast inference API
- **Gemini**: Google's AI model

## Development

### Prerequisites

- Node.js >= 16.0.0
- npm or yarn

### Setup

```bash
git clone https://github.com/Rakshit4045/fallback-ai.git
cd fallback-ai
npm install
```

### Scripts

- `npm run build` - Build the project
- `npm run dev` - Build in watch mode
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Testing

```bash
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Author

**Rakshit Shinde** - [dev2th3core@gmail.com](mailto:dev2th3core@gmail.com)

## Changelog

### 1.0.0
- Initial release
- Support for Groq and Gemini providers
- Automatic fallback mechanism
- Priority management
- Comprehensive error handling