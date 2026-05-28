import { useState } from "react";
import "../CSS/reviews.css";

export default function ReviewForm({ listingId, onReviewAdded }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !token) {
      alert("Du måste vara inloggad för att skriva en recension");
      return;
    }

    try {
      setLoading(true);
      console.log("TOKEN", token);
      const response = await fetch(
        "http://localhost:1337/api/reviews",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            data: {
              title: "Review",
              review: comment,
              rating: rating,
              listing: listingId,
              users_permissions_user: user.id

            },
          }),
        }
      );
    

      if (!response.ok) {
        const errorData = await response.json();
        console.error(errorData);
        alert("Kunde inte skicka recension");
        return;
      }

      const data = await response.json();

      console.log("Review skapad:", data);

      setComment("");
      setRating(5);

      onReviewAdded?.();

    } catch (error) {
      console.error(error);
      alert("Något gick fel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h3>Skriv recension</h3>

      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
      >
        <option value={5}>5 ⭐</option>
        <option value={4}>4 ⭐</option>
        <option value={3}>3 ⭐</option>
        <option value={2}>2 ⭐</option>
        <option value={1}>1 ⭐</option>
      </select>

      <textarea
        placeholder="Skriv din kommentar..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Skickar..." : "Skicka recension"}
      </button>
    </form>
  );
}