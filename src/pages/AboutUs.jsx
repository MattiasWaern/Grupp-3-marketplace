export default function AboutUs() {
  return(
  
  <section className="aboutUs">
    <h1>Om oss</h1>
  
    <p>
      Välkommen till The Selling Point - en marknadsplats där köp och sälj
      blir enket, trygt och tillgängligt för alla.
    </p>

    <p>
      Vårt mål är att skapa en modern plattform där användaren kan upptäcka
      unika produkter, sälja saker de inte längre behöver och helt enkelt komma i
      kontakt med andra.
   </p>

    <p>
      Vi tror på att ge produkter ett  andra liv samtidigt som vi gör
      onlineshopping mer personlig och hållbar.
    </p>

    <h2>Vad vi erbjuder</h2>

    <ul>
      <li>Enkel skapning av annonser</li>
      <li>Trygga användarkonton</li>
      <li>Produktkategorier för alla</li>
      <li>En smidig och modern shoppingupplevelse</li>
    </ul>

  <h2>Vår vision</h2>

    <p>
      Vi vill att The Selling Point ska bli en trygg plattform där määnniskor
      kan köpa och sälja med förtroende samtidigt som vi bidrar till mer
      hållbar konsumtion.
    </p>
</section>
) 
} 

  
  AboutUs.route = {
    path: '/aboutus',
    label: 'About us',
    index: 5,
}

  