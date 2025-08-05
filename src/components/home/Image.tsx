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
    <div
      className={`${
        secondRow ? "hidden md:flex" : "flex"
      } justify-center group h-full`}
    >
      <img
        loading="lazy"
        className="rounded-2xl aspect-video object-cover w-full h-full transition-all duration-500 group-hover:scale-110 group-hover:brightness-110 filter grayscale-0 hover:grayscale-0"
        src={src}
        alt={alt}
      />
    </div>
  );
}
