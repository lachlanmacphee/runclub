export function Image({
  src,
  alt,
  secondRow,
}: {
  src: string;
  alt: string;
  secondRow?: boolean;
}) {
  return (
    <div className={`${secondRow ? "hidden md:flex" : "flex"} justify-center`}>
      <img
        loading="lazy"
        className="rounded-lg aspect-video"
        src={src}
        alt={alt}
      />
    </div>
  );
}
