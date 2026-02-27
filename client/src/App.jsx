import React, { useState, useEffect, useRef } from 'react';

function App() {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'SYSTEM READY. OPTIMIZATION ARMED. HOW CAN I ASSIST?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [analytics, setAnalytics] = useState(null);
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
        fetchAnalytics();
    }, [messages]);

    const fetchAnalytics = async () => {
        try {
            const res = await fetch('http://localhost:3001/api/analytics');
            const data = await res.json();
            setAnalytics(data);
        } catch (err) {
            console.error('Failed to fetch analytics:', err);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('http://localhost:3001/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMsg],
                    streaming: false // We'll add streaming support in v2
                })
            });

            const data = await res.json();
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: data.content,
                model: data.model,
                tokens: data.tokensUsed,
                source: data.source
            }]);
        } catch (err) {
            console.error('Chat error:', err);
            setMessages(prev => [...prev, { role: 'assistant', content: 'ERROR: CONNECTION_FAILED' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-container">
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <header className="terminal-header">
                        <div className="header-title">
                            <span style={{ color: '#555' }}>[</span>
                            CLAUDE.OPTIMIZED
                            <span style={{ color: '#555' }}>]</span>
                            <span className="pill" style={{ color: '#00ff00' }}>ONLINE</span>
                        </div>
                        <div className="status-pills">
                            <span className="pill">API_KEY: ACTIVE</span>
                            <span className="pill">OPTIMIZER: ON</span>
                        </div>
                    </header>

                    <div className="chat-area">
                        {messages.map((msg, i) => (
                            <div key={i} className={`message ${msg.role === 'user' ? 'user-message' : 'ai-message'}`}>
                                <div className="content">{msg.content}</div>
                                {msg.role === 'assistant' && msg.model && (
                                    <div className="ai-meta">
                                        <span>MODEL: <span className={msg.model.includes('haiku') ? 'haiku' : msg.model.includes('sonnet') ? 'sonnet' : 'opus'}>{msg.model}</span></span>
                                        <span>TOKENS: {msg.tokens === 0 ? 'CACHED ✓' : msg.tokens}</span>
                                        {msg.source === 'cache' && <span style={{ color: '#00ff9d' }}>[CACHE HIT]</span>}
                                    </div>
                                )}
                            </div>
                        ))}
                        {loading && <div className="message ai-message">THINKING...</div>}
                        <div ref={chatEndRef} />
                    </div>

                    <form className="input-container" onSubmit={handleSend}>
                        <span style={{ color: 'var(--accent-color)', fontFamily: 'Fira Code' }}>&gt;</span>
                        <input
                            className="cli-input"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="ENTER COMMAND..."
                            autoFocus
                        />
                        <button type="submit" className="send-btn">EXECUTE</button>
                    </form>
                </div>

                <aside className="stats-sidebar">
                    <div className="stats-section">
                        <h3>Usage Analytics</h3>
                        <div className="stat-item">
                            <span>Sessions:</span>
                            <span className="stat-value">{analytics?.totalSessions || 0}</span>
                        </div>
                        <div className="stat-item">
                            <span>Total Tokens:</span>
                            <span className="stat-value">{analytics?.totalTokensUsed || 0}</span>
                        </div>
                        <div className="stat-item">
                            <span>Cache Hits:</span>
                            <span className="stat-value">{analytics?.cacheSize || 0}</span>
                        </div>
                    </div>

                    <div className="stats-section">
                        <h3>Model Distribution</h3>
                        {analytics?.byModel && Object.entries(analytics.byModel).map(([model, stats]) => (
                            <div key={model} className="stat-item" style={{ fontSize: '0.75rem' }}>
                                <span className={model.includes('haiku') ? 'haiku' : model.includes('sonnet') ? 'sonnet' : 'opus'}>
                                    {model.split('-')[1].toUpperCase()}
                                </span>
                                <span>{stats.count} calls</span>
                            </div>
                        ))}
                    </div>

                    <div className="stats-section" style={{ marginTop: 'auto' }}>
                        <button
                            onClick={() => fetch('http://localhost:3001/api/analytics/reset', { method: 'POST' }).then(fetchAnalytics)}
                            className="send-btn"
                            style={{ width: '100%', fontSize: '0.7rem', marginBottom: '10px' }}
                        >
                            RESET ANALYTICS
                        </button>
                        <button
                            onClick={() => fetch('http://localhost:3001/api/cache/clear', { method: 'POST' }).then(fetchAnalytics)}
                            className="send-btn"
                            style={{ width: '100%', fontSize: '0.7rem', borderColor: '#f97316', color: '#f97316' }}
                        >
                            CLEAR CACHE
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default App;
