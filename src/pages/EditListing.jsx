import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/createListing.css";

function EditListing() {
  const navigate = useNavigate();
  const location = useLocation();

  const listing = location.state?.listing;
  const [formData, setFormData] = useState({
    title: listing?.title || "",
    description: listing?.description || "",
    price: listing?.price || "",
    location: listing?.location || "",
    category: listing?.category || "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // useEffect(() => {
  //   if (!listing) {
  //     navigate("/listings");
  //   }
  // }, [listing, navigate]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Du måste vara inloggad");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:1337/api/listings/${listing.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            data: {
              title: formData.title,
              description: formData.description,
              price: parseInt(formData.price),
              location: formData.location,
              category: formData.category,
            },
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      setSuccess("Annonsen har uppdaterats!");
      setTimeout(() => navigate("/listings"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="create-listing-container" style={{ marginTop: "150px" }}>
      <h1>Redigera annons</h1>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Titel *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Beskrivning</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
          />
        </div>

        <div className="form-group">
          <label>Pris *</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Plats</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? "Sparar..." : "Spara ändringar"}
        </button>
      </form>
    </div>
  );
}
EditListing.route = {
  path: "/editlisting",
  index: 5,
};

export default EditListing;
