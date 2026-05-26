import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Header() {
  const [search, setSearch] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [username, setUsername] = useState("");
  const [unreadMessages, setUnreadMessages] = useState(0); 
  const navigate = useNavigate();

  // Kör useEffect när headern laddas och kollar om det finns en sparad användare
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setIsLoggedIn(true);
      const userObj = JSON.parse(storedUser);
      setUsername(userObj.username); // Hämtar namnet

      // HÄMTA OLÄSTA MEDDELANDEN FRÅN  CUSTOM ENDPOINT
      fetch("http://localhost:1337/api/messages/unread-count", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data && typeof data.unreadCount === 'number') {
            setUnreadMessages(data.unreadCount); // Sparar siffran i state
          }
        })
        .catch(err => console.error("Kunde inte hämta olästa meddelanden:", err));

    } else {
      setIsLoggedIn(false);
      setUsername("");
      setUnreadMessages(0);
    }
  }, []);

  // Funktion för att logga ut
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId"); 

    setIsLoggedIn(false);
    setUsername("");
    setUnreadMessages(0);

    // Skicka användaren till startsidan efter utloggning
    navigate("/");
  };

  return (
    <>
      <header>
        <div className="topRow">
          
          <NavLink to="/" className="titleLink">
            <h1 className="title">The Selling Point</h1>
          </NavLink>

          <input
            type="text"
            placeholder="Sök produkter..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="searchBar"
          />

          <nav className="navLinks">
            <NavLink to="/listings">Annonser</NavLink>
            <NavLink to="/createlisting">Ny annons</NavLink>
            
            
          <NavLink to="/chatpage" className="chatLink">
            Meddelande
            {unreadMessages > 0 && (
              <span className="unreadBadge">{unreadMessages}</span>
            )}
          </NavLink>

            {/* Om inloggad, visa användarnamn plus logga ut */}
            {isLoggedIn ? (
              <>
                <span className="welcomeText">Hej, {username}!</span>
                <button onClick={handleLogout} className="logoutBtn">
                  Logga ut
                </button>
              </>
            ) : (
              /* Om INTE inloggad, visa Logga in plus Skapa konto */
              <>
                <NavLink to="/login">Logga in</NavLink>
                <NavLink to="/signup" className="signUp">
                  Skapa konto
                </NavLink>
              </>
            )}
          </nav>
        </div>

        <div className="divider"></div>

        <nav className="categoryLinks">
          <NavLink to="/dam">Dam</NavLink>
          <NavLink to="/herr">Herr</NavLink>
          <NavLink to="/barn">Barn</NavLink>
          <NavLink to="/hem">Hem</NavLink>
          <NavLink to="/elektronik">Elektronik</NavLink>

          <NavLink to="/aboutus" className="aboutLink">Om oss</NavLink>
        </nav>
      </header>
    </>
  );
}