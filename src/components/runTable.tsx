import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Participant } from "@/types";

type RunTableProps = {
  runner?: string;
  participants: Participant[];
};

function getRunnerRows(runner: string, participants: Participant[]) {
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
      <TableCell>{run.time_seconds}</TableCell>
    </TableRow>
  ));
}

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
      <TableBody>{getRunnerRows(runner ?? "", participants)}</TableBody>
    </Table>
  );
}
