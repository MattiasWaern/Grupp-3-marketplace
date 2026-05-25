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

export async function fetchHerrListings() {
  try {
    const response = await fetch(
      `${API_URL}/listings/herr`
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    return data.data || [];
  } catch (error) {
    console.error("Fel vid hämtning av Herr annonser:", error);
    return [];
  }
}

export async function fetchBarnListings() {
  try {
    const response = await fetch(
      `${API_URL}/listings?populate=*&filters[category][$eq]=Kläder&filters[subcategory][$eq]=Barn`
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    return data.data || [];
  } catch (error) {
    console.error("Fel vid hämtning av Barn annonser:", error);
    return [];
  }
}

export async function fetchHemListings() {
  try {
    const response = await fetch(
      `${API_URL}/listings?populate=*&filters[category][$eq]=Hem`
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    return data.data || [];
  } catch (error) {
    console.error("Fel vid hämtning av Hem annonser:", error);
    return [];
  }
}

export async function fetchElektronikListings() {
  try {
    const response = await fetch(
      `${API_URL}/listings?populate=*&filters[category][$eq]=Elektronik`
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    return data.data || [];
  } catch (error) {
    console.error("Fel vid hämtning av Elektronik annonser:", error);
    return [];
  }
}