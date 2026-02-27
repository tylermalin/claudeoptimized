/**
 * Claude Token Optimizer - Real-World Examples
 * Demonstrates practical usage patterns for token optimization
 */

const ClaudeTokenOptimizer = require("./claude-token-optimizer");

// Initialize optimizer with all features enabled
const optimizer = new ClaudeTokenOptimizer({
  enableCaching: true,
  enableStreaming: true,
  useBatching: true,
  maxTokens: 2048,
});

// ============================================================================
// EXAMPLE 1: Classification Task (Simple - Uses Haiku)
// ============================================================================
async function example_classification() {
  console.log("\n📌 EXAMPLE 1: Email Classification (Haiku Model)");
  console.log("─".repeat(60));

  const emails = [
    {
      subject: "Meeting at 3pm",
      body: "Our meeting is scheduled for 3pm today",
    },
    { subject: "Special offer - 50% off", body: "Limited time discount" },
    { subject: "Your package arrived", body: "Delivery confirmed" },
  ];

  for (const email of emails) {
    const response = await optimizer.optimizedCall(
      `Classify this email as: work, marketing, or delivery\nSubject: ${email.subject}\nBody: ${email.body}`,
      {
        systemPrompt:
          "You are an email classifier. Respond with only the category.",
        complexity: "simple", // Forces Haiku
      }
    );

    console.log(`Email: "${email.subject}"`);
    console.log(`  Category: ${response.content.trim()}`);
    console.log(`  Tokens: ${response.tokensUsed} | Model: ${response.model}`);
  }
}

// ============================================================================
// EXAMPLE 2: Content Generation (Medium - Uses Sonnet)
// ============================================================================
async function example_content_generation() {
  console.log("\n📝 EXAMPLE 2: Blog Post Generation (Sonnet Model)");
  console.log("─".repeat(60));

  const response = await optimizer.optimizedCall(
    "Write a 200-word blog post about the benefits of token optimization for AI applications",
    {
      systemPrompt:
        "You are a technical writer. Create engaging, informative content.",
      complexity: "medium",
      streaming: true, // Stream for better UX
    }
  );

  console.log("Generated Post:");
  console.log(response.content);
  console.log(`\nTokens used: ${response.tokensUsed} | Model: ${response.model}`);
}

// ============================================================================
// EXAMPLE 3: Complex Analysis (High - Uses Opus)
// ============================================================================
async function example_complex_analysis() {
  console.log("\n🔬 EXAMPLE 3: Technical Analysis (Opus Model)");
  console.log("─".repeat(60));

  const response = await optimizer.optimizedCall(
    `Analyze this trading scenario and provide a detailed strategy:
    - Entry point: $100
    - Stop loss: $95
    - Target: $120
    - Current market conditions: High volatility, uptrend
    - Time horizon: 2 weeks
    
    Consider risk management, position sizing, and exit strategy.`,
    {
      systemPrompt: "You are an expert trading analyst with 20 years experience.",
      complexity: "high", // Forces Opus
    }
  );

  console.log("Analysis Result:");
  console.log(response.content);
  console.log(`\nTokens used: ${response.tokensUsed} | Model: ${response.model}`);
}

// ============================================================================
// EXAMPLE 4: Caching Benefit (Zero Tokens)
// ============================================================================
async function example_caching() {
  console.log("\n💾 EXAMPLE 4: Caching Identical Queries");
  console.log("─".repeat(60));

  const question =
    "What are the top 5 benefits of using caching in APIs?";

  // First call - consumes tokens
  console.log("First call...");
  const response1 = await optimizer.optimizedCall(question);
  console.log(`Tokens used: ${response1.tokensUsed}`);
  console.log(`Source: ${response1.source || "API"}`);

  // Second call - zero tokens from cache
  console.log("\nSecond call (identical question)...");
  const response2 = await optimizer.optimizedCall(question);
  console.log(`Tokens used: ${response2.tokensUsed}`);
  console.log(`Source: ${response2.source}`);

  console.log(
    `\n✓ Saved ${response1.tokensUsed} tokens by using cache!`
  );
}

