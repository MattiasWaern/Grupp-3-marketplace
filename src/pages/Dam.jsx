import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Listings.css";
import { fetchDamListings } from "../utils/listings";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";

function Dam() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedListing, setSelectedListing] = useState(null);

  const [refreshReviews, setRefreshReviews] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      setLoading(true);

      const data = await fetchDamListings();

      console.log("Dam DATA:", data);

      setListings(data || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Kunde inte hämta Dam annonser");
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

  if (loading) {
    return <p>Laddar Dam annonser...</p>;
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
          Tillbaka till Dam
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

            {/* REVIEWS */}
            <div className="reviews-section">
              <ReviewForm
                listingId={selectedListing.id}
                onReviewAdded={() =>
                  setRefreshReviews((prev) => prev + 1)
                }
              />

              <ReviewList
                listingId={selectedListing.id}
                refresh={refreshReviews}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // LISTA
  return (
    <div className="listings-container">
      <h1>Dam</h1>

      {listings.length === 0 ? (
        <p>Inga Dam annonser ännu</p>
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

                <h2>{attrs.title || "Ingen titel"}</h2>

                <p>
                  {attrs.price
                    ? `${Number(attrs.price).toLocaleString()} kr`
                    : "Pris saknas"}
                </p>

                <p>{attrs.location || "Ingen plats"}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

Dam.route = {
  path: "/dam",
  index: 10,
};

export default Dam;