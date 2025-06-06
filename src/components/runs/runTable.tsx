import { ColumnDef } from "@tanstack/react-table";

import { formatTime } from "@/lib/utils";
import { Participant } from "@/lib/types";

import { Button } from "@/components/ui/button";

import { ArrowUpDown } from "lucide-react";
import { DataTable } from "../ui/data-table";
import { format } from "date-fns";

const standardRunTableColumns: ColumnDef<Participant>[] = [
  {
    accessorKey: "position",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          #
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "bib",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Bib
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) =>
      row.original.is_new ? (
        <span className="underline underline-offset-4 decoration-red-600 dark:decoration-red-800 decoration-2">
          {row.getValue("name")}
        </span>
      ) : (
        row.getValue("name")
      ),
  },
  {
    accessorKey: "distance",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Distance
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => `${row.getValue("distance")}km`,
  },
  {
    accessorKey: "time_seconds",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => formatTime(row.getValue("time_seconds")),
  },
];

const statsRunTableColumns: ColumnDef<Participant>[] = [
  {
    accessorKey: "time_seconds",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => formatTime(row.getValue("time_seconds")),
  },
  {
    accessorKey: "created",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => format(new Date(row.getValue("created")), "dd/MM/yy"),
  },
];

const clubStatsRunTableColumns: ColumnDef<Participant>[] = [
  {
    accessorKey: "position",
    header: ({ column }) => {
      return (
        <Button
          aria-label="Position"
          variant="ghost"
          className="px-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          #
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "time_seconds",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => formatTime(row.getValue("time_seconds")),
  },
  {
    accessorKey: "created",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => format(new Date(row.getValue("created")), "dd/MM/yy"),
  },
];

function convertColumnTypeToColumns(type: "standard" | "stats" | "clubStats") {
  if (type == "standard") return standardRunTableColumns;
  if (type == "stats") return statsRunTableColumns;
  if (type == "clubStats") return clubStatsRunTableColumns;
  return standardRunTableColumns;
}

export const RunTable = ({
  participants,
  columnsType = "standard",
}: {
  participants: Participant[];
  columnsType?: "standard" | "stats" | "clubStats";
}) => (
  <DataTable
    columns={convertColumnTypeToColumns(columnsType)}
    data={participants}
    defaultVisibilityState={
      columnsType == "standard" ? { bib: false, distance: false } : undefined
    }
    showNameFilterColumnSelection={columnsType != "stats"}
  />
);
