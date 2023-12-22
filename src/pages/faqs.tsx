import { FAQData } from "@/lib/constants";

export function FAQs() {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col gap-4 max-w-3xl">
        <h1 className="text-5xl font-bold">Frequently Asked Questions</h1>
        <div className="flex flex-col gap-4">
          {FAQData.map(({ question, answer }, index) => (
            <div className="flex flex-col gap-2" key={index}>
              <h2 className="text-lg font-semibold">{question}</h2>
              <p>{answer}</p>
            </div>
          ))}
        </div>
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
  );
}
