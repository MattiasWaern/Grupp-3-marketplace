import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      navigate("/login");
      return;
    }

    const currentUser = JSON.parse(storedUser);
    setUser(currentUser);

   const fetchMyListings = async () => {
    try {
      const response = await fetch(
        `http://localhost:1337/api/listings?populate=*`
      );

      if (!response.ok) {
        throw new Error("Kunde inte hämta dina annonser.");
      }

      const result = await response.json();
      setMyListings(result.data || []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

    fetchMyListings();
  }, [navigate]);

  if (loading) return <p className="status-message">Laddar din profil...</p>;
  if (error) return <p className="status-message error">{error}</p>;

  return (
    <div className="profile-container">
      <section className="user-info-section">
        <h2>Min Profil</h2>
        {user && (
          <div className="user-card">
            <p>
              <strong>Namn:</strong> {user.username}
            </p>
            <p>
              <strong>E-post:</strong> {user.email}
            </p>
          </div>
        )}
      </section>

      <hr />

      <section className="my-listings-section">
        <h3>Mina utlagda annonser ({myListings.length})</h3>

        {myListings.length === 0 ? (
          <p>Du har inte lagt upp några annonser än.</p>
        ) : (
          <div className="listings-grid">
            {myListings.map((listing) => {
              
              const attrs = listing.attributes || listing;

              
              const imageUrl =
                attrs.image?.data?.attributes?.url || attrs.image?.url
                  ? `http://localhost:1337${attrs.image?.data?.attributes?.url || attrs.image?.url}`
                  : null;

              return (
                <div key={listing.id} className="listing-card">
                  <div className="listing-image-container">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={attrs.title}
                        className="listing-image"
                      />
                    ) : (
                      <div className="no-image-placeholder">📦 Ingen bild</div>
                    )}
                  </div>
                  <h4>{attrs.title || "Utan titel"}</h4>
                  <p>{attrs.price} kr</p>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
Profile.route = {
  path: "/profile",
  index: 5,
};
