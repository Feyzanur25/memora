import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";
import { Link } from "react-router-dom";

export default function MyCapsules() {
  const [capsules, setCapsules] = useState([]);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    apiFetch("/capsules")
      .then(setCapsules)
      .catch((err) => alert(err.message));
  }, []);

  const handleDelete = async (id) => {
    const ok = window.confirm("Silmek istiyor musun?");
    if (!ok) return;

    await apiFetch(`/capsules/${id}`, {
      method: "DELETE",
    });

    setCapsules((prev) =>
      prev.filter((c) => c.id !== id)
    );
  };

  return (
    <section className="capsules">
      <div className="container capsules-inner">
        <h1>My Capsules</h1>

        {capsules.map((c) => {
          const isUnlocked = c.unlockDate <= today;

          return (
            <div key={c.id} className="capsule-card">
              <p>
                {isUnlocked
                  ? c.text
                  : "Capsule is still locked"}
              </p>

              <button
                className="delete-btn"
                onClick={() => handleDelete(c.id)}
              >
                Delete
              </button>

              {isUnlocked && (
                <Link to={`/capsules/${c.id}`}>
                  Detaya Git
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
