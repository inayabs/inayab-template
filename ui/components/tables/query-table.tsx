"use client";

import { useEffect, useState, useMemo } from "react";
import { useQueryState } from "nuqs";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { useDebounce } from "@/hooks/useDebounce";
import { ArrowUp, ArrowDown } from "lucide-react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

const ROWS_PER_PAGE = 10;

interface QueryTableProps {
  fetchUrl: string;
  columns: ColumnDef<any>[];
}

const QueryTable: React.FC<QueryTableProps> = ({ fetchUrl, columns }) => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [sortColumn, setSortColumn] = useState("first_name");
  const [sortOrder, setSortOrder] = useState("asc");

  const [searchTerm, setSearchTerm] = useState(filter);
  const debouncedFilter = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedFilter !== filter) {
      setFilter(debouncedFilter);
      setPage(1); // Reset page after search
    }
  }, [debouncedFilter]);

  const { data, isFetching } = useQuery({
    queryKey: ["users", page, filter, sortColumn, sortOrder],
    queryFn: async () => {
      const response = await axiosInstance.get(fetchUrl, {
        params: {
          page,
          filter,
          limit: ROWS_PER_PAGE,
          sort_by: sortColumn,
          sort_order: sortOrder,
        },
      });
      return response.data;
    },
    keepPreviousData: true,
    enabled: isHydrated,
  });

  const table = useReactTable({
    data: data?.data || [],
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: data?.last_page || 1,
  });

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const totalRows = data?.total || 0;
  const startRow = totalRows === 0 ? 0 : (page - 1) * ROWS_PER_PAGE + 1;
  const endRow = Math.min(page * ROWS_PER_PAGE, totalRows);

  if (!isHydrated) return <Skeleton className="h-20 w-full" />;

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search..."
          className="w-80"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-md border space-y-3">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-left cursor-pointer"
                    onClick={() =>
                      handleSort(header.column.columnDef.accessorKey as string)
                    }
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {sortColumn === header.column.columnDef.accessorKey &&
                      (sortOrder === "asc" ? (
                        <ArrowUp className="inline w-4 h-4 ml-1" />
                      ) : (
                        <ArrowDown className="inline w-4 h-4 ml-1" />
                      ))}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isFetching ? (
              Array.from({ length: ROWS_PER_PAGE }).map((_, rowIdx) => (
                <TableRow key={rowIdx}>
                  {columns.map((_, colIdx) => (
                    <TableCell key={colIdx}>
                      <Skeleton className="h-4 w-[200px]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data?.data.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          Showing {startRow}-{endRow} of {totalRows} row(s).
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {data?.last_page || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setPage((prev) => Math.min(data?.last_page || 1, prev + 1))
            }
            disabled={page >= (data?.last_page || 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QueryTable;
