export default async function handler(req, res) {
  const APPS_SCRIPT_URL = req.method === 'POST' ? req.body.appsScriptURL : req.query.appsScriptURL;

  if (!APPS_SCRIPT_URL) {
    return res.status(400).json({ error: "Missing Apps Script URL" });
  }

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: req.method,
      headers: { "Content-Type": "application/json" },
      body: req.method === "POST" ? JSON.stringify(req.body.payload || {}) : null,
    });

    const text = await response.text();

    try {
      const data = JSON.parse(text);
      res.status(response.status).json(data);
    } catch {
      res.status(response.status).send(text);
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Proxy error" });
  }
}