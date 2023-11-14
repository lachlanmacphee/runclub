import { homeImgLinks } from "@/lib/constants";

export function Home() {
  return (
    <div className="flex items-center flex-col gap-8">
      <div className="grid gap-4 grid-cols-2 h-64 grid-rows-2 md:grid-cols-4 md:grid-rows-2 max-w-3xl">
        {homeImgLinks.map((imgLink, index) => (
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
            Please also complete our{" "}
            <a
              className="text-blue-600 dark:text-blue-500 hover:underline"
              target="_blank"
              href="https://docs.google.com/forms/d/e/1FAIpQLSceTLRKG5asBOCasC6pw2nqOpgUKjcvFQxpd5juYu70KzphzA/viewform"
            >
              online waiver form
            </a>{" "}
            before arriving for the first time.
          </p>
          <strong className="text-center py-2">
            We hope to see you there!
          </strong>
        </div>
      </div>
    </div>
  );
}
