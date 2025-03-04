"use client";

import * as React from "react";
import { LogOut, ShieldCheck } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSidebar } from "./ui/sidebar";

export function NavUserDropdown() {
  const { isMobile } = useSidebar();
  const { data: session } = useSession();
  const user = session?.user || null;

  if (!user) return null; // Don't render if no user is logged in

  const logOut = async () => {
    await signOut();
  };

  return (
    <DropdownMenu>
      {/* ✅ Circular Button for Avatar */}
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="outline" className="rounded-full p-0">
          <Avatar className="h-8 w-8 rounded-full">
            <AvatarImage
              src={user.image ?? undefined}
              alt={`${user.first_name} ${user.last_name}`}
            />
            <AvatarFallback>
              {user.first_name?.charAt(0).toUpperCase()}
              {user.last_name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      {/* ✅ Dropdown Content */}
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side={isMobile ? "bottom" : "bottom"}
        align="end"
        sideOffset={4}
      >
        {/* User Info */}
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage
                src={user.image ?? undefined}
                alt={`${user.first_name} ${user.last_name}`}
              />
              <AvatarFallback className="rounded-lg">
                {user.first_name?.charAt(0).toUpperCase()}
                {user.last_name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">
                {user.first_name} {user.last_name}
              </span>
              <span className="truncate text-xs text-gray-500">
                {user.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Profile/Account */}
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={`/account`} className="flex w-full">
              <ShieldCheck />
              Account
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuItem
          onClick={logOut}
          className="text-red-500 cursor-pointer flex w-full"
        >
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
