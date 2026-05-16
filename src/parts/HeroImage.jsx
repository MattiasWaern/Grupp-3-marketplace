export default function HeroImage({ src, alt, heading }) {
  return (
    <div className="hero-image-holder">
      <img src={src} alt={alt} />
      <h2>{heading}</h2>
    </div>
  );
}