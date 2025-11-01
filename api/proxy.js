export default async function handler(req, res) {
  const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxDOJDkdABOLBlBjVhwnpNjlxh2l80oDTL3tgqo_j8gLsDgFzCds978XW7szNmML7RI/exec";

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: req.method,
      headers: { "Content-Type": "application/json" },
      body: req.method === "POST" ? JSON.stringify(req.body) : null,
    });

    const text = await response.text();
    res.status(response.status).send(text);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Proxy error" });
  }
}
