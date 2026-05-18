import BrandsImage from "../parts/BrandsImg";
import HeroImage from "../parts/HeroImage";
import BestBuyImage from "../parts/BestBuyImg";

export default function Start() {

  return <>
    
    <HeroImage
      src="./images/HomePageImg.png"
      alt="Clothes on a rack and a hand reaching for them"
    />
    
    <section className="image-row">
      <div className="image-card">
        <BrandsImage
        className="brands-image"
        src="./images/BrandsImg.png"
        alt="Bags on shelfs in a store"
        />
        <a href="/brands" className="image-button">
          Populära märken!
        </a>
        
        </div>
      <div className="image-card">
         <BestBuyImage
         className="bestBuy-image"
         src="./images/BestBuyImg.png"
         alt="Woman looking at clothes"
        />
        <a href="/cheap" className="image-button">
          Billigast just nu!
        </a>
      </div>
    </section>
  </>;
}

Start.route = {
    path: '/',
    index: 1,
};
