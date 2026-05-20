import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import '../css/chatpage.css'

function ChatPage(){
    const location = useLocation();
    const navigate = useNavigate();

    // Hårdkodad lista med tidigare konversationer (inkorgen)
    const [conversations, setConversations] = useState([
        {
            id: "1",
            sellerName: "Annika Garcia",
            listingTitle: "iPhone 13 Pro",
            lastMessage: "JAAAAAAAA",
            time: "igår",
            messages: [
                { id: 101, sender: "buyer", text: "Hej! Går du ner något i pris?", time: "18:20" },
                { id: 102, sender: "seller", text: "Ja, 4000 kr funkar fint!", time: "18:35" }
            ]
        },
                {
            id: "2",
            sellerName: "Mattias Waern",
            listingTitle: "Katt",
            lastMessage: "JAAAAAAAA",
            time: "igår",
            messages: [
                { id: 1, sender: "buyer", text: "Hej! Går du ner något i pris?", time: "18:20" },
                { id: 2, sender: "seller", text: "Ja, 4000 kr funkar fint!", time: "18:35" }
            ]
        }
    ]);
  




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

    return (
        <div className="chat-page-container">
            {/* Knapp för att gå tillbaka till föregående sida */}
            <button className="back-btn" onClick={() => navigate(-1)}>
                ← Tillbaka till annonsen
            </button>

            <div className="blocket-chat-container standalone">
                <div className="chat-header">
                    <div className="chat-avatar">💬</div>
                    <div className="chat-header-info">
                        <h4>Chatta med {sellerName}</h4>
                        <span className="online-dot">{listingTitle}</span>
                    </div>
                </div>

                <div className="chat-messages-box">
                    {chatMessages.map((msg) => (
                        <div key={msg.id} className={`chat-bubble-wrapper ${msg.sender}`}>
                            <div className="chat-bubble">
                                <p>{msg.text}</p>
                                <span className="chat-time">{msg.time}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSend} className="chat-input-form">
                    <input 
                        type="text" 
                        placeholder="Skriv ett meddelande..." 
                        value={typedMessage}
                        onChange={(e) => setTypedMessage(e.target.value)}
                    />
                    <button type="submit" className="chat-send-btn">Skicka</button>
                </form>
            </div>
        </div>
    );
}

ChatPage.route = {
    path: '/chatpage',
    index: 6,
};

export default ChatPage;