const FIREBASE_DB_URL = process.env.FIREBASE_DB_URL;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { execUrl } = req.body;
  if (!execUrl) return res.status(400).json({ error: 'Missing execUrl' });

  try {
    const fbRes = await fetch(`${FIREBASE_DB_URL}/config/votingExec.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(execUrl)
    });

    if (!fbRes.ok) throw new Error('Failed to save exec URL');

    res.status(200).json({ status: 'success' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save config' });
  }
}
