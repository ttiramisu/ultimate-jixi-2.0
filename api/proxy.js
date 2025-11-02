import fetch from 'node-fetch';

const FIREBASE_DB_URL = process.env.FIREBASE_DB_URL;

export default async function handler(req, res) {
  try {
    // 1️⃣ Get the current voting exec link from Firebase
    const fbRes = await fetch(`${FIREBASE_DB_URL}/config/votingExec.json`);
    if (!fbRes.ok) throw new Error('Failed to read voting exec');
    const VOTING_EXEC = await fbRes.json();

    if (!VOTING_EXEC) return res.status(400).json({ error: 'Voting exec not set in Firebase' });

    // 2️⃣ Proxy request to Apps Script
    const response = await fetch(VOTING_EXEC, {
      method: req.method,
      headers: { 'Content-Type': 'application/json' },
      body: req.method === 'POST' ? JSON.stringify(req.body) : null,
    });

    const text = await response.text();
    res.status(response.status).send(text);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Proxy error' });
  }
}
