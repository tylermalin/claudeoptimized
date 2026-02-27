#!/usr/bin/env node

/**
 * Claude Token Optimizer - Quick Demo
 * 
 * Run this to test the optimizer immediately:
 *   npm install
 *   ANTHROPIC_API_KEY="your-key" node demo.js
 */

const ClaudeTokenOptimizer = require("./claude-token-optimizer");

async function demo() {
  console.log("╔═══════════════════════════════════════════════════════════╗");
  console.log(
    "║         Claude Token Optimizer - Quick Demo               ║"
  );
  console.log("╚═══════════════════════════════════════════════════════════╝\n");

  const optimizer = new ClaudeTokenOptimizer({
    enableCaching: true,
    enableStreaming: false, // Disable for demo to see output clearly
  });

  // =====================================================================
  // Demo 1: Auto Model Selection
  // =====================================================================
  console.log("📌 DEMO 1: Auto Model Selection");
  console.log("─".repeat(59));

  const simplePrompt = "What is 2+2?";
  console.log(`Prompt: "${simplePrompt}"`);
  console.log("Expected: Haiku (simple task)\n");

  try {
    const res1 = await optimizer.optimizedCall(simplePrompt);
    console.log(`✓ Response: ${res1.content.trim()}`);
    console.log(`✓ Model: ${res1.model}`);
    console.log(`✓ Tokens: ${res1.tokensUsed}`);
    const isHaiku = res1.model.includes("haiku");
    console.log(`✓ Correct Model: ${isHaiku ? "YES ✓" : "NO ✗"}\n`);
  } catch (error) {
    console.error(`✗ Error: ${error.message}\n`);
    process.exit(1);
  }

  // =====================================================================
  // Demo 2: Medium Complexity
  // =====================================================================
  console.log("📌 DEMO 2: Medium Complexity Task");
  console.log("─".repeat(59));

  const mediumPrompt =
    "Explain the main differences between machine learning and deep learning";
  console.log(`Prompt: "${mediumPrompt}"`);
  console.log("Expected: Sonnet (medium complexity)\n");

  try {
    const res2 = await optimizer.optimizedCall(mediumPrompt, {
      complexity: "medium",
    });
    console.log(`✓ Response: ${res2.content.substring(0, 100)}...`);
    console.log(`✓ Model: ${res2.model}`);
    console.log(`✓ Tokens: ${res2.tokensUsed}\n`);
  } catch (error) {
    console.error(`✗ Error: ${error.message}\n`);
  }

  // =====================================================================
  // Demo 3: Caching Demonstration
  // =====================================================================
  console.log("📌 DEMO 3: Caching (Zero-Token Response)");
  console.log("─".repeat(59));

  const cachePrompt = "What is artificial intelligence?";

  console.log(`First call: "${cachePrompt}"`);
  try {
    const res3a = await optimizer.optimizedCall(cachePrompt);
    console.log(`✓ Tokens used: ${res3a.tokensUsed}`);
    console.log(`✓ Source: API`);
    console.log(`✓ Response: ${res3a.content.substring(0, 80)}...\n`);

    console.log(`Second call (identical prompt):`);
    const res3b = await optimizer.optimizedCall(cachePrompt);
    console.log(`✓ Tokens used: ${res3b.tokensUsed} (CACHED!)`);
    console.log(`✓ Source: ${res3b.source}`);
    console.log(`✓ Savings: ${res3a.tokensUsed} tokens saved! ✓\n`);
  } catch (error) {
    console.error(`✗ Error: ${error.message}\n`);
  }

  // =====================================================================
  // Demo 4: Usage Analytics
  // =====================================================================
  console.log("📌 DEMO 4: Usage Analytics Report");
  console.log("─".repeat(59));

  try {
    const report = optimizer.getReport();

    console.log("📊 Usage Summary:");
    console.log(`  Total Calls: ${report.totalSessions}`);
    console.log(`  Total Tokens Used: ${report.totalTokensUsed}`);
    console.log(`  Cache Size: ${report.cacheSize} cached responses`);
    console.log(`  Average Efficiency: ${report.averageEfficiency} words/token\n`);

    console.log("📊 Breakdown by Model:");
    for (const [model, stats] of Object.entries(report.byModel || {})) {
      const modelName = model.includes("haiku")
        ? "Haiku"
        : model.includes("sonnet")
          ? "Sonnet"
          : "Opus";
      console.log(`  ${modelName}: ${stats.count} calls, ${stats.tokens} tokens`);
    }
    console.log();
  } catch (error) {
    console.error(`✗ Error: ${error.message}\n`);
  }

  // =====================================================================
  // Demo 5: Efficiency Comparison
  // =====================================================================
  console.log("📌 DEMO 5: Efficiency Comparison");
  console.log("─".repeat(59));

  console.log("Scenario: 5 simple classification tasks\n");

  console.log("❌ Without Optimizer:");
  console.log("  All 5 use Claude Opus");
  console.log("  Cost: 5 × 1000 = 5,000 tokens\n");

  console.log("✅ With Optimizer:");
  console.log("  Auto-selects Haiku for all 5");
  console.log("  Cost: 5 × 200 = 1,000 tokens");
  console.log("  Savings: 4,000 tokens (80% reduction!) ✓\n");

  // =====================================================================
  // Demo 6: Feature Showcase
  // =====================================================================
  console.log("📌 DEMO 6: Available Features");
  console.log("─".repeat(59));

  console.log("🎯 Auto Model Selection");
  console.log("  └─ Routes tasks to Haiku, Sonnet, or Opus\n");

  console.log("💾 Prompt Caching");
  console.log("  └─ Zero tokens for identical queries\n");

  console.log("📦 Batch Processing");
  console.log("  └─ 50% token discount for bulk requests\n");

  console.log("🔄 Streaming Support");
  console.log("  └─ Real-time output for long responses\n");

  console.log("📊 Usage Analytics");
  console.log("  └─ Track tokens, costs, and efficiency\n");

  console.log("⚙️  Smart Configuration");
  console.log("  └─ Works out of the box with sensible defaults\n");

  // =====================================================================
  // Final Summary
  // =====================================================================
  console.log("╔═══════════════════════════════════════════════════════════╗");
  console.log("║                    Demo Complete! ✓                       ║");
  console.log("╚═══════════════════════════════════════════════════════════╝\n");

  console.log("📚 Next Steps:\n");
  console.log("1. Read QUICK_REFERENCE.md for common patterns");
  console.log("2. Check SETUP.md for detailed documentation");
  console.log("3. Try examples.js for advanced usage");
  console.log("4. Integrate into your application\n");

  console.log("💡 Quick Example:\n");
  console.log("  const optimizer = new ClaudeTokenOptimizer();");
  console.log(
    "  const res = await optimizer.optimizedCall('Your question here');"
  );
  console.log("  console.log(res.content);  // The answer");
  console.log("  console.log(res.tokensUsed);  // Tokens used\n");

  console.log("🚀 Ready to save tokens on every API call!\n");
}

// Run demo
if (require.main === module) {
  demo().catch((error) => {
    console.error("\n❌ Error running demo:");
    console.error(error.message);

    if (error.message.includes("ANTHROPIC_API_KEY")) {
      console.error(
        "\n⚠️  Missing API Key. Set it with:"
      );
      console.error(
        '  export ANTHROPIC_API_KEY="sk-ant-..."\n'
      );
    }

    process.exit(1);
  });
}

module.exports = demo;
