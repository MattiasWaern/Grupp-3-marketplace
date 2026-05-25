import { useEffect, useState } from "react";
import "../css/Listings.css";
import { fetchHemListings } from "../utils/listings";

function Hem() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      setLoading(true);

      const data = await fetchHemListings();

      setListings(data || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Kunde inte hämta Hem annonser");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Laddar Hem annonser...</p>;
  if (error) return <p>{error}</p>;

  return (
    <main className="listings-container">
      <div>
        <h1>Hem</h1>
      </div>

      {listings.length === 0 ? (
        <p>Inga Hem annonser ännu</p>
      ) : (
        <section className="listings-grid">
          {listings.map((item) => {
            const attrs = item.attributes || item;

            const imageUrl =
              attrs?.image?.data?.attributes?.url
                ? `http://localhost:1337${attrs.image.data.attributes.url}`
                : attrs?.image?.url
                ? `http://localhost:1337${attrs.image.url}`
                : null;

            return (
              <article key={item.id} className="listing-card">
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
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}

Hem.route = {
  path: "/hem",
  index: 10,
};

export default Hem;