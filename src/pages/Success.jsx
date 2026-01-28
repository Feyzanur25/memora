import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiFetch } from "../utils/api.js";

export default function Success() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await apiFetch("/capsules/count");
        setCount(res.count);
      } catch (error) {
        console.error("Error fetching capsule count:", error);
      }
    };

    fetchCount();
  }, []);

  return (
    <section className="success">
      <div className="container success-inner">
        <h1>Capsule Locked 🔒</h1>

        <p>
          Your message is securely stored.
          <br />
          It will automatically unlock on the selected date.
        </p>

        <p style={{ marginTop: "20px", opacity: 0.8 }}>
          Total capsule count: <strong>{count}</strong>
        </p>

        <div className="success-actions">
          <Link to="/" className="success-btn">
            Return to Home
          </Link>

          <Link to="/create" className="success-btn secondary">
            Create New Capsule
          </Link>
        </div>
      </div>
    </section>
  );
}
