import { useEffect, useState } from "react";
import "../css/Listings.css";
import { fetchHerrListings } from "../utils/listings";

function Herr() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      setLoading(true);

      const data = await fetchHerrListings();

      setListings(data || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Kunde inte hämta Herr annonser");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Laddar Herr annonser...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main className="listings-container">
      <div>
        <h1>Herr</h1>
      </div>

      {listings.length === 0 ? (
        <p>Inga Herr annonser ännu</p>
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
                  <figure className="listing-image-container">
                    <img
                      src={imageUrl}
                      alt={attrs?.title || "Bild"}
                      className="listing-image"
                    />
                  </figure>
                )}

                <header>
                  <h2>{attrs?.title || "Ingen titel"}</h2>
                </header>

                <section className="listing-info">
                  <p>
                    {attrs?.price
                      ? `${attrs.price.toLocaleString()} kr`
                      : "Pris saknas"}
                  </p>

                  <p>{attrs?.location || "Ingen plats"}</p>
                </section>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}

Herr.route = {
  path: "/herr",
  index: 9,
};

export default Herr;