# Claude Token Optimizer - Quick Reference

## 🚀 Installation (30 seconds)

```bash
npm install @anthropic-ai/sdk
export ANTHROPIC_API_KEY="sk-ant-..."
cp claude-token-optimizer.js .
```

## 💻 Basic Usage

```javascript
const ClaudeTokenOptimizer = require("./claude-token-optimizer");
const opt = new ClaudeTokenOptimizer();

// Simple call - auto-selects best model
const res = await opt.optimizedCall("Your question here");
console.log(res.content);           // The answer
console.log(res.tokensUsed);        // How many tokens used
console.log(res.model);             // Which model was used
```

## 🎯 Model Selection

| Task | Model | Cost | Speed |
|------|-------|------|-------|
| Classification, simple Q&A | Haiku | 1x | Fast ✓ |
| Content, analysis, writing | Sonnet | 2x | Medium |
| Complex reasoning, hard problems | Opus | 6x | Slow |

**Auto-selection based on:**
- Prompt length
- Complexity keywords
- Your `complexity` parameter

## 📌 Configuration

```javascript
new ClaudeTokenOptimizer({
  enableCaching: true,        // Cache identical requests
  enableStreaming: true,      // Stream long responses
  useBatching: true,          // Batch API support
  maxTokens: 1024,           // Max output per call
  analyticsFile: "./analytics.json"
})
```

## 💡 Common Patterns

### Pattern 1: Simple Query
```javascript
const res = await opt.optimizedCall("What is AI?");
// → Uses Haiku, ~50 tokens
```

### Pattern 2: Complex Analysis
```javascript
const res = await opt.optimizedCall(
  "Design a complex system...",
  { complexity: "high" }  // Forces Opus
);
// → Uses Opus, ~500 tokens
```

### Pattern 3: Streaming Large Output
```javascript
const res = await opt.optimizedCall(
  "Write a long article...",
  { streaming: true }
);
// → More efficient, real-time output
```

### Pattern 4: Cached Response (Zero Tokens!)
```javascript
await opt.optimizedCall("What is Python?");     // 120 tokens
await opt.optimizedCall("What is Python?");     // 0 tokens (cached!)
```

### Pattern 5: Batch Processing (50% Off)
```javascript
const res = await opt.batchProcess([
  { prompt: "Translate to Spanish: Hello" },
  { prompt: "Translate to French: Hello" },
  { prompt: "Translate to German: Hello" }
]);
// → 50% token discount vs sequential
```

### Pattern 6: Force Specific Model
```javascript
const res = await opt.optimizedCall(query, {
  forceModel: "claude-haiku-4-5-20251001"
});
```

## 📊 Analytics

```javascript
// Get usage report
const report = opt.getReport();

// Shows:
// - totalSessions: number of calls
// - totalTokensUsed: sum of all tokens
// - byModel: breakdown per model
// - averageEfficiency: words per token
// - cacheSize: cached responses
// - estimatedSavings: potential savings
```

## ⚡ Token Costs (Approximate)

```
Simple question          ~50-100 tokens    (Haiku)
Blog paragraph          ~200-400 tokens   (Sonnet)
Complex analysis        ~500-1000 tokens  (Opus)
Book chapter            ~2000+ tokens     (Opus + streaming)

Haiku model:   $0.80 per 1M input  / $4.00 per 1M output
Sonnet model:  $3.00 per 1M input  / $15.00 per 1M output
Opus model:    $15.00 per 1M input / $75.00 per 1M output
```

## 🎯 Best Practices

### ✓ DO
- Let auto-selection pick the model
- Use streaming for long outputs
- Cache repeated queries
- Batch bulk requests
- Monitor with `getReport()`

### ✗ DON'T
- Force expensive models for simple tasks
- Repeat identical queries without caching
- Process 100+ requests sequentially
- Ignore the analytics data

## 🔧 Advanced Options

```javascript
// All available options:
await opt.optimizedCall(prompt, {
  systemPrompt: "Custom system message",
  complexity: "simple|medium|high",    // Guide model selection
  forceModel: "claude-haiku-4-5-20251001", // Override selection
  streaming: true|false,                // Stream response
  useCaching: true|false,               // Use cache
})
```

## 📈 Optimization Example

**Before (No Optimization):**
```javascript
for (let i = 0; i < 100; i++) {
  await client.messages.create({ model: "claude-opus" });
}
// Cost: ~50,000 tokens per question × 100
```

**After (With Optimizer):**
```javascript
const requests = [...].map(q => ({ prompt: q }));
await optimizer.batchProcess(requests);
// Cost: Same questions, 50% discount via batching
```

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| "API key not found" | `export ANTHROPIC_API_KEY="your-key"` |
| "Rate limit exceeded" | Use batching or slower request rate |
| "Cache not working" | Check `enableCaching: true` in config |
| "Analytics file error" | Ensure write permissions in directory |

## 🔗 Key Endpoints

```javascript
// Haiku (fast, cheap)
"claude-haiku-4-5-20251001"

// Sonnet (balanced)
"claude-sonnet-4-5-20250929"

// Opus (powerful)
"claude-opus-4-5-20251101"
```

## 📚 Resources

- API Docs: https://docs.claude.com
- Tokens Guide: https://docs.claude.com/en/docs/guides/tokens
- Batch API: https://docs.claude.com/en/docs/guides/batch-processing
- Status: https://status.anthropic.com

## 💬 Common Questions

**Q: How much do I save with batching?**
A: 50% token discount. 1000 tokens → 500 tokens cost.

**Q: Can I batch different model requests?**
A: Yes! Batch API uses tokens at that model's rates.

**Q: Does caching work across sessions?**
A: No, only within same session. Restart = cleared cache.

**Q: What's the difference between streaming and regular?**
A: Both use same tokens. Streaming gives real-time output.

**Q: How do I know if Haiku can handle my task?**
A: If it's <100 words, classification, or simple logic → Haiku works.

**Q: Can I see real-time token usage?**
A: Call `getReport()` after each batch of requests.

---

**Ready to optimize? Copy the code and get started! 🚀**
