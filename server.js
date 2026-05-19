const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('.')); // Serves index.html automatically

// Connect to Railway MongoDB
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB Connection Error:', err));

const RecordSchema = new mongoose.Schema({
    score: Number,
    phase: String,
    inputs: Object,
    date: { type: Date, default: Date.now }
});
const Record = mongoose.model('Record', RecordSchema);

// Calculation Route
app.post('/calculate-resilience', async (req, res) => {
    try {
        const { theta=1, D=1, A=5, N=5, M=5, S=1, O=1, E=1 } = req.body;

        // Scientific Weights
        const alpha = 0.4; // Biological
        const beta = 0.3;  // Social
        const gamma = 0.3; // Strategic

        if (E === 0) return res.status(400).json({ error: "Effort cannot be zero" });

        // R = θ · D · (αA + βN + γM) · S · O / E
        const R = (theta * D * (alpha * A + beta * N + gamma * M) * S * O) / E;
        const phase = R < 30 ? "Foundation" : (R < 70 ? "Growth" : "Mastery");

        const newRecord = new Record({ 
            score: R.toFixed(2), 
            phase: phase,
            inputs: { A, N, M, E }
        });
        await newRecord.save();

        res.json({ resilience_score: R.toFixed(2), phase: phase });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => console.log(`Server live on port ${PORT}`));
