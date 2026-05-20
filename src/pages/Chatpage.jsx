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


    // Generera exempelmeddelanden baserat på vilken annons man klickade på
    useEffect(() => {
        setChatMessages([
            {id: 1, sender: "seller", text: `Hej! Roligt att du är intresserad av min ${listingTitle}.`, time: "12:30"},
            { id: 2, sender: "buyer", text: `Ja precis! Finns den kvar?`, time: "12:34" },            {id: 3, sender: "seller", text: `Hej! Roligt att du är intresserad av min ${listingTitle}.`, time: "12:30"},
            { id: 3, sender: "seller", text: `Jajamen, det gör den!`, time: "12:35" }
        ])
    }, [listingTitle]);


    const handleSend = (e) => {
        e.preventDefault();
        if (!typedMessage.trim()) return;

        const newMessage = {
            id: Date.now(),
            sender: "buyer",
            text: typedMessage,
            time: new Date().toLocaleTimeString("sv-SE", {hour: "2-digit", minute: "2-digit"})  
        };

        setChatMessages([...chatMessages, newMessage]);
        setTypedMessage("");
    };

}