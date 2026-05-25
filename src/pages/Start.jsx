import { NavLink } from "react-router-dom";
import BrandsImage from "../parts/BrandsImg";
import HeroImage from "../parts/HeroImage";
import BestBuyImage from "../parts/BestBuyImg";


export default function Start() {
  const token = localStorage.getItem("token");

  return (
    <>
      <div className="hero-wrapper">

        <HeroImage
          src="./images/HomePageImg.png"
          alt="Clothes on a rack and a hand reaching for them"
        />

        <div className="hero-overlay">
          <h2>Redo att rensa garderoben?</h2>

          {/* Skickar användaren till /createlisting om inloggad, annars /login */}
          <NavLink
            to={token ? "/createlisting" : "/login"}
            className="hero-button"
          >
            SÄLJ NU
          </NavLink>
          <p>Sälj nu och ge dina saker ett nytt liv</p>
        </div>

      </div>

      <section className="image-row">

        <div className="image-card">
          <BrandsImage
            className="brands-image"
            src="./images/BrandsImg.png"
            alt="Bags on shelves in a store"
          />
          
          <NavLink to="/brands" className="image-button">
            Populära märken!
          </NavLink>
        </div>

        <div className="image-card">
          <BestBuyImage
            className="bestBuy-image"
            src="./images/BestBuyImg.png"
            alt="Woman looking at clothes"
          />
          <NavLink to="/cheap" className="image-button">
            Billigast just nu!
          </NavLink>
        </div>

      </section>
    </>
  );
}

Start.route = {
  path: '/',
  label: 'Start',
  index: 1,
};