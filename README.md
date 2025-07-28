# fallback-ai

[![npm version](https://img.shields.io/npm/v/fallback-ai.svg)](https://www.npmjs.com/package/fallback-ai)
[![Build Status](https://img.shields.io/github/actions/workflow/status/Dev2th3Core/fallback-ai/ci.yml?branch=main)](https://github.com/Dev2th3Core/fallback-ai/actions)
[![License](https://img.shields.io/npm/l/fallback-ai.svg)](./LICENSE)
[![Downloads](https://img.shields.io/npm/dm/fallback-ai.svg)](https://www.npmjs.com/package/fallback-ai)

A professional TypeScript library for making API calls to multiple free AI providers with automatic fallback and priority management.

## Features

- **Multi-provider AI orchestration** - Support for Groq, Gemini, Mistral, Cerebras, and more
- **Automatic fallback** - Seamlessly switches to the next provider on failure
- **Priority management** - Providers are tried in priority order with automatic recovery
- **TypeScript support** - Full type definitions and IntelliSense support
- **Lightweight** - No heavy dependencies, uses native fetch API
- **Configurable** - Customizable timeouts, retryable errors, and priority updates
- **Error handling** - Comprehensive error information with provider details
- **Extensible** - Easy to add new providers and customize behavior

---

## Installation

Using npm:

```bash
$ npm install fallback-ai
```

Using yarn:

```bash
$ yarn add fallback-ai
```

Using pnpm:

```bash
$ pnpm add fallback-ai
```

---

## Quick Start

### Basic Example
```ts
import { FallbackAI, AIProvider } from 'fallback-ai';

const providers = [
  {
    aiName: AIProvider.GROQ,
    apiKey: 'your_groq_key',
    model: 'llama3-8b-8192',
    priority: 1,
    parameters: { temperature: 0.7 },
  },
  {
    aiName: AIProvider.GEMINI,
    apiKey: 'your_gemini_key',
    model: 'gemini-2.0-flash',
    priority: 2,
    parameters: { temperature: 0.8 },
  },
];

const fallbackAI = new FallbackAI(providers);

(async () => {
  try {
    const response = await fallbackAI.call('Hello, world!');
    console.log('Response:', response.choices[0].message.content);
    console.log('Provider used:', response.provider);
  } catch (error) {
    console.error('All providers failed:', error.message);
  }
})();
```

### Advanced Example with Error Handling
```ts
import { FallbackAI, AIProvider } from 'fallback-ai';

const providers = [
  {
    aiName: AIProvider.GROQ,
    apiKey: process.env.GROQ_API_KEY,
    model: 'llama3-8b-8192',
    priority: 1,
  },
  {
    aiName: AIProvider.GEMINI,
    apiKey: process.env.GEMINI_API_KEY,
    model: 'gemini-2.0-flash',
    priority: 2,
  },
  {
    aiName: AIProvider.MISTRAL,
    apiKey: process.env.MISTRAL_API_KEY,
    model: 'mistral-large-latest',
    priority: 3,
  },
];

const fallbackAI = new FallbackAI(providers, {
  enablePriorityUpdates: true,
  timeout: 30000,
  retryableCodes: [429, 500, 502, 503],
});

(async () => {
  try {
    const response = await fallbackAI.call('Explain quantum computing in simple terms');
    
    console.log('✅ Success!');
    console.log('Provider:', response.provider);
    console.log('Response:', response.choices[0].message.content);
    console.log('Tokens used:', response.usage?.total_tokens);
    
  } catch (error) {
    console.error('❌ All providers failed');
    if (error.errors) {
      error.errors.forEach((err: any) => {
        console.error(`- ${err.provider}: ${err.message}`);
      });
    }
  }
})();
```

---

## Configuration

### Provider Configuration

Each provider requires specific configuration:

```ts
{
  aiName: AIProvider.GROQ,           // Required: Provider enum
  apiKey: 'your-api-key',            // Required: API key
  model: 'llama3-8b-8192',          // Required: Model name
  priority: 1,                       // Required: Priority (lower = higher)
  parameters: {                      // Optional: Additional API params
    temperature: 0.7,
    max_tokens: 1000,
    top_p: 0.9,
  },
}
```

### Supported Providers

| Provider | Base URL | Example Model | Notes |
|----------|----------|---------------|-------|
| Groq | `https://api.groq.com/openai/v1` | `llama3-8b-8192` | Fast inference |
| Gemini | `https://generativelanguage.googleapis.com/v1beta/openai` | `gemini-2.0-flash` | Google's model |
| Mistral | `https://api.mistral.ai/v1` | `mistral-large-latest` | European provider |
| Cerebras | `https://api.cerebras.ai/v1` | `cerebras-model` | Specialized models |

### Options Configuration

```ts
const options: FallbackAIOptions = {
  enablePriorityUpdates: true,        // Auto-deprioritize failed providers
  timeout: 30000,                     // 30 second timeout
  retryableCodes: [429, 500, 502, 503], // HTTP codes to retry
  retryableErrorTimeout: 300000,      // 5 minutes recovery for retryable errors
  nonRetryableErrorTimeout: 1800000,  // 30 minutes recovery for non-retryable errors
};
```

### Environment Variables

For security, use environment variables for API keys:

```ts
import dotenv from 'dotenv';
dotenv.config();

const providers = [
  {
    aiName: AIProvider.GROQ,
    apiKey: process.env.GROQ_API_KEY!,
    model: 'llama3-8b-8192',
    priority: 1,
  },
  // ... more providers
];
```
### Custom Parameters

Pass additional parameters to each provider:

```ts
const providers = [
  {
    aiName: AIProvider.GROQ,
    apiKey: 'your-key',
    model: 'llama3-8b-8192',
    priority: 1,
    parameters: {
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 0.9,
      frequency_penalty: 0.1,
      presence_penalty: 0.1,
    },
  },
];
```

## Contributing

The main purpose of this repository is to provide minimum downtime for free Generative AI based applications. Read below to learn how you can take part in improving `fallback-ai`.

### [Code of Conduct](./CODE_OF_CONDUCT.md)

This repository has adopted a Code of Conduct that we expect project participants to adhere to. Please read [the full text](./CODE_OF_CONDUCT.md) so that you can understand what actions will and will not be tolerated.

### [Contributing Guide](./CONTRIBUTING.md)

Read our [contributing guide](./CONTRIBUTING.md) to learn about our development process, how to propose bugfixes and improvements, and how to build and test your changes to `fallback-ai`.

### [Good First Issues](https://github.com/Dev2th3Core/fallback-ai/labels/good%20first%20issue)

To help you get your feet wet and get you familiar with our contribution process, we have a list of [good first issues](https://github.com/Dev2th3Core/fallback-ai/labels/good%20first%20issue) that contain bugs that have a relatively limited scope. This is a great place to get started.

---

## License

`fallback-ai` is [MIT licensed](./LICENSE).

---
