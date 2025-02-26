"use client";
import { getUsers } from "@/app/api/userApi";
import UserTable from "@/components/tables/user-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ColumnDef } from "@tanstack/react-table";
import { Download, FolderSync, UserPen, UserPlus, Users } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
// import { Checkbox } from "@/components/ui/checkbox";

const Page = () => {
  const [tableLoading, setTableLoading] = useState(true);
  const searchParams = useSearchParams();
  const [userData, setUserData] = useState([]);
  const search = searchParams.get("search");

  const fetchUsers = async () => {
    try {
      const response = await getUsers();

      // console.log(response.data);
      setUserData(response.data.data);
      setTableLoading(false);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    console.log("userData", userData);
  }, [userData]);

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "first_name",
      header: "First name",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("first_name")}</div>
      ),
    },
    {
      accessorKey: "last_name",
      header: "Last name",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("last_name")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("role")}</div>
      ),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div>
          <Link href={`/admin/users/${row.original.id}`}>
            <UserPen className="w-4 h-4" />
          </Link>
        </div>
      ),
    },
    // {
    //   accessorKey: "email",
    //   header: ({ column }) => {
    //     return (
    //       <Button
    //         variant="ghost"
    //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //       >
    //         Email
    //         <ArrowUpDown />
    //       </Button>
    //     );
    //   },
    //   cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
    // },
    // {
    //   accessorKey: "amount",
    //   header: () => <div className="text-right">Amount</div>,
    //   cell: ({ row }) => {
    //     const amount = parseFloat(row.getValue("amount"));

    //     // Format the amount as a dollar amount
    //     const formatted = new Intl.NumberFormat("en-US", {
    //       style: "currency",
    //       currency: "USD",
    //     }).format(amount);

    //     return <div className="text-right font-medium">{formatted}</div>;
    //   },
    // },
    // {
    //   id: "actions",
    //   enableHiding: false,
    //   cell: ({ row }) => {
    //     const payment = row.original;

    //     return (
    //       <DropdownMenu>
    //         <DropdownMenuTrigger asChild>
    //           <Button variant="ghost" className="h-8 w-8 p-0">
    //             <span className="sr-only">Open menu</span>
    //             <MoreHorizontal />
    //           </Button>
    //         </DropdownMenuTrigger>
    //         <DropdownMenuContent align="end">
    //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
    //           <DropdownMenuItem
    //             onClick={() => navigator.clipboard.writeText(payment.id)}
    //           >
    //             Copy payment ID
    //           </DropdownMenuItem>
    //           <DropdownMenuSeparator />
    //           <DropdownMenuItem>View customer</DropdownMenuItem>
    //           <DropdownMenuItem>View payment details</DropdownMenuItem>
    //         </DropdownMenuContent>
    //       </DropdownMenu>
    //     );
    //   },
    // },
  ];

  return (
    <Card>
      {" "}
      {/* Prevents overflow */}
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          <div className="flex justify-between gap-4">
            {/* Left Side: Users Title */}
            <div className="flex items-center gap-x-2">
              <Users className="w-6 h-6" />
              <span>Users</span>
            </div>

            {/* Right Side: Buttons (Responsive) */}
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Link href={"/admin/users/new"}>
                <Button size="sm">
                  <UserPlus className="w-4 h-4" />
                  <span className="hidden lg:inline">Add User</span>{" "}
                  {/* Hide on small screens */}
                </Button>
              </Link>
              <Button size="sm" variant="secondary">
                <Download className="w-4 h-4" />
                <span className="hidden lg:inline">
                  Download Multiple Accounts
                </span>
              </Button>
              <Button size="sm" variant="outline">
                <FolderSync className="w-4 h-4" />
                <span className="hidden lg:inline">Sync to Nookal</span>
              </Button>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <UserTable
          tableLoading={tableLoading}
          data={userData}
          columns={columns}
        />
      </CardContent>
    </Card>
  );
};

export default Page;
