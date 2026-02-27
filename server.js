const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const ClaudeTokenOptimizer = require("./claude-token-optimizer");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;

// Initialize optimizer
const optimizer = new ClaudeTokenOptimizer({
    enableCaching: true,
    enableStreaming: true,
    maxTokens: 4096,
});

app.use(cors());
app.use(bodyParser.json());

// Chat endpoint
app.post("/api/chat", async (req, res) => {
    const { messages, complexity, streaming } = req.body;

    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required" });
    }

    const userPrompt = messages[messages.length - 1].content;
    const systemPrompt = messages.find(m => m.role === "system")?.content || "You are a helpful AI assistant.";

    try {
        if (streaming) {
            // For simplicity in the first version, we'll use the optimizer's streamingCall 
            // but adapt it for Express response streaming if possible, 
            // or just return the full response for now to ensure stability.
            // Real SSE streaming would require refactoring streamingCall to accept a res object.
            const result = await optimizer.optimizedCall(userPrompt, {
                systemPrompt,
                complexity,
                streaming: false, // Turn off for now to avoid stdout piping in server
            });
            return res.json(result);
        } else {
            const result = await optimizer.optimizedCall(userPrompt, {
                systemPrompt,
                complexity,
                streaming: false,
            });
            res.json(result);
        }
    } catch (error) {
        console.error("Chat Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Analytics endpoint
app.get("/api/analytics", (req, res) => {
    res.json(optimizer.getReport());
});

// Reset analytics
app.post("/api/analytics/reset", (req, res) => {
    optimizer.resetAnalytics();
    res.json({ message: "Analytics reset" });
});

// Clear cache
app.post("/api/cache/clear", (req, res) => {
    optimizer.clearCache();
    res.json({ message: "Cache cleared" });
});

app.listen(port, () => {
    console.log(`🚀 Optimizer Server running at http://localhost:${port}`);
});
