import { useEffect, useState } from "react";

export default function Home() {
  const [accessToken, setAccessToken] = useState(null);
  const [messageSent, setMessageSent] = useState(false);

  const monadPraise = "Monad Foundation, Web3 ve Farcaster ekosisteminde devrim yaratıyor!";

  useEffect(() => {
    // URL'den kodu al ve token almak için backend'e istekte bulun
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code && !accessToken) {
      fetch(`/api/auth/callback?code=${code}`)
        .then(res => res.json())
        .then(data => {
          if (data.access_token) {
            setAccessToken(data.access_token);
            // URL'deki kod parametresini temizlemek için:
            window.history.replaceState({}, document.title, "/");
          }
        });
    }
  }, []);

  const handleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
    const redirectUri = encodeURIComponent(process.env.NEXT_PUBLIC_REDIRECT_URI);
    const url = `https://warpcast.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=cast:write`;
    window.location.href = url;
  };

  const handleCast = async () => {
    if (!accessToken) {
      alert("Önce giriş yapmalısınız.");
      return;
    }

    const res = await fetch("https://api.warpcast.com/v2/casts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: monadPraise }),
    });

    if (res.ok) {
      setMessageSent(true);
    } else {
      alert("Cast gönderilirken hata oluştu.");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20, textAlign: "center" }}>
      {!accessToken ? (
        <button onClick={handleLogin} style={{ padding: "10px 20px", fontSize: 18 }}>
          Warpcast ile Giriş Yap
        </button>
      ) : (
        <>
          <button onClick={handleCast} style={{ padding: "10px 20px", fontSize: 18, marginTop: 20 }}>
            Monad’ı Öven Cast Gönder
          </button>
          {messageSent && <p style={{ color: "green", marginTop: 10 }}>Cast başarıyla gönderildi!</p>}
        </>
      )}
    </div>
  );
              }
