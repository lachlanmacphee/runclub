import { FAQExampleData } from "@/constants";

export const FAQs = () => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-5xl font-bold">FAQs</h1>
      <div className="flex flex-col gap-4">
        {FAQExampleData.map(({ question, answer }, index) => (
          <div className="flex flex-col gap-2" key={index}>
            <h2 className="text-lg font-semibold">{question}</h2>
            <p>{answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
