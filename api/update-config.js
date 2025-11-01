import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { appsScriptURL, secret } = req.body;

  // Optional: simple admin auth
  if (secret !== process.env.ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' });

  if (!appsScriptURL) return res.status(400).json({ error: 'Missing URL' });

  const configPath = path.join(process.cwd(), 'public', 'config.json');
  fs.writeFileSync(configPath, JSON.stringify({ appsScriptURL }, null, 2));

  res.status(200).json({ status: 'ok', appsScriptURL });
}