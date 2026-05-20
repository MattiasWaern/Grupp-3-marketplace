import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import '../css/Listings.css'

function ChatPage(){
    const location = useLocation();
    const navigate = useNavigate();


    // Hämta data som skickades med via länken
    const sellerName = location.state?.sellerName || "Säljare";
    const listingTitle = location.state?.listingTitle || "Annons";

    const [typedMessage, setTypedMessage] = useState("");
    const [chatMessages, setChatMessages] = useState([]);
}