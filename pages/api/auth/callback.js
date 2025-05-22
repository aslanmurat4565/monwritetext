import fetch from "node-fetch";

export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) return res.status(400).json({ error: "Kod eksik" });

  try {
    const tokenRes = await fetch("https://warpcast.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: process.env.REDIRECT_URI,
      }),
    });

    if (!tokenRes.ok) {
      return res.status(500).json({ error: "Token alınamadı" });
    }

    const tokenData = await tokenRes.json();
    res.status(200).json({ access_token: tokenData.access_token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
