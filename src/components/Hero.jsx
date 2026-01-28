import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero-inner">
        <h1>Memories entrusted to time</h1>

        <p>
          Write today.
          <br />
          Read in the future.
          <br />
          Securely store your memories.
        </p>

        <Link to="/create-capsule" className="hero-btn">
          Create Capsule
        </Link>
      </div>
    </section>
  );
}
