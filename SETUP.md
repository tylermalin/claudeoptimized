# Claude Token Optimizer - Setup Guide

A production-ready tool to automatically minimize token usage when using the Claude API.

## ⚡ Features

- **Automatic Model Selection**: Chooses between Haiku (fast), Sonnet (balanced), or Opus (powerful) based on task complexity
- **Prompt Caching**: Caches identical requests to reduce token usage
- **Streaming**: Real-time streaming for large responses (more token-efficient)
- **Batch Processing**: Process multiple requests with 50% token discount
- **Token Analytics**: Track usage patterns and identify optimization opportunities
- **Intelligent Retry**: Graceful degradation to cheaper models if needed

## 📦 Installation

### Prerequisites

- Node.js 18+
- Anthropic API key: <https://console.anthropic.com>

### Setup Steps

```bash
# 1. Clone the repository
git clone https://github.com/tylermalin/claudeoptimized.git
cd claudeoptimized

# 2. Install backend dependencies
npm install

# 3. Install frontend dependencies
cd client && npm install
cd ..

# 4. Set up environment
cp .env.template .env
# Edit .env and add your ANTHROPIC_API_KEY
```

## 🚀 Quick Start

### 1. Launch the Chat App

The easiest way to use the optimizer is via the built-in terminal UI:

```bash
# Start backend
node server.js

# Start frontend (in a separate terminal)
cd client && npm run dev
```

Open `http://localhost:5173/` to start chatting!

### 2. Programmatic Usage

You can also use the optimizer directly in your code:

```javascript
const ClaudeTokenOptimizer = require("./claude-token-optimizer");

const optimizer = new ClaudeTokenOptimizer({
  enableCaching: true,
  enableStreaming: true,
});

// Simple query - auto-selects Haiku
const response = await optimizer.optimizedCall("What is 2+2?");
console.log(response.content);
console.log(`Tokens used: ${response.tokensUsed}`);
```

### With Options

```javascript
// Control model selection
const response = await optimizer.optimizedCall(
  "Explain quantum computing in detail",
  {
    systemPrompt: "You are an expert physicist.",
    complexity: "high", // Forces Opus model
    streaming: true,    // Stream response
  }
);

// Or force specific model
const response = await optimizer.optimizedCall("Your prompt", {
  forceModel: "claude-haiku-4-5-20251001",
});
```

## 🎯 How It Works

### Automatic Model Selection

The optimizer analyzes your prompt and selects the most cost-effective model:

```text
Prompt Length < 20 words OR simple queries
  → Claude Haiku (fastest, ~50% cheaper than Sonnet)
       ↓
Medium complexity with reasoning
  → Claude Sonnet (balanced performance/cost)
       ↓
Complex analysis, multi-step reasoning
  → Claude Opus (most capable, necessary for hard tasks)
```

**Token Costs (relative):**

- Haiku: 1x (baseline)
- Sonnet: ~2x
- Opus: ~6x

### Caching Strategy

Identical prompts are cached in memory to avoid re-processing:

```javascript
// First call: uses API, consumes tokens
await optimizer.optimizedCall("How do I use caching?");

// Second call: returns from cache, ZERO tokens
await optimizer.optimizedCall("How do I use caching?");
```

### Streaming Advantage

For long responses (>500 tokens), streaming is more efficient:

```javascript
// Streaming processes tokens as they arrive
// Perfect for reporting, document generation, code
await optimizer.optimizedCall("Generate a 2000-word essay", {
  streaming: true,
});
```

### Batch Processing (50% Discount)

Process multiple requests at once for significant savings:

```javascript
const requests = [
  { prompt: "Translate to Spanish: Hello" },
  { prompt: "Translate to French: Hello" },
  { prompt: "Translate to German: Hello" },
];

// Uses Anthropic Batch API for 50% token discount
const results = await optimizer.batchProcess(requests);
```

## 📊 Configuration Options

```javascript
const optimizer = new ClaudeTokenOptimizer({
  enableCaching: true,        // Cache repeated requests (default: true)
  enableStreaming: true,      // Stream responses (default: true)
  useBatching: true,         // Enable batch processing (default: true)
  maxTokens: 1024,           // Max output tokens per request
  analyticsFile: "./analytics.json" // Where to save usage stats
});
```

## 📈 Usage Analytics

Track your token consumption over time:

```javascript
// View comprehensive usage report
const report = optimizer.getReport();
console.log(report);

// Output:
// {
//   totalSessions: 42,
//   totalTokensUsed: 8942,
//   byModel: {
//     'claude-haiku-4-5-20251001': { count: 28, tokens: 2156 },
//     'claude-sonnet-4-5-20250929': { count: 12, tokens: 5430 },
//     'claude-opus-4-5-20251101': { count: 2, tokens: 1356 }
//   },
//   averageEfficiency: 2.34,
//   cacheSize: 15,
//   estimatedSavings: { fromCaching: "15 requests", ... }
// }
```

## 💡 Optimization Tips

### 1. Let Auto-Selection Work

Don't force models unless necessary. The optimizer is smart:

