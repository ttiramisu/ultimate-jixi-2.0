export default async function handler(req, res) {
  // Hard-coded config sheet exec
  const CONFIG_SHEET_EXEC = process.env.CONFIG_SHEET_EXEC; 

  try {
    // Get main voting exec link
    const configRes = await fetch(CONFIG_SHEET_EXEC);
    const configData = await configRes.json();
    const VOTING_EXEC = configData.execLink;
    if(!VOTING_EXEC) return res.status(400).json({error:"Voting exec not set"});

    const response = await fetch(VOTING_EXEC, {
      method: req.method,
      headers: { "Content-Type": "application/json" },
      body: req.method==="POST"?JSON.stringify(req.body):null
    });

    const text = await response.text();
    res.status(response.status).send(text);
  } catch(err) {
    console.error(err);
    res.status(500).json({error:"Proxy error"});
  }
}
