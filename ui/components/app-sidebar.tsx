"use client";

import * as React from "react";
import { HeartHandshake, House, ShieldAlert, Table } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

const data = {
  navMain: [
    { title: "Home", url: "/", icon: House },
    {
      title: "Mental Health Referrals",
      url: "/referrals",
      icon: HeartHandshake,
    },
    {
      title: "Admin",
      url: "#",
      icon: ShieldAlert,
      items: [
        { title: "PMHC MDS Exports", url: "/admin/pmhc" },
        { title: "User Management", url: "/admin/users" },
        { title: "Login Failed", url: "/admin/login-failed" },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
  const user = session?.user || null;
  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* Natural padding and spacing */}
      <SidebarHeader
        className={`flex justify-center ${
          state == "collapsed" ? "items-center" : ""
        } transition-all duration-200 ${
          state === "collapsed" ? "py-2 px-0" : "py-4 px-4"
        }`}
      >
        <Link
          href="/"
          className={`flex ${state === "collapsed" ? "justify-center" : ""} `}
        >
          <Image
            src={
              state === "collapsed"
                ? "/branding/logo.png"
                : "/branding/logo-full.png"
            }
            alt="Company Logo"
            width={state === "collapsed" ? 60 : 180}
            height={60}
            className="cursor-pointer transition-all duration-200"
            priority
          />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
