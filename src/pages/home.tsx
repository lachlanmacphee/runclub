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
          <h3 className="text-xl font-bold">New Members</h3>
          <p>
            Please{" "}
            <Link
              to="/waiver"
              className="text-primary underline-offset-4 font-bold hover:underline"
            >
              click here
            </Link>{" "}
            to complete our waiver form. We're required to have these details
            before you can run with us.
          </p>
          <h3 className="text-xl font-bold">Essential Info</h3>
          <p>
            We meet <strong>every Tuesday night</strong> for a run at Albert
            Park Lake over a 3.5km or 5km timed circuit.
          </p>
          <p>
            Join us at <strong>6pm</strong> at the{" "}
            <strong>Limerick Arms Hotel</strong> (364 Clarendon Street, South
            Melbourne) before we head over to the lake. Afterwards, everyone is
            welcome back to the pub for a meal and a free drink - compliments of
            the Limerick Arms.
          </p>
          <p>
            While your first run is on us,
            <strong> each run after costs $5</strong> and helps support the Gunn
            Runners club and the various charities that we donate to throughout
            the year.
          </p>
          <p>
            We prefer payment via bank transfer to minimise cash handling. Thank
            you for your understanding.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <p>
              <strong>Account Name:</strong> Gunn Runners
            </p>
            <p>
              <strong>BSB:</strong> 083-054
            </p>
            <p>
              <strong>Account Number:</strong> 87 284 4868
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
