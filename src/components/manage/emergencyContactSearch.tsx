import { useCallback, useEffect, useState } from "react";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Waiver } from "@/lib/types";
import { usePocket } from "@/contexts";
import { Loader2 } from "lucide-react";

export function EmergencyContactSearch() {
  const { pb } = usePocket();
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState("");
  const [results, setResults] = useState<Waiver[]>([]);

  useEffect(() => {
    async function fetchWaivers() {
      setIsLoading(true);
      const res = (await pb.collection("waivers").getFullList()) as Waiver[];
      setResults(res);
      setIsLoading(false);
    }
    fetchWaivers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getResults = useCallback(() => {
    if (name == "") {
      return (
        <TableRow>
          <TableCell colSpan={3} className="text-center">
            Please enter a name first.
          </TableCell>
        </TableRow>
      );
    }

    const searchResults = results.filter((waiver) => {
      const joinedName = waiver.fname + " " + waiver.lname;
      return joinedName.toLowerCase().includes(name.toLowerCase());
    });

    if (searchResults.length == 0) {
      return (
        <TableRow>
          <TableCell colSpan={3} className="text-center">
            No results...
          </TableCell>
        </TableRow>
      );
    }

    return searchResults.map((waiver, idx) => (
      <TableRow key={idx}>
        <TableCell>{waiver.fname + " " + waiver.lname}</TableCell>
        <TableCell>{waiver.emergencyContactName}</TableCell>
        <TableCell>{waiver.emergencyContactPhone}</TableCell>
      </TableRow>
    ));
  }, [name, results]);

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-bold text-2xl">Emergency Contact Search</h2>
      <Input
        placeholder="Search names..."
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Participant Name</TableHead>
            <TableHead>Contact Name</TableHead>
            <TableHead>Contact Phone</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{getResults()}</TableBody>
      </Table>
    </div>
  );
}
