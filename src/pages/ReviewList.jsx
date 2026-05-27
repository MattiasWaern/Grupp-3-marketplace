import { useEffect, useState } from "react";
import { fetchReviewsByListing } from "../utils/reviews";
import "../CSS/reviews.css";

export default function ReviewList({ listingId, refresh }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchReviewsByListing(listingId);
      setReviews(data);
    };

    if (listingId) load();
  }, [listingId, refresh]);

  return (
    <div>
      <h3>Recensioner</h3>

      {reviews.length === 0 && <p>Inga recensioner ännu</p>}

      {reviews.map((r) => {
        return (
          <div key={r.id}>
            <p>{r.rating} ⭐</p>
            <p>{r.review}</p>
          </div>
        );
      })}
    </div>
  );
}
