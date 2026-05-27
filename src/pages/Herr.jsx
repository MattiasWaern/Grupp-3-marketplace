import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Listings.css";
import { fetchHerrListings } from "../utils/listings";

function Herr() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedListing, setSelectedListing] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      setLoading(true);

      const data = await fetchHerrListings();

      console.log("Herr DATA:", data);

      setListings(data || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Kunde inte hämta Herr annonser");
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (image) => {
    if (!image) return null;

    if (image.url) {
      return `http://localhost:1337${image.url}`;
    }

    return null;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Inget datum";

    const date = new Date(dateString);

    return date.toLocaleDateString("sv-SE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return <p>Laddar Herr annonser...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  // DETALJVY
  if (selectedListing) {
    const attrs = selectedListing.attributes || selectedListing;
    const imageUrl = getImageUrl(attrs.image);
    const sellerName = attrs.user?.username || "Anonym säljare";

    return (
      <div className="listing-detail-container">
        <button
          className="back-btn"
          onClick={() => setSelectedListing(null)}
        >
          Tillbaka till Herr
        </button>

        <div className="listing-detail-content">
          <div className="listing-detail-image-wrapper">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={attrs.title}
                className="detail-image"
              />
            ) : (
              <div className="detail-no-image">
                Ingen bild tillgänglig
              </div>
            )}
          </div>

          <div className="listing-detail-info">
            <span className="detail-category">
              {attrs.category}
              {attrs.subcategory && ` / ${attrs.subcategory}`}
            </span>

            <h1>{attrs.title || "Utan titel"}</h1>

            <p className="detail-price">
              {attrs.price
                ? `${Number(attrs.price).toLocaleString()} kr`
                : "Pris saknas"}
            </p>

            <div className="detail-meta">
              <p>
                <strong>Plats:</strong>{" "}
                {attrs.location || "Ej angivet"}
              </p>

              <p>
                <strong>Säljare:</strong> {sellerName}
              </p>
            </div>

            <div className="detail-description-box">
              <h3>Beskrivning</h3>

              <p>
                {attrs.description ||
                  "Ingen beskrivning angiven av säljaren."}
              </p>
            </div>

            <button
              className="contact-seller-btn"
              onClick={() =>
                navigate("/chatpage", {
                  state: {
                    sellerName,
                    listingTitle: attrs.title,
                    listingImage: imageUrl,
                  },
                })
              }
            >
              Starta chatt med säljaren
            </button>
          </div>
        </div>
      </div>
    );
  }

  // LISTA
  return (
    <div className="listings-container">
      <h1 className="listings-title">Herr</h1>

      {listings.length === 0 ? (
        <p>Inga Herr annonser ännu</p>
      ) : (
        <div className="listings-grid">
          {listings.map((item) => {
            const attrs = item.attributes || item;

            const imageUrl = getImageUrl(attrs.image);

            return (
              <div
                key={item.id}
                className="listing-card clickable"
                onClick={() => setSelectedListing(item)}
              >
                {imageUrl && (
                  <div className="listing-image-container">
                    <img
                      src={imageUrl}
                      alt={attrs?.title || "Bild"}
                      className="listing-image"
                    />
                  </div>
                )}

                <h2>{attrs?.title || "Ingen titel"}</h2>

                <div className="listing-details">
                  <p className="listing-price">
                    {attrs?.price
                      ? `${Number(attrs.price).toLocaleString()} kr`
                      : "Pris saknas"}
                  </p>

                  <p className="listing-location">
                    {attrs?.location || "Ingen plats"}
                  </p>
                </div>

                <p className="listing-date">
                  {formatDate(attrs.publishedAt || attrs.createdAt)}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

Herr.route = {
  path: "/Herr",
  index: 9,
};

export default Herr;