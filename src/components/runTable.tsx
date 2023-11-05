import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { exampleRunData } from "@/constants";

export function RunTable() {
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
      <TableBody>
        {exampleRunData.map((run) => (
          <TableRow key={run.name}>
            <TableCell>{run.rank}</TableCell>
            <TableCell>{run.name}</TableCell>
            <TableCell>{run.distance}</TableCell>
            <TableCell>{run.time}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
