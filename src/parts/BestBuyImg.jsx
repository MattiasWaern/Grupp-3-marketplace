export default function BestBuyImage({ src, alt, heading, className }) {
  return (
    <div className="best-buy-image-holder">
      <img   className={className} src={src} alt={alt} />
      {heading && <h2>{heading}</h2>}
    </div>
  );
}