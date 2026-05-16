import { useEffect, useState } from "react";
import '../css/Listings.css';

// Hämtar alla annonser från backend och visar dom
function Listings() {
    // State
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [sortBy, setSortBy] = useState("createdAt:desc");
    const [selectedCategory, setSelectedCategory] = useState("");

    useEffect(() => {
        fetchListings();
    }, []);

    // Funktion för att hämta annonser från backend
    const fetchListings = async () => {
        try {
            const response = await fetch(
                "http://localhost:1337/api/listings?populate=*"
            );

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const data = await response.json();
            console.log("Hämtade annonser:", data);

            // Strapi lägger data i data.data arrayen
            setListings(data.data || []);
        } catch (err) {
            console.error(err);
            setError("Kunde inte hämta annonser");
        } finally {
            setLoading(false);
        }
    };

    // Formatera datum
    const formatDate = (dateString) => {
        if (!dateString) return "Inget datum";
        const date = new Date(dateString);
        return date.toLocaleDateString('sv-SE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Hämta kategori ikon med riktiga emojis
    const getCategoryIcon = (category) => {
        const icons = {
            Elektronik: "?",
            Kläder: "?",
            Böcker: "?"
        };
        return icons[category] || "?";
    };

    // Hjälpfunktion för att hämta bild-URL från Strapis komplexa struktur
    const getImageUrl = (image) => {
        if (!image) return null;
        
        // För Strapi v4+ med populera
        if (image.data?.attributes?.url) {
            return `http://localhost:1337${image.data.attributes.url}`;
        }
        // För direkt URL
        if (image.url) {
            return `http://localhost:1337${image.url}`;
        }
        // För äldre versioner
        if (image.data && typeof image.data === 'string') {
            return `http://localhost:1337${image.data}`;
        }
        return null;
    };

    if (loading) {
        return <p className="loading-text">Laddar annonser...</p>;
    }

    if (error) {
        return <p className="error-text">{error}</p>;
    }

    if (listings.length === 0) {
        return (
            <div className="listings-container">
                <h1 className="listings-title">Alla annonser</h1>
                <p className="no-listings">Inga annonser hittades. Var den första att skapa en annons!</p>
            </div>
        );
    }

    return (
        <div className="listings-container">
            <h1 className="listings-title">Alla annonser</h1>

            <div className="listings-grid">
                {listings.map((listing) => {
                    // Hämta attribut från Strapis struktur
                    const attrs = listing.attributes || listing;
                    const imageUrl = getImageUrl(attrs.image);
                    
                    return (
                        <div className="listing-card" key={listing.id}>
                            {/* Kategori-badge */}
                            {attrs.category && (
                                <div className="category-badge">
                                    <span>{getCategoryIcon(attrs.category)}</span>
                                    <span>{attrs.category}</span>
                                </div>
                            )}
                            
                            {/* Bild om den finns */}
                            {imageUrl && (
                                <div className="listing-image-container">
                                    <img 
                                        src={imageUrl}
                                        alt={attrs.title || "Annonsbild"}
                                        className="listing-image"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            console.error("Bild kunde inte laddas:", imageUrl);
                                        }}
                                    />
                                </div>
                            )}
                            
                            {/* Innehåll */}
                            <h2>{attrs.title || "Utan titel"}</h2>
                            
                            <p className="listing-description">
                                {attrs.description || "Ingen beskrivning"}
                            </p>
                            
                            <div className="listing-details">
                                <p className="listing-price">
                                    {attrs.price ? `${attrs.price.toLocaleString()} kr` : "Pris saknas"}
                                </p>
                                
                                {attrs.location && (
                                    <p className="listing-location">
                                         {attrs.location}
                                    </p>
                                )}
                                
                                {attrs.subcategory && (
                                    <p className="listing-subcategory">
                                         {attrs.subcategory}
                                    </p>
                                )}
                            </div>
                            
                            <p className="listing-date">
                                 {formatDate(attrs.publishedAt || attrs.createdAt)}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Listings;