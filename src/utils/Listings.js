const API_URL = "http://localhost:1337/api";

export async function fetchDamListings() {
  try {
    const response = await fetch(
      `${API_URL}/listings?populate=*&filters[category][$eq]=Kläder&filters[subcategory][$eq]=Dam`
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    return data.data || [];
  } catch (error) {
    console.error("Fel vid hämtning av Dam annonser:", error);
    return [];
  }
}