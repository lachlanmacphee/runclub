const imgLink =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIFgkSBzroUNOLPSqLq8KZQSgCjt1SKWnBh6M_2NPku5sIhZojaPVDSKkYXXcwrOhBgV8&usqp=CAU";

export const Home = () => {
  return (
    <div className="flex items-center flex-col gap-8 p-8">
      <div className="grid gap-4 grid-cols-2 h-64 grid-rows-2 md:grid-cols-4 md:grid-rows-2 max-w-3xl">
        <div className="flex justify-center">
          <img className="rounded-lg aspect-video" src={imgLink} />
        </div>
        <div className="flex justify-center">
          <img className="rounded-lg aspect-video" src={imgLink} />
        </div>
        <div className="flex justify-center">
          <img className="rounded-lg aspect-video" src={imgLink} />
        </div>
        <div className="flex justify-center">
          <img className="rounded-lg aspect-video" src={imgLink} />
        </div>
        <div className="hidden md:flex justify-center">
          <img className="rounded-lg aspect-video" src={imgLink} />
        </div>
        <div className="hidden md:flex justify-center">
          <img className="rounded-lg aspect-video" src={imgLink} />
        </div>
        <div className="hidden md:flex justify-center">
          <img className="rounded-lg aspect-video" src={imgLink} />
        </div>
        <div className="hidden md:flex justify-center">
          <img className="rounded-lg aspect-video" src={imgLink} />
        </div>
      </div>
      <div className="flex flex-col items-center gap-6 max-w-3xl">
        <div className="flex flex-col gap-2 items-center">
          <h1 className="text-4xl font-extrabold">Welcome to Gunn Runners</h1>
          <h2 className="text-xl font-light">
            Melbourne's Most Social Running Group
          </h2>
        </div>
        <div className="flex flex-col gap-4">
          <h2>
            We meet every Tuesday night for a run at Albert Park Lake, over a
            3.5km or 5km timed circuit.
          </h2>
          <p>
            Join us at 6:15pm at The Limerick Arms Hotel (364 Clarendon Street,
            South Melbourne) before we head over to the lake. Afterwards,
            everyone is welcome back to the pub for a meal and a free drink -
            compliments of the Limerick Arms.
          </p>
          <p>
            While your first run is on us, each time after that will be a $5 fee
            to help support the Gunn Runners club and the various charities that
            we donate to throughout the year. This can be paid in cash or
            preferably by bank transfer. Please also complete our online waiver
            form before arriving for the first time.
          </p>
          <p>
            You can pay with cash or preferably by bank transfer which helps us
            to minimise cash handling: Account name: Gunn Runners BSB: 083-054
            Account number: 87 284 4868
          </p>
          <strong className="text-center py-2">
            We hope to see you there!
          </strong>
        </div>
      </div>
    </div>
  );
};
