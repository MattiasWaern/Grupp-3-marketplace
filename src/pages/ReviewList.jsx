import { useEffect, useState } from "react";

export default function ReviewList({ listingId }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(
          `http://localhost:1337/api/reviews?populate=user&filters[listing][id][$eq]=${listingId}`
        );

        const data = await res.json();
        setReviews(data.data || []);
      } catch (error) {
        console.error("Kunde inte hämta reviews:", error);
      }
    };

    fetchReviews();
  }, [listingId]);

  return (
    <div>
      <h3>Recensioner</h3>

      {reviews.length === 0 && <p>Inga recensioner ännu</p>}

      {reviews.map((r) => {
        const attrs = r.attributes;

        return (
          <div key={r.id}>
            <p>{attrs.rating} ⭐</p>
            <p>{attrs.comment}</p>
          </div>
        );
      })}
    </div>
  );
}