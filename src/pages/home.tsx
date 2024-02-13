import { Link } from "react-router-dom";

import image1 from "@/assets/1.jpg";
import image2 from "@/assets/2.png";
import image3 from "@/assets/3.jpg";
import image4 from "@/assets/4.png";
import image5 from "@/assets/5.jpg";
import image6 from "@/assets/6.png";
import image7 from "@/assets/7.png";
import image8 from "@/assets/8.png";
import { Image } from "@/components/home/Image";

export function Home() {
  return (
    <div className="flex items-center flex-col gap-8">
      <div className="grid gap-4 grid-cols-2 h-64 grid-rows-2 md:grid-cols-4 md:grid-rows-2 max-w-3xl">
        <Image src={image1} />
        <Image src={image2} />
        <Image src={image3} />
        <Image src={image4} />
        <Image secondRow src={image5} />
        <Image secondRow src={image6} />
        <Image secondRow src={image7} />
        <Image secondRow src={image8} />
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
            Join us at 6pm at The Limerick Arms Hotel (364 Clarendon Street,
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
            <Link
              to="/waiver"
              className="text-blue-600 dark:text-blue-500 hover:underline"
            >
              waiver form
            </Link>{" "}
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
