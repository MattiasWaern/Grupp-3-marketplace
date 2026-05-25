import { NavLink, useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";

export default function Header() {
  const [search, setSearch] = useState("");
  const [isLoggedIn, SetIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  // kör useEffect när headern laddas och kollar om det finns en sparad användare
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser){
      SetIsLoggedIn(true);
      const userObj = JSON.parse(storedUser);
      setUsername(userObj.username); // Hämtar namnet
    } else {
      SetIsLoggedIn(false);
      setUsername("");
    }
}, []);

  // Funktion för att logga ut
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.getItem("userId");

    SetIsLoggedIn(false);
    setUsername("");

    // Skicka användaren till startsidan efter utloggning
    navigate("/");
  } 

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
            <NavLink to="/chatpage">Meddelande</NavLink>

            {/* Om inloggad, visa användarnamn + logga ut */}
            {isLoggedIn ? (
              <>
                <span className="welcomeText">Hej, {username}!</span>
                <button onClick={handleLogout} className="logoutBtn">
                  Logga ut
                </button>
              </>
            ) : (
              /* Om INTE inloggad, visa Logga in + Skapa konto */
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