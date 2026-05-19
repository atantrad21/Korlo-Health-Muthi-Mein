const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Connect to Railway's MongoDB
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Define a Schema for the Resilience Data
const RecordSchema = new mongoose.Schema({
    score: Number,
    phase: String,
    date: { type: Date, default: Date.now }
});
const Record = mongoose.model('Record', RecordSchema);

// Updated Route to SAVE data
app.post('/calculate-resilience', async (req, res) => {
    const { theta, D, alpha, A, beta, N, gamma, M, S, O, E } = req.body;
    
    const resilienceScore = (theta * D * (alpha * A + beta * N + gamma * M) * S * O) / E;
    const phase = resilienceScore < 30 ? "Foundation" : (resilienceScore < 70 ? "Growth" : "Mastery");

    const newRecord = new Record({ score: resilienceScore, phase: phase });
    await newRecord.save(); // This saves it to your Railway DB

    res.json({ message: "Record Saved!", score: resilienceScore, phase: phase });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
