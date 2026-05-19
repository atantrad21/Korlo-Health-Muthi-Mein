const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Your Resilience Equation: R = θ · D · (αA + βN + γM) · S · O / E
app.post('/calculate-resilience', (req, res) => {
    const { theta, D, alpha, A, beta, N, gamma, M, S, O, E } = req.body;

    // Basic validation to prevent division by zero
    if (E === 0) return res.status(400).json({ error: "Effort (E) cannot be zero." });

    const resilienceScore = (theta * D * (alpha * A + beta * N + gamma * M) * S * O) / E;

    res.json({
        score: resilienceScore.toFixed(2),
        phase: getPhase(resilienceScore),
        timestamp: new Date()
    });
});

function getPhase(score) {
    if (score < 30) return "Foundation Phase";
    if (score < 70) return "Growth Phase";
    return "Mastery Phase";
}

app.get('/', (req, res) => res.send('Patient Resilience Tracker API is Running!'));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
