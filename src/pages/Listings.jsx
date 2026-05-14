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


    const fetchListings = async () => {

    }
}