import { useState } from "react";
import { apiFetch } from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function CreateCapsule() {
  const [text, setText] = useState("");
  const [date, setDate] = useState("");
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('text', text);
      formData.append('unlockDate', date);

      photos.forEach(photo => {
        formData.append('photos', photo);
      });

      videos.forEach(video => {
        formData.append('videos', video);
      });

      console.log('Gönderilen veriler:', { text, date, photos: photos.length, videos: videos.length });

      const res = await apiFetch("/capsules", {
        method: "POST",
        body: formData
      });

      console.log('Sunucu yanıtı:', res);

      if (res.success) {
        navigate("/success");
      } else {
        alert("Capsule could not be created: " + (res.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Hata:", error);
      alert("Server error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="create">
      <div className="container">
        <div className="create-inner">
          <h1>Create Your Capsule</h1>
          <p>Write the message you want to leave for the future and set the unlock date.</p>

          <div className="create-form">
            <div className="form-group">
              <label htmlFor="capsule-text">Your Message</label>
              <textarea
                id="capsule-text"
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Write the message you want to leave for the future..."
                rows="6"
              />
            </div>

            <div className="form-group">
              <label htmlFor="unlock-date">Unlock Date</label>
              <input
                id="unlock-date"
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="form-group">
              <label htmlFor="photos">Photos (Optional)</label>
              <input
                id="photos"
                type="file"
                multiple
                accept="image/*"
                onChange={e => setPhotos(Array.from(e.target.files))}
              />
            </div>

            <div className="form-group">
              <label htmlFor="videos">Videos (Optional)</label>
              <input
                id="videos"
                type="file"
                multiple
                accept="video/*"
                onChange={e => setVideos(Array.from(e.target.files))}
              />
            </div>

            <button
              className="create-btn"
              onClick={handleSubmit}
              disabled={loading || !text || !date}
            >
              {loading ? "Saving..." : "Lock Capsule"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
