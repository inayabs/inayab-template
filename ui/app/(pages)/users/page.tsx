"use client";

import QueryTable from "@/components/tables/query-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPen, UserPlus, Users, Trash, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { deleteUser } from "@/app/api/userApi";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

const Page = () => {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [refetchUsers, setRefetchUsers] = useState<(() => void) | null>(null);

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;

    setLoading(true);

    try {
      await deleteUser(selectedUser.id); // Call the API

      toast.success("User deleted successfully!");
      setOpen(false);

      if (refetchUsers) refetchUsers();
    } catch (error) {
      let errorMessage = "Failed to delete user.";
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    if (!loading) setOpen(false);
  };

  const userColumns = [
    { accessorKey: "first_name", header: "First Name" },
    { accessorKey: "last_name", header: "Last Name" },
    { accessorKey: "email", header: "Email" },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }: { row: { original: User } }) => (
        <div className="flex space-x-2">
          <Link href={`/users/${row.original.id}`}>
            <UserPen className="w-4 h-4" />
          </Link>
          {row?.original.role !== "Admin" &&
            String(row?.original.id) !== session?.user.id && (
              <button
                onClick={() => handleDelete(row.original)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash className="w-4 h-4" />
              </button>
            )}
        </div>
      ),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          <div className="flex justify-between gap-4">
            <div className="flex items-center gap-x-2">
              <Users className="w-6 h-6" />
              <span>Users</span>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Link href={"/users/new"}>
                <Button size="sm">
                  <UserPlus className="w-4 h-4" />
                  <span className="hidden lg:inline">Add User</span>
                </Button>
              </Link>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <QueryTable
          columns={userColumns}
          fetchUrl="/users"
          refetchTable={setRefetchUsers}
        />
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={open} onOpenChange={handleDialogClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>
                {selectedUser?.first_name} {selectedUser?.last_name}
              </strong>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <Button
              onClick={confirmDelete}
              className="bg-red-500 text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  <span>Deleting...</span>
                </>
              ) : (
                "Yes, Delete"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default Page;
