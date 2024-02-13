import { FAQ_DATA } from "@/lib/constants";

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
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">
            Where can I access the results from the previous website?
          </h2>
          <p>
            We provide a zip archive of the previous results from the last Gunn
            Runners website.{" "}
            <a
              href="https://drive.google.com/file/d/1dQltNde2Ewuy3tRZT2C0VifW4zmEgm7a/view?usp=sharing"
              className="text-blue-600 dark:text-blue-500 hover:underline"
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
