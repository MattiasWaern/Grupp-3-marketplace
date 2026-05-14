import { useEffect, useState } from "react";
import '../css/Listings.css';


// Hämtar alla annonser från backend och visar dom
function Listings(){

    // State
    const [listngs, setListings] = useState([]);
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
            const data = await response.json();

            setListings(data.data);
        } catch (err){
            console.error(err);
            setError("Kunde inte hämta annonser");
        } finally {
            setLoading(false);
        }
    };

    if(loading){
        return <p>Laddar annonser...</p>
    }

    if(error){
        return <p>{error}</p>
    }
}