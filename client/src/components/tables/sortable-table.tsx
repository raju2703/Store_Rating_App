import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type SortDirection = "asc" | "desc" | null;

type ColumnDefinition<T> = {
  header: string;
  accessorKey: keyof T;
  cell?: (item: T) => React.ReactNode;
  isSortable?: boolean;
};

interface SortableTableProps<T> {
  data: T[];
  columns: ColumnDefinition<T>[];
  onRowClick?: (item: T) => void;
}

export function SortableTable<T>({
  data,
  columns,
  onRowClick,
}: SortableTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (column: keyof T) => {
    if (sortColumn === column) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortDirection(null);
        setSortColumn(null);
      } else {
        setSortDirection("asc");
      }
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortColumn || sortDirection === null) {
      return 0;
    }

    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (aValue === bValue) {
      return 0;
    }

    if (aValue === null || aValue === undefined) {
      return sortDirection === "asc" ? -1 : 1;
    }

    if (bValue === null || bValue === undefined) {
      return sortDirection === "asc" ? 1 : -1;
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (aValue < bValue) {
      return sortDirection === "asc" ? -1 : 1;
    }
    
    return sortDirection === "asc" ? 1 : -1;
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead
                key={index}
                className={cn(
                  column.isSortable && "cursor-pointer hover:bg-gray-50",
                )}
                onClick={() => {
                  if (column.isSortable) {
                    handleSort(column.accessorKey);
                  }
                }}
              >
                <div className="flex items-center">
                  {column.header}
                  {column.isSortable && (
                    <span className="ml-2">
                      {sortColumn === column.accessorKey ? (
                        sortDirection === "asc" ? (
                          <ArrowUp className="h-4 w-4" />
                        ) : (
                          <ArrowDown className="h-4 w-4" />
                        )
                      ) : (
                        <ArrowUpDown className="h-4 w-4" />
                      )}
                    </span>
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          ) : (
            sortedData.map((item, index) => (
              <TableRow
                key={index}
                className={onRowClick ? "cursor-pointer hover:bg-gray-50" : ""}
                onClick={() => onRowClick && onRowClick(item)}
              >
                {columns.map((column, columnIndex) => (
                  <TableCell key={columnIndex}>
                    {column.cell
                      ? column.cell(item)
                      : item[column.accessorKey] as React.ReactNode}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
