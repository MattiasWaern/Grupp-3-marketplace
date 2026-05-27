const API_URL = "http://localhost:1337/api";

export async function fetchReviewsByListing(listingId) {
  try {
    const res = await fetch(
      `${API_URL}/reviews/listings/${listingId}`
    );

    if (!res.ok) {
      throw new Error(`HTTP${res.status}`);
    }

    const data = await res.json();
    return data || [];
  } catch (err) {
    console.error("Fel vid hämtning av recensioner:", err);
    return [];
  }
}