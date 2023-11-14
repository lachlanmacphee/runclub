import { formatTime } from "@/lib/utils";
import { Participant } from "@/lib/types";

// Components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function getRunnerRows(participants: Participant[], runner?: string) {
  const runData = runner
    ? participants.filter((run) =>
        run.name.toLowerCase().includes(runner.toLowerCase())
      )
    : participants;

  if (runData.length === 0) {
    return (
      <TableRow>
        <TableCell className="text-center text-xl font-bold" colSpan={4}>
          No results
        </TableCell>
      </TableRow>
    );
  }

  return runData.map((run, idx) => (
    <TableRow key={run.name}>
      <TableCell>{idx + 1}</TableCell>
      <TableCell>{run.name}</TableCell>
      <TableCell>{run.distance}</TableCell>
      <TableCell>
        {run.time_seconds ? formatTime(run.time_seconds) : "N/A"}
      </TableCell>
    </TableRow>
  ));
}

type RunTableProps = {
  runner?: string;
  participants: Participant[];
};

export function RunTable({ runner, participants }: RunTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Position</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Distance</TableHead>
          <TableHead>Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>{getRunnerRows(participants, runner)}</TableBody>
    </Table>
  );
}