```javascript
// ❌ Bad - uses expensive Opus for simple task
await optimizer.optimizedCall("What's 2+2?", {
  forceModel: "claude-opus-4-5-20251101",
});

// ✅ Good - auto-selects Haiku
await optimizer.optimizedCall("What's 2+2?");
```

### 2. Use Streaming for Large Outputs

```javascript
// ✅ Streaming: efficient for long content
await optimizer.optimizedCall("Write a book chapter", {
  streaming: true,
});
```

### 3. Leverage Caching

```javascript
// ✅ Good - same question, zero tokens on second call
await optimizer.optimizedCall("Explain OAuth");
await optimizer.optimizedCall("Explain OAuth"); // Cached!
```

### 4. Batch Bulk Operations

```javascript
// ✅ Good - 50% savings with batching
const 100requests = [...];
await optimizer.batchProcess(100requests);

// ❌ Bad - sequential processing, no discount
for (const req of 100requests) {
  await optimizer.optimizedCall(req);
}
```

### 5. Be Specific in Prompts

```javascript
// ❌ Long, vague prompt = more tokens
await optimizer.optimizedCall(
  "Tell me about technology and stuff"
);

// ✅ Short, specific prompt = fewer tokens
await optimizer.optimizedCall(
  "List 5 recent AI breakthroughs"
);
```

## 🔌 Integration Examples

### Express.js API Endpoint

```javascript
const express = require("express");
const ClaudeTokenOptimizer = require("./claude-token-optimizer");

const app = express();
const optimizer = new ClaudeTokenOptimizer();

app.post("/api/ask", async (req, res) => {
  const { question, complexity } = req.body;

  const response = await optimizer.optimizedCall(question, { complexity });

  res.json({
    answer: response.content,
    tokensUsed: response.tokensUsed,
    model: response.model,
  });
});

app.listen(3000);
```

### Serverless Function (AWS Lambda)

```javascript
const ClaudeTokenOptimizer = require("./claude-token-optimizer");
const optimizer = new ClaudeTokenOptimizer();

exports.handler = async (event) => {
  const prompt = event.body.prompt;
  const response = await optimizer.optimizedCall(prompt);

  return {
    statusCode: 200,
    body: JSON.stringify({
      result: response.content,
      tokens: response.tokensUsed,
    }),
  };
};
```

### CLI Tool

```javascript
#!/usr/bin/env node
const ClaudeTokenOptimizer = require("./claude-token-optimizer");
const optimizer = new ClaudeTokenOptimizer();

const prompt = process.argv[2] || "Hello!";
optimizer.optimizedCall(prompt).then((result) => {
  console.log("\n" + result.content);
  console.log(`\n📊 Tokens: ${result.tokensUsed} | Model: ${result.model}`);
});
```

Use it:

```bash
./cli.js "What is machine learning?"
```

## 🧪 Testing

```javascript
const optimizer = new ClaudeTokenOptimizer();

// Test 1: Cache hits
console.log("Testing cache...");
await optimizer.optimizedCall("Test query");
const cached = await optimizer.optimizedCall("Test query");
console.log("Cache working:", cached.source === "cache");

// Test 2: Model selection
console.log("Testing model selection...");
const simple = await optimizer.optimizedCall("2+2?");
const complex = await optimizer.optimizedCall(
  "Solve this complex multi-step algorithm"
);
console.log("Models differ:", simple.model !== complex.model);

// Test 3: Streaming
console.log("Testing streaming...");
const streamed = await optimizer.optimizedCall(
  "Write a long essay",
  { streaming: true }
);
console.log("Streaming worked:", streamed.method === "streaming");

// Test 4: Analytics
console.log("Testing analytics...");
const report = optimizer.getReport();
console.log("Tracking sessions:", report.totalSessions > 0);
```

## 📚 API Reference

### `constructor(options)`

Create optimizer instance with configuration.

### `optimizedCall(prompt, options)`

Execute optimized API call.

- **Returns**: `{ content, model, tokensUsed, inputTokens, stopReason }`

### `batchProcess(requests)`

Process multiple requests with batch discount.

- **Returns**: Array of results

### `selectOptimalModel(prompt, options)`

Get model recommendation for a prompt.

### `getReport()`

Get usage analytics and statistics.

### `clearCache()`

Empty in-memory cache.

### `resetAnalytics()`

Clear usage data.

## 🔗 Resources

- **API Docs**: <https://docs.claude.com/en/docs/guides/tokens>
- **Batch Processing**: <https://docs.claude.com/en/docs/guides/batch-processing>
- **Prompt Caching**: <https://docs.claude.com/en/docs/guides/prompt-caching>
- **Token Counting**: <https://docs.claude.com/en/docs/guides/token-counting>

## ⚠️ Important Notes

1. **API Key Security**: Never commit `.env` files with API keys
2. **Rate Limits**: Haiku: 2M tokens/min, Sonnet: 1M tokens/min, Opus: 500K tokens/min
3. **Batch Processing**: Requires submitting batch jobs; results available within 24 hours
4. **Cache Persistence**: Cache is in-memory only (clears on restart)

## 🤝 Support

For issues or questions:

- Check the [Anthropic documentation](<https://docs.claude.com>)
- Review Claude API status at <https://status.anthropic.com>

---

### Happy token saving! 🎉
