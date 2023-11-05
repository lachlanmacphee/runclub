import { RunTable } from "@/components/runTable";

export const Dashboard = () => {
  return (
    <div>
      <div className="flex justify-between px-4 py-4 items-center">
        <div>
          <h1 className="text-5xl font-bold">Latest Run</h1>
          <p className="py-6">
            On the 7th of November 43 Gunnies hit the track. Congratulations to
            John Doe for coming first in the male 5km with a personal best of
            16:15, and Jane Doe for coming first in the female 5km with a record
            breaking time of 15:37.
          </p>
        </div>
        <img
          src="https://gunnrunners.org.au/wp-content/uploads/2021/02/2021-02-26_12-19-17-700x475.png"
          className="max-w-sm rounded-lg shadow-2xl"
        />
      </div>
      <div className="px-4">
        <RunTable />
      </div>
    </div>
  );
};
