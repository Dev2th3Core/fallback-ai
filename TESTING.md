# Local Testing Guide for Fallback AI

This guide shows you how to test your `fallback-ai` package locally without publishing to npm.

## 🎯 **Method 1: Direct Import (Recommended for Quick Testing)**

### **Step 1: Build the package**
```bash
npm run build
```

### **Step 2: Run the test script**
```bash
node test-simple.js
```

This method imports directly from the `dist` folder and tests all basic functionality.

---

## 🔗 **Method 2: npm link (Recommended for Development)**

### **Step 1: Build and link the package**
```bash
npm run build
npm link
```

### **Step 2: Create a test project**
```bash
mkdir test-fallback-ai
cd test-fallback-ai
npm init -y
```

### **Step 3: Link to your package**
```bash
npm link fallback-ai
```

### **Step 4: Create a test file**
Create `test.js`:
```javascript
const { FallbackAI, AIProvider } = require('fallback-ai');

const providers = [
  {
    aiName: AIProvider.GROQ,
    apiKey: 'your-groq-key',
    model: 'llama3-8b-8192',
    priority: 1,
  },
  {
    aiName: AIProvider.GEMINI,
    apiKey: 'your-gemini-key',
    model: 'gemini-pro',
    priority: 2,
  },
];

const fallbackAI = new FallbackAI(providers);

// Test the package
async function test() {
  try {
    const response = await fallbackAI.call('Hello, how are you?');
    console.log('Response:', response);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

test();
```

### **Step 5: Run the test**
```bash
node test.js
```

---

## 📦 **Method 3: Local npm install**

### **Step 1: Build the package**
```bash
npm run build
```

### **Step 2: Create a test project**
```bash
mkdir test-fallback-ai
cd test-fallback-ai
npm init -y
```

### **Step 3: Install your package locally**
```bash
npm install ../fallback-ai
```

### **Step 4: Create and run test file**
Same as Method 2, Step 4.

---

## 🧪 **Method 4: TypeScript Testing**

### **Step 1: Build and link**
```bash
npm run build
npm link
```

### **Step 2: Create TypeScript test**
Create `test.ts`:
```typescript
import { FallbackAI, AIProvider, Provider } from 'fallback-ai';

const providers: Provider[] = [
  {
    aiName: AIProvider.GROQ,
    apiKey: 'your-groq-key',
    model: 'llama3-8b-8192',
    priority: 1,
  },
  {
    aiName: AIProvider.GEMINI,
    apiKey: 'your-gemini-key',
    model: 'gemini-pro',
    priority: 2,
  },
];

const fallbackAI = new FallbackAI(providers);

async function test() {
  try {
    const response = await fallbackAI.call('Hello, how are you?');
    console.log('Response:', response);
    console.log('Type checking works!');
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

test();
```

### **Step 3: Run with ts-node**
```bash
npx ts-node test.ts
```

---

## 🔧 **Method 5: Real API Testing**

To test with real API calls, you'll need actual API keys:

### **Step 1: Set up environment variables**
Create `.env` file:
```env
GROQ_API_KEY=your_actual_groq_key
GEMINI_API_KEY=your_actual_gemini_key
```

### **Step 2: Create test with real keys**
```javascript
require('dotenv').config();
const { FallbackAI, AIProvider } = require('fallback-ai');

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
    model: 'gemini-pro',
    priority: 2,
  },
];

const fallbackAI = new FallbackAI(providers);

async function testRealAPI() {
  try {
    console.log('Testing with real API...');
    const response = await fallbackAI.call('What is 2 + 2?');
    console.log('Success!');
    console.log('Content:', response.content);
    console.log('Provider used:', response.provider);
    console.log('Metadata:', response.metadata);
  } catch (error) {
    console.error('API Error:', error.message);
  }
}

testRealAPI();
```

---

## 🎯 **What Each Method Tests**

| Method | Tests | Use Case |
|--------|-------|----------|
| **Direct Import** | Basic functionality, no API calls | Quick validation |
| **npm link** | Full package integration | Development testing |
| **Local install** | Installation process | Pre-publish testing |
| **TypeScript** | Type definitions | Type safety validation |
| **Real API** | Actual API integration | End-to-end testing |

---

## 🚀 **Quick Start Commands**

```bash
# Quick test (no API calls)
npm run build && node test-simple.js

# Development testing
npm run build && npm link
# Then in another project: npm link fallback-ai

# Full testing with real APIs
npm run build && node test-real-api.js
```

---

## 🔍 **Troubleshooting**

### **Module not found error**
- Make sure you ran `npm run build` first
- Check that the `dist` folder exists
- Verify the import path is correct

### **TypeScript errors**
- Install `ts-node`: `npm install -g ts-node`
- Or use `npx ts-node test.ts`

### **API errors**
- Check your API keys are valid
- Verify the API endpoints are accessible
- Check your internet connection

---

## 📝 **Next Steps**

After local testing passes:
1. Run the full test suite: `npm test`
2. Check for linting issues: `npm run lint`
3. Format code: `npm run format`
4. Publish to npm: `npm publish` 