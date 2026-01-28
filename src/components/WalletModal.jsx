import { useState } from "react";
import { apiFetch } from "../utils/api.js";

export default function WalletModal({ isOpen, onClose }) {
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const connectWallet = async () => {
    try {
      setError("");
      setLoading(true);

      if (!window.ethereum) {
        throw new Error("MetaMask yüklü değil. Lütfen MetaMask yükleyin.");
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

      // Başarılı bağlantı sonrası modalı kapat ve sayfayı yenile
      onClose();
      window.location.reload();

    } catch (err) {
      console.error(err);
      setError(err.message || "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>

        <h2>Connect Your Wallet</h2>
        <p>You need to connect your MetaMask wallet to use Memora.</p>

        {address ? (
          <div className="wallet-connected">
            <div className="success-icon">✅</div>
            <p>Connected Wallet</p>
            <strong>{address.slice(0, 6)}...{address.slice(-4)}</strong>
            <button className="modal-btn primary" onClick={() => { onClose(); window.location.reload(); }}>
              Continue
            </button>
          </div>
        ) : (
          <div className="wallet-connect">
            <div className="wallet-icon">🔗</div>
            <button
              className="modal-btn primary"
              onClick={connectWallet}
              disabled={loading}
            >
              {loading ? "Connecting..." : "Connect with MetaMask"}
            </button>
          </div>
        )}

        {error && (
          <div className="error-message">
            <span>⚠️</span> {error}
          </div>
        )}
      </div>
    </div>
  );
}