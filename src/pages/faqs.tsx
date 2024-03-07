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
              src="https://www.youtube.com/embed/OgFjGT0Vn88"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            ></iframe>
            <iframe
              width="315"
              height="560"
              src="https://www.youtube.com/embed/HWIE3ikO4lY"
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
              className="text-primary underline-offset-4 hover:underline"
            >
              Click here
            </a>{" "}
            to download.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold">How do I use this site?</h2>
          <iframe
            height="315"
            src="https://www.youtube.com/embed/YWA0TDDhYjg?si=AQHcemVaAMK3PA76"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
          <iframe
            height="315"
            src="https://www.youtube.com/embed/bEygBdUzRps?si=i7uQSkUlgKMsn-o8"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
          <iframe
            height="315"
            src="https://www.youtube.com/embed/xyIejFjwKgQ?si=hL2-n6qJGV0DZpeh"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
}
