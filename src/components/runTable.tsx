import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { exampleRunData } from "@/constants";

type RunTableProps = {
  runner?: string;
};

function getRunnerRows(runner: string) {
  const runData = runner
    ? exampleRunData.filter((run) =>
        run.name.toLowerCase().includes(runner.toLowerCase())
      )
    : exampleRunData;

  if (runData.length === 0) {
    return (
      <TableRow>
        <TableCell className="text-center text-xl font-bold" colSpan={4}>
          No results
        </TableCell>
      </TableRow>
    );
  }

  return runData.map((run) => (
    <TableRow key={run.name}>
      <TableCell>{run.rank}</TableCell>
      <TableCell>{run.name}</TableCell>
      <TableCell>{run.distance}</TableCell>
      <TableCell>{run.time}</TableCell>
    </TableRow>
  ));
}

export function RunTable({ runner }: RunTableProps) {
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
      <TableBody>{getRunnerRows(runner ?? "")}</TableBody>
    </Table>
  );
}
