export function Image({
  src,
  secondRow,
}: {
  src: string;
  secondRow?: boolean;
}) {
  return (
    <div className={`${secondRow ? "hidden md:flex" : "flex"} justify-center`}>
      <img className="rounded-lg aspect-video" src={src} />
    </div>
  );
}