// ============================================================================
// EXAMPLE 5: Batch Processing (50% Discount)
// ============================================================================
async function example_batch_processing() {
  console.log("\n📦 EXAMPLE 5: Batch Processing (50% Token Discount)");
  console.log("─".repeat(60));

  // Prepare 10 translation requests
  const requests = [
    { prompt: "Translate to Spanish: Hello, how are you?" },
    { prompt: "Translate to French: What is your name?" },
    { prompt: "Translate to German: Thank you very much" },
    { prompt: "Translate to Italian: Good morning" },
    { prompt: "Translate to Portuguese: See you later" },
  ];

  console.log(`Processing ${requests.length} requests via batch API...`);
  console.log("(50% token cost compared to sequential processing)\n");

  const results = await optimizer.batchProcess(requests);

  results.forEach((result, i) => {
    console.log(`Request ${i + 1}: ${requests[i].prompt}`);
    console.log(`  Response: ${result.content.trim()}`);
    console.log(`  Tokens: ${result.tokensUsed}`);
  });

  const totalTokens = results.reduce((sum, r) => sum + r.tokensUsed, 0);
  const savedTokens = Math.round(totalTokens * 0.5);

  console.log(
    `\n✓ Total tokens: ${totalTokens} | Estimated savings: ${savedTokens} tokens (50%)`
  );
}

// ============================================================================
// EXAMPLE 6: Automatic Complexity Detection
// ============================================================================
async function example_complexity_detection() {
  console.log("\n🎯 EXAMPLE 6: Automatic Complexity Detection");
  console.log("─".repeat(60));

  const prompts = [
    { text: "What is AI?", expectedModel: "haiku" },
    {
      text: "Explain neural networks and backpropagation algorithms",
      expectedModel: "sonnet",
    },
    {
      text: `Design a distributed ledger system that handles 10,000 transactions per second 
             with Byzantine fault tolerance, consensus mechanism details, and cryptographic 
             security considerations for financial applications`,
      expectedModel: "opus",
    },
  ];

  for (const prompt of prompts) {
    const response = await optimizer.optimizedCall(prompt.text);
    const modelType = response.model.includes("haiku")
      ? "haiku"
      : response.model.includes("sonnet")
        ? "sonnet"
        : "opus";

    console.log(`Prompt: "${prompt.text.substring(0, 50)}..."`);
    console.log(`  Selected: ${modelType} (expected: ${prompt.expectedModel})`);
    console.log(`  Tokens: ${response.tokensUsed}`);
  }
}

// ============================================================================
// EXAMPLE 7: Cost Tracking
// ============================================================================
async function example_cost_tracking() {
  console.log("\n💰 EXAMPLE 7: Token Cost Analysis");
  console.log("─".repeat(60));

  // Simulate a few queries
  const queries = [
    "What is Python?",
    "Explain machine learning",
    "Design a scalable microservices architecture",
  ];

  for (const query of queries) {
    await optimizer.optimizedCall(query);
  }

  // Get detailed report
  const report = optimizer.getReport();

  console.log("Usage Report:");
  console.log(JSON.stringify(report, null, 2));

  console.log("\nKey Metrics:");
  console.log(`  Total Sessions: ${report.totalSessions}`);
  console.log(`  Total Tokens Used: ${report.totalTokensUsed}`);
  console.log(`  Average Efficiency: ${report.averageEfficiency} words/token`);
  console.log(`  Cache Size: ${report.cacheSize}`);

  console.log("\nTokens by Model:");
  for (const [model, stats] of Object.entries(report.byModel || {})) {
    const shortName = model.includes("haiku")
      ? "Haiku"
      : model.includes("sonnet")
        ? "Sonnet"
        : "Opus";
    console.log(`  ${shortName}: ${stats.tokens} tokens (${stats.count} calls)`);
  }
}

