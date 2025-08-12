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
    <div>
      {/* Hero Section with Images and Text Overlay */}
      <section className="relative md:bg-gradient-to-b md:from-background md:to-muted/30 overflow-hidden pt-10">
        {/* Background Images Grid */}
        <div className="absolute inset-0 opacity-60 dark:opacity-50">
          {/* Desktop: Grid Layout */}
          <div className="hidden md:grid gap-4 grid-cols-4 h-full grid-rows-2 max-w-6xl mx-auto p-4">
            <Image
              alt="A group of Gunn Runners under a big yellow Pirelli sign stretching across the top of the road. This photo was taken after a Tuesday Grand Prix run."
              src={image2}
            />
            <Image
              alt="An outside view of the Limerick Arms from diagonally across the street. The sky is cloudy but the picture appears well lit. A blurred tram can be seen as it is moving past."
              src={image1}
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
        </div>

        {/* Gradient Overlay - Only for desktop with images */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background hidden md:block"></div>

        {/* Hero Content */}
        <div className="relative z-10 flex items-center justify-center px-4 text-center max-w-5xl mx-auto space-y-6">
          <div>
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-red-600 via-red-500 to-orange-500 bg-clip-text text-transparent drop-shadow-2xl">
              Welcome to
            </h1>
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-slate-700 via-slate-600 to-slate-800 dark:from-slate-400 dark:to-slate-500 bg-clip-text text-transparent drop-shadow-2xl">
              Gunn Runners
            </h1>
            <h2 className="text-2xl md:text-4xl font-light text-foreground/90 drop-shadow-lg pt-4">
              Melbourne's Most Social Running Group
            </h2>
            {/* Call to Action */}
            <div className="flex gap-4 justify-center items-center pt-8">
              <Link
                to="/waiver"
                className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Complete Waiver
              </Link>
              <a
                href="/faqs"
                className="px-8 py-4 bg-slate-700 hover:bg-slate-800 text-white font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Information Sections */}
      <div className="space-y-10 py-20 bg-gradient-to-b from-background to-muted/20">
        {/* New Members Section */}
        <section className="container mx-auto px-8 md:px-12 max-w-5xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-2 w-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
            <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              New Members
            </h3>
          </div>
          <div className="space-y-6 text-card-foreground/90 leading-relaxed text-lg">
            <p className="text-xl leading-relaxed">
              Please{" "}
              <Link
                to="/waiver"
                className="text-red-600 dark:text-red-400 underline-offset-4 font-bold hover:underline transition-all duration-300 hover:scale-105 inline-block"
              >
                click here
              </Link>{" "}
              to complete our waiver form. We're required to have these details
              before you can run with us. Please note that signing up to the
              site is not the same as filling out the waiver form.
            </p>
            <p className="text-xl leading-relaxed">
              If you have any questions, we kindly ask that you please check
              whether they have already been answered on our{" "}
              <a
                href="/faqs"
                className="text-slate-700 dark:text-slate-400 font-bold underline-offset-4 hover:underline transition-all duration-300 hover:scale-105 inline-block"
              >
                FAQs page
              </a>{" "}
              first.
            </p>
          </div>
        </section>

        {/* Essential Info Section */}
        <section className="container mx-auto px-8 md:px-12 max-w-5xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-2 w-16 bg-gradient-to-r from-slate-600 to-slate-800 dark:from-slate-400 dark:to-slate-500 rounded-full"></div>
            <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-700 to-slate-800 dark:from-slate-400 dark:to-slate-500 bg-clip-text text-transparent">
              Essential Info
            </h3>
          </div>
          <div className="space-y-6 text-card-foreground/90 leading-relaxed text-lg">
            <p className="text-xl leading-relaxed">
              We meet{" "}
              <span className="text-red-600 dark:text-red-400 font-bold">
                every Tuesday night
              </span>{" "}
              for a run at Albert Park Lake over a 3.5km or 5km timed circuit.
              We cater for a wide range of running abilities and paces with up
              to 35 minutes to complete either course.
            </p>
            <p className="text-xl leading-relaxed">
              Join us at{" "}
              <span className="text-red-600 dark:text-red-400 font-bold">
                6pm
              </span>{" "}
              at the{" "}
              <span className="text-red-600 dark:text-red-400 font-bold">
                Limerick Arms Hotel
              </span>{" "}
              (364 Clarendon Street, South Melbourne) before we head over to the
              lake. Afterwards, everyone is welcome back to the pub for a meal
              and a free drink - compliments of the Limerick Arms.
            </p>
            <p className="text-xl leading-relaxed">
              Whilst your first run is on us,
              <span className="text-red-600 dark:text-red-400 font-bold">
                {" "}
                each run after costs $5
              </span>{" "}
              and helps support the Gunn Runners club and the various charities
              that we donate to throughout the year.
            </p>
            <p className="text-xl leading-relaxed text-red-600 dark:text-red-400">
              We take payment exclusively via bank transfer to prevent cash
              handling. Thank you for your understanding.
            </p>
          </div>
        </section>

        {/* Payment Details Section */}
        <section className="container mx-auto px-8 md:px-12 max-w-5xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-2 w-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
            <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Payment Details
            </h3>
          </div>
          <div className="grid gap-6">
            <div className="group/item flex items-center justify-between p-6 bg-white dark:bg-black/20 border-2 border-green-200 dark:border-green-800 rounded-2xl hover:shadow-xl hover:border-green-400 dark:hover:border-green-600 transition-all duration-300 transform hover:scale-[1.02]">
              <div className="space-y-1">
                <span className="text-sm font-medium text-green-600 dark:text-green-400 uppercase tracking-wide">
                  Account Name
                </span>
                <p className="font-bold text-2xl text-green-900 dark:text-green-100">
                  Gunn Runners
                </p>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText("Gunn Runners");
                  showCopiedToast();
                }}
                className="p-3 bg-green-100 dark:bg-green-900 hover:bg-green-200 dark:hover:bg-green-800 rounded-xl transition-all duration-300 transform hover:scale-110 group-hover/item:animate-pulse"
                aria-label="Copy account name"
              >
                <Copy className="w-6 h-6 text-green-600 dark:text-green-400" />
              </button>
            </div>
            <div className="group/item flex items-center justify-between p-6 bg-white dark:bg-black/20 border-2 border-green-200 dark:border-green-800 rounded-2xl hover:shadow-xl hover:border-green-400 dark:hover:border-green-600 transition-all duration-300 transform hover:scale-[1.02]">
              <div className="space-y-1">
                <span className="text-sm font-medium text-green-600 dark:text-green-400 uppercase tracking-wide">
                  BSB
                </span>
                <p className="font-bold text-2xl text-green-900 dark:text-green-100 font-mono">
                  083-054
                </p>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText("083054");
                  showCopiedToast();
                }}
                className="p-3 bg-green-100 dark:bg-green-900 hover:bg-green-200 dark:hover:bg-green-800 rounded-xl transition-all duration-300 transform hover:scale-110 group-hover/item:animate-pulse"
                aria-label="Copy BSB"
              >
                <Copy className="w-6 h-6 text-green-600 dark:text-green-400" />
              </button>
            </div>
            <div className="group/item flex items-center justify-between p-6 bg-white dark:bg-black/20 border-2 border-green-200 dark:border-green-800 rounded-2xl hover:shadow-xl hover:border-green-400 dark:hover:border-green-600 transition-all duration-300 transform hover:scale-[1.02]">
              <div className="space-y-1">
                <span className="text-sm font-medium text-green-600 dark:text-green-400 uppercase tracking-wide">
                  Account Number
                </span>
                <p className="font-bold text-2xl text-green-900 dark:text-green-100 font-mono">
                  87 284 4868
                </p>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText("872844868");
                  showCopiedToast();
                }}
                className="p-3 bg-green-100 dark:bg-green-900 hover:bg-green-200 dark:hover:bg-green-800 rounded-xl transition-all duration-300 transform hover:scale-110 group-hover/item:animate-pulse"
                aria-label="Copy account number"
              >
                <Copy className="w-6 h-6 text-green-600 dark:text-green-400" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
