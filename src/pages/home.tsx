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
import { Copy } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

function showCopiedToast() {
  toast({
    title: "Copied to clipboard!",
  });
}

export function Home() {
  return (
    <div className="flex items-center flex-col gap-8">
      <div className="grid gap-4 grid-cols-2 h-64 grid-rows-2 md:grid-cols-4 md:grid-rows-2 max-w-3xl">
        <Image
          alt="An outside view of the Limerick Arms from diagonally across the street. The sky is cloudy but the picture appears well lit. A blurred tram can be seen as it is moving past."
          src={image1}
        />
        <Image
          alt="A group of Gunn Runners under a big yellow Pirelli sign stretching across the top of the road. This photo was taken after a Tuesday Grand Prix run."
          src={image2}
        />
        <Image
          alt="A group of Gunn Runners celebrating under a red arch that has the word 'Finish' across the top of it."
          src={image3}
        />
        <Image
          alt="A group of Gunn Runners celebrating after completing the Sunbury Parkrun."
          src={image4}
        />
        <Image
          secondRow
          alt="A group of Gunn Runners near the lake after a Gunnies christmas run. Some are dressed in santa hats and christmas outfits."
          src={image5}
        />
        <Image
          secondRow
          alt="A group of Gunn Runners together after a Parkrun."
          src={image6}
        />
        <Image
          secondRow
          alt="A group of Gunn Runners together after the King Island Imperial 20. They are all sporting the Gunnies shirt."
          src={image7}
        />
        <Image
          secondRow
          alt="A group of Gunn Runners together after a Brooks sponsored event. It is not clear what the event is."
          src={image8}
        />
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
            before you can run with us. Please note that signing up to the site
            is not the same as filling out the waiver form.
          </p>
          <p>
            If you have any questions, we kindly ask that you please check
            whether they have already been answered on our{" "}
            <a
              href="/faqs"
              className="text-primary font-bold underline-offset-4 hover:underline"
            >
              FAQs page
            </a>{" "}
            first.
          </p>
          <h3 className="text-xl font-bold mt-4">Essential Info</h3>
          <p>
            We meet <strong>every Tuesday night</strong> for a run at Albert
            Park Lake over a 3.5km or 5km timed circuit. We cater for a wide
            range of running abilities and paces with up to 35 minutes to
            complete either course.
          </p>
          <p>
            Join us at <strong>6pm</strong> at the{" "}
            <strong>Limerick Arms Hotel</strong> (364 Clarendon Street, South
            Melbourne) before we head over to the lake. Afterwards, everyone is
            welcome back to the pub for a meal and a free drink - compliments of
            the Limerick Arms.
          </p>
          <p>
            Whilst your first run is on us,
            <strong> each run after costs $5</strong> and helps support the Gunn
            Runners club and the various charities that we donate to throughout
            the year.
          </p>
          <p>
            We take payment exclusively via bank transfer to prevent cash
            handling. Thank you for your understanding.
          </p>
          <div className="flex flex-col gap-2 mb-4">
            <div className="flex items-center gap-2">
              <p>
                <strong>Account Name:</strong> Gunn Runners
              </p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText("Gunn Runners");
                  showCopiedToast();
                }}
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <p>
                <strong>BSB:</strong> 083-054
              </p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText("083054");
                  showCopiedToast();
                }}
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <p>
                <strong>Account Number:</strong> 87 284 4868
              </p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText("872844868");
                  showCopiedToast();
                }}
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
