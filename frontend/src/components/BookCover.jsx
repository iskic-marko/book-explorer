export default function BookCover({ src, alt, className = '' }) {
  if (!src) {
    return (
      <div className={`book-cover placeholder ${className}`}>
        <span>No Cover</span>
      </div>
    );
  }

  return (
    <div className={`book-cover ${className}`}>
      <img src={src} alt={alt} loading="lazy" />
    </div>
  );
}
