import { NavLink } from "react-router-dom";
import { useState } from "react";

export default function Header() {
  const [search, setSearch] = useState("");

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
            <NavLink to="/new-ad">Ny annons</NavLink>
            <NavLink to="/login">Logga in</NavLink>
            <NavLink to="/signup" className="signUp">
              Skapa konto
            </NavLink>
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