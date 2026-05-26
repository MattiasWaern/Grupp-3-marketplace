import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import '../css/chatpage.css';

function ChatPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [typedMessage, setTypedMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user"));


useEffect(() => {
  if (!token) {
    navigate("/login");
    return;
  }
  const query = new URLSearchParams({
    "populate[0]": "sender",
    "populate[1]": "receiver",
    "sort[0]": "createdAt:asc"
  }).toString();

  fetch(`http://localhost:1337/api/messages?${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (!res.ok) {
        
        return res.json().then(err => { throw err; });
      }
      return res.json();
    })
    .then((response) => {
      const allMessages = response.data || [];
      const grouped = groupMessagesIntoConversations(allMessages, currentUser.id);
      setConversations(grouped);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Kunde inte hämta meddelanden:", err);
      
      if (err.error) {
        console.error("Detaljerat Strapi-fel:", err.error.message);
      }
      setLoading(false);
    });
}, [token, navigate]);

  // Hjälpfunktion för att gruppera meddelanden per användare (Säljare/Köpare)
const groupMessagesIntoConversations = (messages, currentUserId) => {
  const chatMap = {};

  messages.forEach((msg) => {
    const text = msg.text;
    const sender = msg.sender;
    const receiver = msg.receiver;

    if (!sender || !receiver) return;

    const isISender = sender.id === currentUserId;
    const otherUser = isISender ? receiver : sender;

  
    const key = otherUser.documentId;

    if (!chatMap[key]) {
      chatMap[key] = {
        id: key,                        
        sellerName: otherUser.username,
        listingTitle: "Chatt",
        listingImage: null,
        lastMessage: text,
        time: new Date(msg.createdAt).toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" }),
        messages: [],
      };
    }

        chatMap[key].messages.push({
        id: msg.id,
        documentId: msg.documentId, // <-- lägg till denna
        sender: isISender ? "buyer" : "seller",
        text: text,
        time: new Date(msg.createdAt).toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" }),
        });

    chatMap[key].lastMessage = text;
  });

  return Object.values(chatMap);
};



useEffect(() => {
  const incomingSeller = location.state?.sellerName;
  const incomingTitle = location.state?.listingTitle;
  const incomingImage = location.state?.listingImage;
  const incomingSellerId = location.state?.sellerId; // <-- ny

  if (incomingSeller && incomingTitle) {
    const existing = conversations.find((c) => c.sellerName === incomingSeller);
    if (existing) {
      setActiveConversation(existing);
    } else {
      const newConv = {
        id: incomingSellerId,  // <-- använd riktigt documentId, inte "temp-..."
        sellerName: incomingSeller,
        listingTitle: incomingTitle,
        listingImage: incomingImage,
        lastMessage: "Inga meddelanden än",
        time: "Nu",
        messages: [],
      };
      setConversations([newConv, ...conversations]);
      setActiveConversation(newConv);
    }
    window.history.replaceState({}, document.title);
  }
}, [location.state, conversations]);


const markMessagesAsRead = async (conversation) => {
  const unreadMessages = conversation.messages.filter(
    (msg) => msg.sender === "seller"
  );

  for (const msg of unreadMessages) {
    try {
      await fetch(`http://localhost:1337/api/messages/${msg.documentId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: { read: true } }),
      });
    } catch (err) {
      console.error("Kunde inte markera meddelande som läst:", err);
    }
  }
};

const handleSend = async (e) => {
  e.preventDefault();
  if (!typedMessage.trim() || !activeConversation) return;

const payload = {
  data: {
    text: typedMessage,
    read: false,
    publishedAt: new Date().toISOString(),
    sender: {
      connect: [{ documentId: currentUser.documentId }]
    },
    receiver: {
      connect: [{ documentId: activeConversation.id }]
    },
  },
};

  try {
    console.log("Payload:", JSON.stringify(payload, null, 2));
    console.log("currentUser:", currentUser);
    const res = await fetch("http://localhost:1337/api/messages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const savedMsgResponse = await res.json();

      const newLocalMessage = {
        id: savedMsgResponse.data.id,
        documentId: savedMsgResponse.data.documentId, // <-- lägg till
        sender: "buyer",
        text: typedMessage,
        time: new Date().toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" }),
        };

      const updatedConversations = conversations.map((c) => {
        if (c.id === activeConversation.id) {
          return {
            ...c,
            lastMessage: typedMessage,
            time: "Nu",
            messages: [...c.messages, newLocalMessage],
          };
        }
        return c;
      });

      setConversations(updatedConversations);
      setActiveConversation(updatedConversations.find((c) => c.id === activeConversation.id));
      setTypedMessage("");
    }
  } catch (err) {
    console.error("Kunde inte skicka meddelandet:", err);
  }
};

  if (loading) {
    return <div className="loading-box">Laddar dina meddelanden...</div>;
  }

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
                onClick={() => {
                    setActiveConversation(conv);
                    markMessagesAsRead(conv);
                    }}
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
                <button type="submit" className="chat-send-btn">
                  Skicka
                </button>
              </form>
            </div>
          ) : (
            <div className="no-chat-selected">
              <div className="no-chat-icon"></div>
              <h3>Dina meddelanden</h3>
              <p>Välj en konversation i listan till vänster för att börja chatta.</p>
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