import { FallbackAI, AIProvider, Provider } from './index';

// Mock fetch globally
(global as any).fetch = jest.fn();

describe('FallbackAI', () => {
  const mockProviders: Provider[] = [
    {
      aiName: AIProvider.GROQ,
      apiKey: 'test-groq-key',
      model: 'llama3-8b-8192',
      priority: 1,
      parameters: { temperature: 0.7 },
    },
    {
      aiName: AIProvider.GEMINI,
      apiKey: 'AIzaSyDleSV8LaZ658FVcyRzvmDftu5ghiqoUm8',
      model: 'gemini-2.0-flash',
      priority: 2,
      parameters: { temperature: 0.8 },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create instance with providers', () => {
      const fallbackAI = new FallbackAI(mockProviders);
      expect(fallbackAI.getProviders()).toHaveLength(2);
    });
    it('should throw error when no providers provided', () => {
      expect(() => new FallbackAI([])).toThrow('At least one provider must be specified');
    });
    it('should sort providers by priority', () => {
      const providers: Provider[] = [
        { ...mockProviders[1] } as Provider, // priority 2
        { ...mockProviders[0] } as Provider, // priority 1
      ];
      const fallbackAI = new FallbackAI(providers);
      const sortedProviders = fallbackAI.getProviders();
      expect(sortedProviders[0]?.priority).toBe(1);
      expect(sortedProviders[1]?.priority).toBe(2);
    });
  });

  describe('call', () => {
    it('should throw error for empty prompt', async () => {
      const fallbackAI = new FallbackAI(mockProviders);
      await expect(fallbackAI.call('')).rejects.toThrow('Prompt must be a non-empty string');
    });
    it('should throw error for non-string prompt', async () => {
      const fallbackAI = new FallbackAI(mockProviders);
      // @ts-ignore - Testing invalid input
      await expect(fallbackAI.call(null)).rejects.toThrow('Prompt must be a non-empty string');
    });
    it('should return successful response from first provider', async () => {
      const mockResponse = {
        choices: [{ message: { content: 'Hello from Groq!' } }],
        usage: { total_tokens: 10 },
      };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });
      const fallbackAI = new FallbackAI(mockProviders);
      const result = await fallbackAI.call('Hello');
      expect(result['choices'][0].message.content).toBe('Hello from Groq!');
      expect(result.provider).toBe(AIProvider.GROQ);
      expect(fetch).toHaveBeenCalledTimes(1);
    });
    it('should fallback to second provider when first fails with retryable error', async () => {
      const mockResponse = {
        choices: [{ message: { content: 'Hello from Gemini!' } }],
        usage: { total_tokens: 15 },
      };
      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: false,
          status: 429,
          json: () => Promise.resolve({ error: { message: 'Rate limited' } }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        });
      const fallbackAI = new FallbackAI(mockProviders);
      const result = await fallbackAI.call('Hello');
      expect(result['choices'][0].message.content).toBe('Hello from Gemini!');
      expect(result.provider).toBe(AIProvider.GEMINI);
      expect(fetch).toHaveBeenCalledTimes(2);
    });
    it('should attach status code to error object', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ error: { message: 'Bad request' } }),
      });
      const fallbackAI = new FallbackAI(mockProviders);
      try {
        await fallbackAI.call('test');
      } catch (error: any) {
        expect(error.message).toContain('Non-retryable error for "groq"');
        expect(error.message).toContain('Bad request');
      }
    });
    it('should throw error when all providers fail', async () => {
      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: false,
          status: 400,
          json: () => Promise.resolve({ error: { message: 'Bad request' } }),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
          json: () => Promise.resolve({ error: { message: 'Unauthorized' } }),
        });
      const fallbackAI = new FallbackAI(mockProviders);
      await expect(fallbackAI.call('Hello')).rejects.toThrow('All providers failed');
    });
    it('should update priorities for non-retryable errors', async () => {
      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: false,
          status: 400,
          json: () => Promise.resolve({ error: { message: 'Bad request' } }),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ response: { message: 'Hi' } }),
        });
      
      const fallbackAI = new FallbackAI(mockProviders);
      try {
        await fallbackAI.call('Hello');
      } catch (error) {
        // Expected to fail
      }
      const providers = fallbackAI.getProviders();
      expect(providers[0]!.priority).toBeGreaterThan(1);
    });
  });

  describe('getProviders', () => {
    it('should return a copy of the providers array', () => {
      const fallbackAI = new FallbackAI(mockProviders);
      const providers = fallbackAI.getProviders();
      providers.forEach((provider, i) => {
        expect(provider).toMatchObject(mockProviders[i] as Provider);
      });
      expect(providers).not.toBe((fallbackAI as any)['providers']);
    });
  });

  describe('addProvider', () => {
    it('should add a new provider and sort by priority', () => {
      const fallbackAI = new FallbackAI(mockProviders);
      const newProvider: Provider = {
        aiName: AIProvider.MISTRAL,
        apiKey: 'test-mistral-key',
        model: 'mistral-model',
        priority: 0,
      };
      fallbackAI.addProvider(newProvider);
      const providers = fallbackAI.getProviders();
      expect(providers).toHaveLength(3);
      expect(providers[0]?.aiName).toBe(AIProvider.MISTRAL);
    });
  });

  describe('removeProvider', () => {
    it('should remove a provider from the list', () => {
      const fallbackAI = new FallbackAI(mockProviders);
      const providerToRemove = fallbackAI.getProviders()[0];
      if (providerToRemove) {
        fallbackAI.removeProvider(providerToRemove);
        expect(fallbackAI.getProviders()).toHaveLength(1);
      }
    });
    it('should do nothing if provider is not found', () => {
      const fallbackAI = new FallbackAI(mockProviders);
      const fakeProvider: Provider = {
        aiName: AIProvider.MISTRAL,
        apiKey: 'fake-key',
        model: 'fake-model',
        priority: 99,
      };
      fallbackAI.removeProvider(fakeProvider);
      expect(fallbackAI.getProviders()).toHaveLength(2);
    });
  });
}); 