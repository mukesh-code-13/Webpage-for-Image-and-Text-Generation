function ImageCard({ src, alt, caption }) {
  return (
    <div className="result-grid">
      <img className="image-preview" src={src} alt={alt} />
      <p>{caption}</p>
    </div>
  );
}

export default ImageCard;
