import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../css/Listings.css';

// Hämtar alla annonser från backend och visar dom
function Listings() {
    // State
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [sortBy, setSortBy] = useState("createdAt:desc");
    const [selectedCategory, setSelectedCategory] = useState("");

    const [selectedListing, setSelectedListing] = useState(null);

    useEffect(() => {
        fetchListings();
    }, [sortBy, selectedCategory]);

    // Funktion för att hämta annonser från backend
    const fetchListings = async () => {
        setLoading(true);
        try {

           let url = `http://localhost:1337/api/listings?populate=*&sort=${sortBy}`;

            if(selectedCategory){
                url += `&filters[category][$eq]=${selectedCategory}`;
            }

            const response = await fetch(url);


            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const data = await response.json();
            console.log("Hämtade annonser:", data);

            // Strapi lägger data i data.data arrayen
            setListings(data.data || []);
            setError("")
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

    if(selectedListing){
        const attrs = selectedListing.attributes || selectedListing;
        const imageUrl = getImageUrl(attrs.image);
        const sellerName = attrs.user?.data?.attributes?.username || "Anonym säljare";
        
        return (
            <div className="listing-detail-container">
                {/* Tillbaka knapp*/}
                <button className="back-btn" onClick={() => setSelectedListing(null)}> Tillbaka </button>

                <div className="listing-detail-content">
                    <div className="listing-detail-image-wrapper">
                        {imageUrl ? (
                            <img 
                                src={imageUrl}
                                alt={attrs.title || "Annonsbild"}
                                className="detail-image"
                                onError={(e) => {
                                    e.target.src = "/path/to/default-image.jpg"; // Sätt en standardbild om laddningen misslyckas
                                }}
                            />
                        ) : (
                            <p>Ingen bild tillgänglig</p>
                        )}
                    </div>

                    <div className="listing-detail-info">
                        <span className="detail-category">
                            {getCategoryIcon(attrs.category)} {attrs.category}
                            {attrs.subcategory && `/ ${attrs.subcategory}`}
                        </span>

                        <h1>{attrs.title || "Ingen titel"}</h1>
                        <p className="detail-price">{attrs.price ? `${attrs.price.toLocaleString()} kr`: "Pris saknas" }</p>

                        <div className="detail-meta">
                            <p> <strong> Plats:</strong>{attrs.location || "Ej angivet"}</p>
                            <p> <strong> Publicerad:</strong>{formatDate(attrs.publishedAt || attrs.createdAt)}</p>
                            <p> <strong> Säljare:</strong>{sellerName}</p>
                        </div>

                        <div className="detail-description-box">
                            <h3>Beskrivning</h3>
                            <p>{attrs.description ||"ingen beskrvning angiven av säljaren"}</p>
                        </div>

                        <button className="contact-seller-btn" onClick={() => alert("Här kommer kontaktlogiken ligga sen")}>
                            Skicka meddelande
                        </button>
                        
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="listings-container">
            <h1 className="listings-title">Alla annonser</h1>

            <div className="filter-sort-controls">
                <div className="control-group">
                    <label htmlFor="category-select">Kategori:</label>
                    <select id="category-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                        <option value="">Alla kategorier</option>
                        <option value="Elektronik">Elektronik</option>
                        <option value="Kläder">Kläder</option>
                        <option value="Böcker">Böcker</option>
                    </select>
                </div>

                <div className="control-group">
                    <label htmlFor="sort-select">Sortera efter:</label>
                    <select id="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="publishedAt:desc">Datum: Nyast först</option>
                        <option value="publishedAt:asc">Datum: Äldst först</option>
                        <option value="price:asc">Pris: Lägst till högst</option>
                        <option value="price:desc">Pris: Högst till lägst</option>
                        <option value="title:asc">A-Ö</option>
                    </select>
                </div>
            </div>

            {listings.length === 0 ? (
                <p className="no-listings">Inga annonser matchar dina val.</p>
            ) : (
                <div className="listings-grid">
                    {listings.map((listing) => {
                        const attrs = listing.attributes || listing;
                        const imageUrl = getImageUrl(attrs.image);
                        
                        return (
                            
                            <div 
                                className="listing-card clickable" 
                                key={listing.id}
                                onClick={() => setSelectedListing(listing)}
                            >
                                {attrs.category && (
                                    <div className="category-badge">
                                        <span>{getCategoryIcon(attrs.category)}</span>
                                        <span>{attrs.category}</span>
                                    </div>
                                )}
                                
                                {imageUrl && (
                                    <div className="listing-image-container">
                                        <img src={imageUrl} alt={attrs.title || "Annonsbild"} className="listing-image" />
                                    </div>
                                )}
                                
                                <h2>{attrs.title || "Utan titel"}</h2>
                                
                                
                                <div className="listing-details">
                                    <p className="listing-price">
                                        {attrs.price ? `${attrs.price.toLocaleString()} kr` : "Pris saknas"}
                                    </p>
                                    
                                    {attrs.location && (
                                        <p className="listing-location">{attrs.location}</p>
                                    )}
                                </div>
                                
                                <p className="listing-date">
                                     {formatDate(attrs.publishedAt || attrs.createdAt)}
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

Listings.route = {
    path: '/listings',
    index: 3,
};

export default Listings;