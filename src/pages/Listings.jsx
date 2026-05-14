import { useEffect, useState } from "react";
import '../css/Listings.css';


// Hämtar alla annonser från backend och visar dom
function Listings(){

    // State
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {
        fetchListings();
    }, []);

// Funktion för att hämta annonser från backend
    const fetchListings = async () => {
        try {
            const response = await fetch (
                "http://localhost:1337/api/listings?populate=*"
            );

            if(!response.ok){
                throw new Error(`HTTP ${response.status}`);
            }
            const data = await response.json();
            console.log("Hämtade annonser")


            // Strapi lägger data i data.data arrayen
            setListings(data.data);
        } catch (err){
            console.error(err);
            setError("Kunde inte hämta annonser");
        } finally {
            setLoading(false);
        }
    };


    const getListingValue = (listing, field) => {
        if (listing.attributes){
            return listing.attributes[field] || "Inte angivet"
        }
    };

    // Formatera datum
    const formatDate = (dateString) => {    
        if(!dateString) return "Inget datum";
        const date = new Date(dateString);
        return date.toLocaleDateString('sv-SE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Hämta kategori ikon
    const getCategoryIcon = (category) => {
        const icons = {
            Elektronik: "?",
            Kläder: "?",
            Böcker: "?"
        };
        return icons[category] || "??";
    }


    if(loading){
        return <p className="loading-text">Laddar annonser...</p>
    }

    if(error){
        return <p className="error-text">{error}</p>
    }

    if(listings.length === 0 ){
        return (
            <div className="listings-container">
                <h1 className="listings-title">Alla annonser</h1>
                <p className="no-listings">Inga annonser hittades, var den första att skapa en lol</p>
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
                            {attrs.image?.data?.attributes?.url && (
                                <div className="listing-image-container">
                                    <img 
                                        src={`http://localhost:1337${attrs.image.data.attributes.url}`}
                                        alt={attrs.title}
                                        className="listing-image"
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