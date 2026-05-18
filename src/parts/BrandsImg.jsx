export default function BrandsImage({ src, alt, heading, className}) {
  return (
    <div className="brands-image-holder">
      <img   className={className} src={src} alt={alt} />
      {heading && <h2>{heading}</h2>}
    </div>
  );
}