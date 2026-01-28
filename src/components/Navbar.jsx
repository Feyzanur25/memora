import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";
import WalletModal from "./WalletModal";

export default function Navbar() {
  const wallet = localStorage.getItem("memora_wallet");
  const [capsuleCount, setCapsuleCount] = useState(0);
  const [showWalletModal, setShowWalletModal] = useState(false);

  useEffect(() => {
    if (wallet) {
      apiFetch("/capsules/count")
        .then(data => {
          console.log("Capsule count:", data);
          setCapsuleCount(data.count || 0);
        })
        .catch(err => {
          console.error("Capsule count error:", err);
          setCapsuleCount(0);
        });
    }
  }, [wallet]);

  const handleLogout = () => {
    localStorage.removeItem("memora_token");
    localStorage.removeItem("memora_wallet");
    window.location.href = "/";
  };

  return (
    <>
      <nav className="navbar">
        <div className="container navbar-inner">
          <Link to="/" className="logo">
            Memora
          </Link>

          <div style={{ display: "flex", gap: "12px" }}>
            {wallet ? (
              <>
                <span style={{ fontSize: 14, opacity: 0.7 }}>
                  {wallet.slice(0, 6)}...{wallet.slice(-4)}
                </span>

                <Link to="/my-capsules" className="nav-btn">
                  My Capsules ({capsuleCount})
                </Link>

                <Link to="/create-capsule" className="nav-btn">
                  Create Capsule
                </Link>

                <button
                  className="nav-btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                className="nav-btn"
                onClick={() => setShowWalletModal(true)}
              >
                Wallet / Login
              </button>
            )}
          </div>
        </div>
      </nav>

      <WalletModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
      />
    </>
  );
}
