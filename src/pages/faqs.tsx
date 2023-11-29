import { FAQData } from "@/lib/constants";

export function FAQs() {
  return (
    <div className="flex items-center flex-col">
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
      </div>
    </div>
  );
}
