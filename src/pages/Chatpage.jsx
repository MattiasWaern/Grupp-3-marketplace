import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import '../css/chatpage.css'

function ChatPage(){
    const location = useLocation();
    const navigate = useNavigate();

    //Start-konversationer om localStorage är helt tomt
    const defaultConversations = [
        {
            id: "1",
            sellerName: "Annika Garcia",
            listingTitle: "iPhone 13 Pro",
            listingImage: null,
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
            listingImage: null,
            lastMessage: "JAAAAAAAA",
            time: "igår",
            messages: [
                { id: 1, sender: "buyer", text: "Hej! Går du ner något i pris?", time: "18:20" },
                { id: 2, sender: "seller", text: "Ja, 4000 kr funkar fint!", time: "18:35" }
            ]
        }
    ];

    const [conversations, setConversations] = useState(() => {
        const saved = localStorage.getItem("chats");
        return saved ? JSON.parse(saved) : defaultConversations;
    });

    
    // State för vilken konversation som är aktiv just nu (null = ingen vald)
    const [activeConversation, setActiveConversation] = useState(null);
    const [typedMessage, setTypedMessage] = useState("");

    useEffect(() => {
        localStorage.setItem("chats", JSON.stringify(conversations));

        // Håll även den öppna chatten synkad om meddelanden uppdateras
        if(activeConversation){
            const current = conversations.find(c => c.id === activeConversation.id);
            if(current && current.messages.length !== activeConversation.messages.length) {
                setActiveConversation(current);
            }
        }
    }, [conversations, setActiveConversation]);



    // Hantera inkommande chatt från en annons
    useEffect(() => {
        const incomingSeller = location.state?.sellerName;
        const incomingTitle = location.state?.listingTitle;
        const incomingImage = location.state?.listingImage;

        if(incomingSeller && incomingTitle){
            // Kolla om vi redan har en konversation med denna säljare om just denna produkt
            const existingIndex = conversations.findIndex(
                c => c.sellerName === incomingSeller && c.listingTitle === incomingTitle
            );

            if(existingIndex !== -1){
                // Om den finns, öppna den direkt
                setActiveConversation(conversations[existingIndex]);
            } else {
                // Om den INTE finns, skapa en ny temporär konversation högst upp i listan
                const newConv = {
                    id: Date.now().toString(),
                    sellerName: incomingSeller,
                    listingTitle: incomingTitle,
                    listingImage: incomingImage,
                    lastMessage: "Inga meddelanden än",
                    time: "Nu",
                    messages: [
                        { id: 1, sender: "seller", text: `Hej! Roligt att du är intresserad av min ${incomingTitle}.`, time: "Just nu" }
                    ]
                };
                setConversations([newConv, ...conversations]);
                setActiveConversation(newConv);
            }

            window.history.replaceState({}, document.title);
        }
    }, [location.state]);



    const handleSend = (e) => {
        e.preventDefault();
        if (!typedMessage.trim()) return;

        const newMessage = {
            id: Date.now(),
            sender: "buyer",
            text: typedMessage,
            time: new Date().toLocaleTimeString("sv-SE", {hour: "2-digit", minute: "2-digit"})  
        };

    // Uppdatera meddelandena i den aktiva konversationen
    const updatedConversations = conversations.map(c => {
        if (c.id === activeConversation.id){
            const updatedMessages = [...c.messages, newMessage];
            const updatedConv = {
                ...c,
                lastMessage: typedMessage,
                time: "Nu",
                messages: updatedMessages
            };

            // Håll även vårt aktiva state synkat
            setActiveConversation(updatedConv);
            return updatedConv;
        }
        return c;
    });
        setConversations(updatedConversations);

        const currentUpdated = updatedConversations.find(c => c.id === activeConversation.id);
        setActiveConversation(currentUpdated);

        setTypedMessage("");
    };

return (
        <div className="chat-page-wrapper">
            <button className="back-btn-chat" onClick={() => navigate(-1)}>
                Tillbaka
            </button>

            <div className="inbox-layout">
                
                
                <div className="inbox-sidebar">
                    <div className="sidebar-header">
                        <h3>Meddelanden</h3>
                    </div>
                    <div className="conversation-list">
                        {conversations.map((conv) => (
                            <div 
                                key={conv.id} 
                                className={`conversation-item ${activeConversation?.id === conv.id ? "active" : ""}`}
                                onClick={() => setActiveConversation(conv)}
                            >
                                <div className="conv-avatar">
                                    {conv.listingImage ? (
                                        <img src={conv.listingImage} alt="Produkt" className="chat-avatar-img" />
                                    ) : (
                                        "?"
                                    )}
                                </div>
                                <div className="conv-info">
                                    <div className="conv-top-row">
                                        <h4>{conv.sellerName}</h4>
                                        <span className="conv-time">{conv.time}</span>
                                    </div>
                                    <p className="conv-listing-title">{conv.listingTitle}</p>
                                    <p className="conv-last-msg">{conv.lastMessage}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                
                <div className="inbox-chat-area">
                    {activeConversation ? (
                        <div className="chat-container standalone">
                            <div className="chat-header">
                                <div className="chat-avatar">
                                    {activeConversation.listingImage ? (
                                        <img src={activeConversation.listingImage} alt="Produkt" className="chat-avatar-img" />
                                    ) : (
                                        "?"
                                    )}
                                </div>
                                <div className="chat-header-info">
                                    <h4>{activeConversation.sellerName}</h4>
                                    <span className="online-dot">{activeConversation.listingTitle}</span>
                                </div>
                            </div>

                            <div className="chat-messages-box">
                                {activeConversation.messages.map((msg) => (
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
                    ) : (
                        
                        <div className="no-chat-selected">
                            <div className="no-chat-icon"></div>
                            <h3>Dina meddelanden</h3>
                            <p>Välj en konversation i listan till vänster för och börja chatta.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

ChatPage.route = {
    path: '/chatpage',
    index: 6,
};

export default ChatPage;