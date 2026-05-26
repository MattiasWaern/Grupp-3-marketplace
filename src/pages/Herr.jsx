import { useEffect, useState } from "react";
import "../css/Listings.css";
import { fetchHerrListings } from "../utils/listings";

function Herr() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadListings() {
      try {
        setLoading(true);

        const data = await fetchHerrListings();
        console.log("HERR DATA:", data);

        setListings(data || []);
        setError("");
      } catch (err) {
        console.error("Fel i Herr.jsx:", err);
        setError("Kunde inte hämta Herr annonser");
      } finally {
        setLoading(false);
      }
    }

    loadListings();
  }, []);

  if (loading) return <p>Laddar Herr annonser...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="listings-container">
      <h1>Herr</h1>

      {listings.length === 0 ? (
        <p>Inga Herr annonser ännu</p>
      ) : (
        <div className="listings-grid">
          {listings.map((item) => {
            const attrs = item.attributes || item;

            const imageUrl =
              attrs?.image?.data?.attributes?.url
                ? `http://localhost:1337${attrs.image.data.attributes.url}`
                : attrs?.image?.url
                ? `http://localhost:1337${attrs.image.url}`
                : null;

            return (
              <div key={item.id} className="listing-card">
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

                <p>
                  {attrs?.price
                    ? `${Number(attrs.price).toLocaleString()} kr`
                    : "Pris saknas"}
                </p>

                <p>{attrs?.location || "Ingen plats"}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

Herr.route = {
  path: "/herr",
  index: 9,
};

export default Herr;