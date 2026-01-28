import { useState } from "react";
import { apiFetch } from "../utils/api.js";

export default function WalletLogin() {
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const connectWallet = async () => {
    try {
      setError("");
      setLoading(true);

      if (!window.ethereum) {
        throw new Error("MetaMask is not installed");
      }

      // 1️⃣ MetaMask cüzdan bağla
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const walletAddress = accounts[0];
      setAddress(walletAddress);

      // 2️⃣ Backend login → token al
      const data = await apiFetch("/login", {
        method: "POST",
        body: JSON.stringify({
          address: walletAddress,
        }),
      });

      // 3️⃣ Token'ı localStorage'a yaz
      localStorage.setItem("memora_token", data.token);
      localStorage.setItem("memora_wallet", walletAddress);

    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      {address ? (
        <>
          <p style={{ fontSize: 14, opacity: 0.8 }}>Connected Wallet</p>
          <strong>
            {address.slice(0, 6)}...{address.slice(-4)}
          </strong>
        </>
      ) : (
        <button onClick={connectWallet} disabled={loading}>
          {loading ? "Connecting..." : "Wallet / Login"}
        </button>
      )}

      {error && (
        <p style={{ color: "red", marginTop: 10 }}>
          {error}
        </p>
      )}
    </div>
  );
}
