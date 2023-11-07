const imgLinks = [
  "https://gunnrunners.org.au/wp-content/uploads/2021/02/2021-02-26_12-09-45-700x475.png",
  "https://gunnrunners.org.au/wp-content/uploads/2021/02/2021-02-26_12-19-17-700x475.png",
  "https://gunnrunners.org.au/wp-content/uploads/2019/08/Echuca-Sweat-vs-Steam-2018_-700x475.jpg",
  "https://gunnrunners.org.au/wp-content/uploads/2019/08/Christmas-Run-2018-700x475.jpg",
  "https://gunnrunners.org.au/wp-content/uploads/2021/02/2021-02-26_12-11-04-700x475.png",
  "https://gunnrunners.org.au/wp-content/uploads/2021/02/2021-02-26_12-19-58-671x455.png",
  "https://gunnrunners.org.au/wp-content/uploads/2021/02/2021-02-26_12-23-48-700x475.png",
  "https://scontent.fmel16-1.fna.fbcdn.net/v/t39.30808-6/393643559_10161403192483033_1531983085060895806_n.jpg?stp=cp6_dst-jpg&_nc_cat=108&ccb=1-7&_nc_sid=5f2048&_nc_ohc=Aysqk9OEZUcAX8L5XFF&_nc_ht=scontent.fmel16-1.fna&oh=00_AfAokAX3st3lPXYunVZNg_BgTn6uVCUwXoUYek0kzjZNew&oe=654E6927",
];

export const Home = () => {
  return (
    <div className="flex items-center flex-col gap-8">
      <div className="grid gap-4 grid-cols-2 h-64 grid-rows-2 md:grid-cols-4 md:grid-rows-2 max-w-3xl">
        {imgLinks.map((imgLink, index) => (
          <div
            className={`${
              index > 3 ? "hidden md:flex" : "flex"
            } justify-center`}
            key={index}
          >
            <img className="rounded-lg aspect-video" src={imgLink} />
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center gap-6 max-w-3xl">
        <div className="flex flex-col gap-2 items-center text-center">
          <h1 className="text-4xl font-extrabold">Welcome to Gunn Runners</h1>
          <h2 className="text-xl font-light">
            Melbourne's Most Social Running Group
          </h2>
        </div>
        <div className="flex flex-col gap-4">
          <h2>
            We meet every Tuesday night for a run at Albert Park Lake over a
            3.5km or 5km timed circuit.
          </h2>
          <p>
            Join us at 6:15pm at The Limerick Arms Hotel (364 Clarendon Street,
            South Melbourne) before we head over to the lake. Afterwards,
            everyone is welcome back to the pub for a meal and a free drink -
            compliments of the Limerick Arms.
          </p>
          <p>
            While your first run is on us, each run after costs $5 and helps
            support the Gunn Runners club and the various charities that we
            donate to throughout the year.
          </p>
          <p>
            You can pay with cash or preferably via bank transfer:
            <br />
            <br />
            <strong>Account Name:</strong> Gunn Runners
            <br />
            <strong>BSB:</strong> 083-054
            <br />
            <strong>Account Number:</strong> 87 284 4868
          </p>

          <p>
            Please also complete our online waiver form before arriving for the
            first time.
          </p>
          <strong className="text-center py-2">
            We hope to see you there!
          </strong>
        </div>
      </div>
    </div>
  );
};
