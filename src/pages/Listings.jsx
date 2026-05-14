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

    //


    if(loading){
        return <p>Laddar annonser...</p>
    }

    if(error){
        return <p>{error}</p>
    }

    return(
        <div className="listings-container">
            <h1 className="listings-title">Alla annonser</h1>

            <div className="listings-grid">
                {listings.map((listing) => (
                    <div className="listings-card" key={listing.id}> 
                        <h2>{listing.title}</h2>

                        <p>{listing.description}</p>

                        <p className="listings-price"> {listing.price} kr</p>

                        <p className="listings-location"> {listing.location} </p>

                        <p className="listings-date"> {listing.published} </p>

                    </div>
                ))}
            </div>
        </div>
    )
}


export default Listings;