// ============================================================================
// EXAMPLE 8: Streaming Large Outputs
// ============================================================================
async function example_streaming() {
  console.log("\n🔄 EXAMPLE 8: Streaming for Large Responses");
  console.log("─".repeat(60));

  console.log("Generating long content with streaming...\n");

  const response = await optimizer.optimizedCall(
    "Write a detailed guide on machine learning (3-4 paragraphs)",
    {
      streaming: true,
      complexity: "medium",
    }
  );

  console.log(`\n\nTokens used: ${response.tokensUsed}`);
  console.log(
    "Streaming is more efficient for long outputs because tokens are processed as they arrive!"
  );
}

// ============================================================================
// EXAMPLE 9: Rate Limiting Awareness
// ============================================================================
async function example_rate_limiting() {
  console.log("\n⚡ EXAMPLE 9: Rate Limit Awareness");
  console.log("─".repeat(60));

  console.log("Claude Rate Limits (tokens per minute):");
  console.log("  Haiku:   2,000,000 tokens/min");
  console.log("  Sonnet:  1,000,000 tokens/min");
  console.log("  Opus:      500,000 tokens/min");

  console.log("\nOptimizer handles this by:");
  console.log("  1. Preferring Haiku for simple tasks");
  console.log("  2. Using batch processing for bulk requests");
  console.log("  3. Streaming long responses to distribute load");

  console.log(
    "\nFor your 100 simple queries:\n  ✓ Sequential Haiku: 2M tokens/min (safe)"
  );
  console.log(
    "  ✓ Batched Haiku: Same capacity + 50% discount"
  );
}

// ============================================================================
// EXAMPLE 10: Production Configuration
// ============================================================================
async function example_production_config() {
  console.log("\n🏭 EXAMPLE 10: Production Configuration");
  console.log("─".repeat(60));

  const productionOptimizer = new ClaudeTokenOptimizer({
    enableCaching: true, // Always cache for production
    enableStreaming: true, // Stream large outputs
    useBatching: true, // Use batch API for off-peak processing
    maxTokens: 4096, // Balance between quality and cost
    analyticsFile: "./analytics/production-metrics.json",
  });

  console.log("Recommended production settings:");
  console.log("✓ enableCaching: true");
  console.log("  → Reduces repeated requests to zero tokens");
  console.log("✓ enableStreaming: true");
  console.log("  → More efficient for long-form content");
  console.log("✓ useBatching: true");
  console.log("  → 50% discount for non-urgent processing");
  console.log("✓ maxTokens: 4096");
  console.log(
    "  → Balance between response quality and token cost"
  );

  console.log("\nMonitoring:");
  console.log("  → Check getReport() regularly");
  console.log("  → Track token usage by model and endpoint");
  console.log("  → Alert on unusual spikes");
  console.log("  → Optimize prompts based on actual usage");
}

// ============================================================================
// Main Runner
// ============================================================================
async function main() {
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║  Claude Token Optimizer - Real-World Usage Examples         ║");
  console.log("╚════════════════════════════════════════════════════════════╝");

  try {
    // Uncomment examples to run:

    // await example_classification();
    // await example_content_generation();
    // await example_complex_analysis();
    // await example_caching();
    // await example_batch_processing();
    // await example_complexity_detection();
    // await example_cost_tracking();
    // await example_streaming();
    // await example_rate_limiting();
    // await example_production_config();

    // Run all examples
    console.log(
      "\n💡 Tip: Uncomment examples in the main() function to run them\n"
    );

    // Quick demo
    const response = await optimizer.optimizedCall(
      "What are the benefits of token optimization?"
    );

    console.log("Quick Demo:");
    console.log(`Response: ${response.content.substring(0, 100)}...`);
    console.log(`Model: ${response.model} | Tokens: ${response.tokensUsed}`);

    console.log("\n📊 Usage Report:");
    console.log(JSON.stringify(optimizer.getReport(), null, 2));
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Run if executed directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  example_classification,
  example_content_generation,
  example_complex_analysis,
  example_caching,
  example_batch_processing,
  example_complexity_detection,
  example_cost_tracking,
  example_streaming,
  example_rate_limiting,
  example_production_config,
};
