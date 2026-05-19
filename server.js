// Research-Weighted Resilience Equation
app.post('/calculate-resilience', async (req, res) => {
    try {
        const { 
            theta = 1,  // Environmental factor
            D = 1,      // Duration/Persistence
            A = 5,      // Biological score (Alpha weight: 0.4)
            N = 5,      // Social score (Beta weight: 0.3)
            M = 5,      // Strategic score (Gamma weight: 0.3)
            S = 1,      // Support factor
            O = 1,      // Optimism factor
            E = 1       // Effort/Energy expenditure
        } = req.body;

        // Weights based on recent Trajectory Research
        const alpha = 0.4; // High weight for Bio-recovery
        const beta = 0.3;  // Social support
        const gamma = 0.3; // Strategic/Mental flexibility

        if (E === 0) return res.status(400).json({ error: "Effort cannot be zero" });

        // The Formula: R = θ · D · (αA + βN + γM) · S · O / E
        const R = (theta * D * (alpha * A + beta * N + gamma * M) * S * O) / E;

        const phase = R < 30 ? "Foundation" : (R < 70 ? "Growth" : "Mastery");

        const newRecord = new Record({ 
            score: R.toFixed(2), 
            phase: phase,
            metadata: { research_version: "2026.1" } 
        });
        
        await newRecord.save();

        res.json({ 
            success: true, 
            resilience_score: R.toFixed(2), 
            phase: phase 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
