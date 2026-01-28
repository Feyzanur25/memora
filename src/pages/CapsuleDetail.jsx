import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";

export default function CapsuleDetail() {
  const { id } = useParams();
  const [capsule, setCapsule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch(`/capsules/${id}`)
      .then(setCapsule)
      .catch((err) => setError(err.message || "Capsule could not be loaded"))
      .finally(() => setLoading(false));
  }, [id]);

  const today = new Date().toISOString().split("T")[0];

  if (loading) {
    return (
      <section className="capsule-detail">
        <div className="container">
          <h1>Loading...</h1>
        </div>
      </section>
    );
  }

  if (error || !capsule) {
    return (
      <section className="capsule-detail">
        <div className="container">
          <h1>{error || "Capsule not found"}</h1>
          <Link to="/capsules" className="nav-btn">
            Return to List
          </Link>
        </div>
      </section>
    );
  }

  const isUnlocked = capsule.unlockDate <= today;

  return (
    <section className="capsule-detail">
      <div className="container capsule-detail-inner">
        <h1>Capsule Detail</h1>

        <div className="capsule-meta">
          <span>{isUnlocked ? "🔓 Unlocked" : "🔒 Locked"}</span>
          <span>Unlock Date: {capsule.unlockDate}</span>
        </div>

        <div className="capsule-content">
          {isUnlocked ? (
            <>
              <p>{capsule.text}</p>
              {capsule.photos && capsule.photos.length > 0 && (
                <div className="capsule-photos">
                  <h3>Photos:</h3>
                  {capsule.photos.map((photo, index) => (
                    <img key={index} src={`http://localhost:4002/uploads/${photo}`} alt={`Photo ${index + 1}`} style={{ maxWidth: '100%', margin: '10px 0' }} />
                  ))}
                </div>
              )}
              {capsule.videos && capsule.videos.length > 0 && (
                <div className="capsule-videos">
                  <h3>Videos:</h3>
                  {capsule.videos.map((video, index) => (
                    <video key={index} controls style={{ maxWidth: '100%', margin: '10px 0' }}>
                      <source src={`http://localhost:4002/uploads/${video}`} type="video/mp4" />
                    </video>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="locked-text">
              This capsule's unlock date has not arrived yet.
            </p>
          )}
        </div>

        <Link to="/capsules" className="nav-btn">
          Return to My Capsules
        </Link>
      </div>
    </section>
  );
}
