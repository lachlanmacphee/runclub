import { RunTable } from "@/components/runTable";

export const LatestRun = () => {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-5xl font-bold">Latest Run</h1>
        <p className="py-6">
          On the 7th of November 43 Gunnies hit the track. Congratulations to
          John Doe for coming first in the male 5km with a personal best of
          16:15, and Jane Doe for coming first in the female 5km with a record
          breaking time of 15:37.
        </p>
      </div>
      <RunTable />
    </div>
  );
};
