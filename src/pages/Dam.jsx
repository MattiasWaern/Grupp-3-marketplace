import { useEffect, useState } from "react";
import "../css/Listings.css";
import { fetchDamListings } from "../utils/listings";

function Dam() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      setLoading(true);

      const data = await fetchDamListings();

      setListings(data || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Kunde inte hämta Dam annonser");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Laddar Dam annonser...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="listings-container">
      <h1>Dam</h1>

      {listings.length === 0 ? (
        <p>Inga Dam annonser ännu</p>
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
              <div
                key={item.id}
                className="listing-card"
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

                <p>
                  {attrs?.price
                    ? `${attrs.price.toLocaleString()} kr`
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

Dam.route = {
  path: "/dam",
  index: 5,
};

export default Dam;