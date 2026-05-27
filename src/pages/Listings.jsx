import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Listings.css";
import Chat from "../pages/Chatpage";
import ReviewForm from "../pages/ReviewForm";
import ReviewList from "../pages/ReviewList";

function Listings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [sortBy, setSortBy] = useState("createdAt:desc");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedListing, setSelectedListing] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchListings();
  }, [sortBy, selectedCategory]);

  const handleDelete = async (id) => {
    if (!window.confirm("Är du säker på att du vill ta bort annonsen?")) return;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:1337/api/listings/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      setSelectedListing(null);
      fetchListings();
    } catch (err) {
      console.error("Kunde inte ta bort annonsen", err);
    }
  };

  const fetchListings = async () => {
    if (listings.length === 0) {
      setLoading(true);
    }

    try {
let url = `http://localhost:1337/api/listings?populate[0]=image&populate[1]=user&sort=${sortBy}`;
      if (selectedCategory) {
        url += `&filters[category][$eqi]=${selectedCategory}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      console.log("Hämtade annonser:", data);

      setListings(data.data || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Kunde inte hämta annonser");
    } finally {
      setLoading(false);
    }
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

  const getCategoryIcon = (category) => {
    const icons = {
      Elektronik: "?",
      Kläder: "?",
      Hem: "?",
    };

    return icons[category] || "?";
  };

 const getImageUrl = (image) => {
  if (!image) return null;

  if (image.url) {
    return `http://localhost:1337${image.url}`;
  }

  return null;
};
  const filteredListings = listings.filter((listing) => {
    const attrs = listing.attributes || listing;
    const search = searchTerm.toLowerCase();

    return (
      attrs.title?.toLowerCase().includes(search) ||
      attrs.description?.toLowerCase().includes(search) ||
      attrs.category?.toLowerCase().includes(search) ||
      attrs.location?.toLowerCase().includes(search)
    );
  });

  if (loading && listings.length === 0) {
    return <p className="loading-text">Laddar annonser...</p>;
  }

  if (error) {
    return <p className="error-text">{error}</p>;
  }

  if (selectedListing) {
    const attrs = selectedListing.attributes || selectedListing;
    const imageUrl = getImageUrl(attrs.image);
    const sellerName = attrs.user?.username || "Anonym säljare";

    return (
      <div className="listing-detail-container">
        <button className="back-btn" onClick={() => setSelectedListing(null)}>
          Tillbaka till alla annonser
        </button>

        <div className="listing-detail-content">
          <div className="listing-detail-image-wrapper">
            {imageUrl ? (
              <img src={imageUrl} alt={attrs.title} className="detail-image" />
            ) : (
              <div className="detail-no-image">Ingen bild tillgänglig</div>
            )}
          </div>

          <div className="listing-detail-info">
            <span className="detail-category">
              {getCategoryIcon(attrs.category)} {attrs.category}
              {attrs.subcategory && ` / ${attrs.subcategory}`}
            </span>

            <h1>{attrs.title || "Utan titel"}</h1>

            <p className="detail-price">
              {attrs.price
                ? `${attrs.price.toLocaleString()} kr`
                : "Pris saknas"}
            </p>

            <div className="detail-meta">
              <p>
                <strong>Plats:</strong> {attrs.location || "Ej angivet"}
              </p>

              <p>
                <strong>Publicerad:</strong>{" "}
                {formatDate(attrs.publishedAt || attrs.createdAt)}
              </p>

              <p>
                <strong>Säljare:</strong> {sellerName}
              </p>
            </div>

            <div className="detail-description-box">
              <h3>Beskrivning</h3>
              <p>
                {attrs.description || "Ingen beskrivning angiven av säljaren."}
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
                    sellerId: attrs.user?.documentId, // <-- attrs istället för listing.user
                  },
                })
              }
            >
              Starta chatt med säljaren
            </button>

            <button
              className="contact-seller-btn"
              onClick={() =>
                navigate("/editlisting", {
                  state: {
                    listing: {
                      id: selectedListing.id,
                      ...attrs,
                    },
                  },
                })
              }
            >
              Redigera annons
            </button>

            <button
              className="contact-seller-btn"
              style={{ backgroundColor: "red" }}
              onClick={() => handleDelete(selectedListing.id)}
            >
              Ta bort annons
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="listings-container">
      <h1 className="listings-title">Alla annonser</h1>

      <div className="filter-sort-controls">
        <div className="control-group">
          <label htmlFor="search-input">Sök:</label>

          <input
            id="search-input"
            type="text"
            placeholder="Sök efter vara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="control-group">
          <label htmlFor="category-select">Kategori:</label>

          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Alla kategorier</option>
            <option value="Elektronik">Elektronik</option>
            <option value="Kläder">Kläder</option>
            <option value="Hem">Hem</option>
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="sort-select">Sortera efter:</label>

          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="publishedAt:desc">Datum: Nyast först</option>
            <option value="publishedAt:asc">Datum: Äldst först</option>
            <option value="price:asc">Pris: Lägst till högst</option>
            <option value="price:desc">Pris: Högst till lägst</option>
            <option value="title:asc">A-Ö</option>
          </select>
        </div>
      </div>

      {filteredListings.length === 0 ? (
        <p className="no-listings">Inga annonser matchar dina val.</p>
      ) : (
        <div className="listings-grid">
          {filteredListings.map((listing) => {
            const attrs = listing.attributes || listing;
            const imageUrl = getImageUrl(attrs.image);

            return (
              <div
                className="listing-card clickable"
                key={listing.id}
                onClick={() => setSelectedListing(listing)}
              >
                {attrs.category && (
                  <div className="category-badge">
                    <span>{getCategoryIcon(attrs.category)}</span>
                    <span>{attrs.category}</span>
                  </div>
                )}

                {imageUrl && (
                  <div className="listing-image-container">
                    <img
                      src={imageUrl}
                      alt={attrs.title || "Annonsbild"}
                      className="listing-image"
                    />
                  </div>
                )}

                <h2>{attrs.title || "Utan titel"}</h2>

                <div className="listing-details">
                  <p className="listing-price">
                    {attrs.price
                      ? `${attrs.price.toLocaleString()} kr`
                      : "Pris saknas"}
                  </p>

                  {attrs.location && (
                    <p className="listing-location">{attrs.location}</p>
                  )}
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

Listings.route = {
  path: "/listings",
  index: 3,
};

export default Listings;