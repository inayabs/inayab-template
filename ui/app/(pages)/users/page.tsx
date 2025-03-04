"use client";
import QueryTable from "@/components/tables/query-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPen, UserPlus, Users } from "lucide-react";
import Link from "next/link";
// import { Checkbox } from "@/components/ui/checkbox";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

const Page = () => {
  const userColumns = [
    { accessorKey: "first_name", header: "First Name" },
    { accessorKey: "last_name", header: "Last Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "role", header: "Role" },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }: { row: { original: User } }) => (
        <div>
          <Link href={`/users/${row.original.id}`}>
            <UserPen className="w-4 h-4" />
          </Link>
        </div>
      ),
    },
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
              <Link href={"/users/new"}>
                <Button size="sm">
                  <UserPlus className="w-4 h-4" />
                  <span className="hidden lg:inline">Add User</span>{" "}
                  {/* Hide on small screens */}
                </Button>
              </Link>
              {/* <Button size="sm" variant="secondary">
                <Download className="w-4 h-4" />
                <span className="hidden lg:inline">
                  Download Multiple Accounts
                </span>
              </Button>
              <Button size="sm" variant="outline">
                <FolderSync className="w-4 h-4" />
                <span className="hidden lg:inline">Sync to Nookal</span>
              </Button> */}
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <QueryTable columns={userColumns} fetchUrl="/users" />
        {/* <UserTable
          tableLoading={tableLoading}
          data={userData}
          columns={columns}
        /> */}
      </CardContent>
    </Card>
  );
};

export default Page;
