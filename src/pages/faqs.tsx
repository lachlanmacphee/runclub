import { FAQ_DATA, PAST_RESULTS_DOWNLOAD_LINK } from "@/lib/constants";

export function FAQs() {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col gap-4 grow max-w-3xl">
        <h1 className="text-5xl font-bold">Frequently Asked Questions</h1>
        <div className="flex flex-col gap-4">
          {FAQ_DATA.map(({ question, answer }, index) => (
            <div className="flex flex-col gap-2" key={index}>
              <h2 className="text-lg font-semibold">{question}</h2>
              <p>{answer}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">
            What are the routes for the run?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            <iframe
              width="315"
              height="560"
              src="https://www.youtube.com/embed/ZcQ2tR63tvw"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            ></iframe>
            <iframe
              width="315"
              height="560"
              src="https://www.youtube.com/embed/37ODnWmFLH0"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            ></iframe>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">
            Where can I access the results from the previous website?
          </h2>
          <p>
            We provide a zip archive of the previous results from the last Gunn
            Runners website.{" "}
            <a
              href={PAST_RESULTS_DOWNLOAD_LINK}
              className="text-blue-600 dark:text-blue-500 hover:underline"
            >
              Click here
            </a>{" "}
            to download.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold">How do I use this site?</h2>
          <p>
            These videos are now outdated, but give a somewhat general idea of
            the key functionality. New videos will be coming sometime in
            February.
          </p>
          <iframe
            height="315"
            src="https://www.youtube.com/embed/AnM3uq0jtWY?si=5F86eFHo3f-_PiJL"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
          <iframe
            height="315"
            src="https://www.youtube.com/embed/_u9m-tyygD0?si=_7fhsYgvdMV6RIDZ"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
          <iframe
            height="315"
            src="https://www.youtube.com/embed/EAGqJjKvuq4?si=YR3UG8CBof3-znRg"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
}
