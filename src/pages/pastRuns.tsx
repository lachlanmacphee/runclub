import { RunTable } from "@/components/runTable";

export function PastRuns() {
  return (
    <div className="flex flex-col px-4 gap-4">
      <div className="flex justify-between">
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Date</span>
          </label>
          <input
            type="text"
            placeholder="DD/MM/YYYY"
            className="input input-bordered w-full max-w-xs"
          />
        </div>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Runner</span>
          </label>
          <input
            type="text"
            placeholder="Name here"
            className="input input-bordered w-full max-w-xs"
          />
        </div>
      </div>
      <div className="flex flex-col items-center">
        <h1 className="text-xl font-bold">7th of November, 2023</h1>
        <h2>Albert Park Lake</h2>
      </div>
      <RunTable />
    </div>
  );
}
