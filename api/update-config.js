import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { appsScriptURL } = req.body;
  const ADMIN_SECRET = process.env.ADMIN_SECRET;

  // check secret in headers (sent from admin page)
  if (req.headers['x-admin-secret'] !== ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!appsScriptURL) return res.status(400).json({ error: 'Missing Apps Script URL' });

  const configPath = path.resolve('./config.json');

  try {
    const config = { appsScriptURL };
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
    res.status(200).json({ status: 'success', message: 'Apps Script URL saved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save config' });
  }
}
