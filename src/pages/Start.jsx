import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import HeroImage from "../parts/HeroImage";
import "../CSS/start.css";

export default function Start() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [latestListings, setLatestListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLatestListings = async () => {
      setLoading(true);
      try {
        const url = `http://localhost:1337/api/listings/latest`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        setLatestListings(data.data || []);
        setError("");
      } catch (err) {
        console.error("Kunde inte hämta de senaste annonserna:", err);
        setError("Kunde inte ladda de senaste annonserna");
      } finally {
        setLoading(false);
      }
    };

    fetchLatestListings();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("sv-SE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getImageUrl = (image) => {
    if (!image) return null;
    if (image.data?.attributes?.url) {
      return `http://localhost:1337${image.data.attributes.url}`;
    }
    if (image.url) {
      return `http://localhost:1337${image.url}`;
    }
    return null;
  };

  return (
    <div className="home-page-container">
      <div className="hero-wrapper">
        <HeroImage src="./images/HomePageImg.png" alt="Clothes on a rack" />
        <div className="hero-overlay">
          <h2>Redo att rensa garderoben?</h2>
          <NavLink
            to={token ? "/createlisting" : "/login"}
            className="hero-button"
          >
            SÄLJ NU
          </NavLink>
          <p>Sälj nu och ge dina saker ett nytt liv</p>
        </div>
      </div>

      <section className="listings-container">
        <h2 className="listings-title">Senast upplagda annonser</h2>

        {loading && <p className="status-message">Laddar annonser...</p>}
        {error && <p className="status-message error">{error}</p>}

        {!loading && !error && latestListings.length === 0 ? (
          <p className="status-message">Inga annonser tillgängliga just nu.</p>
        ) : (
          <div className="card-container">
            {latestListings.map((listing) => {
              const attrs = listing.attributes || listing;
              const imageUrl = getImageUrl(attrs.image);

              return (
                <div
                  className="card clickable"
                  key={listing.id}
                  onClick={() => navigate("/listings")}
                >
                  <div className="listing-image-container">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={attrs.title || "Annonsbild"}
                        className="card-img"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.parentNode.classList.add("image-failed");
                        }}
                      />
                    ) : null}

                    <div className="no-image-placeholder">📦</div>

                    {attrs.category && (
                      <span className="category-badge">{attrs.category}</span>
                    )}
                  </div>

                  <div className="listing-card-body">
                    <h3 className="product-card-title">
                      {attrs.title || "Utan titel"}
                    </h3>

                    <div className="listing-footer">
                      <p className="listing-price">
                        {attrs.price
                          ? `${attrs.price.toLocaleString()} kr`
                          : "Pris saknas"}
                      </p>

                      <div className="listing-meta">
                        {attrs.location && (
                          <span className="listing-location">
                            {attrs.location}
                          </span>
                        )}
                        <span className="listing-date">
                          {formatDate(attrs.publishedAt || attrs.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

Start.route = {
  path: "/",
  label: "Start",
  index: 1,
};
