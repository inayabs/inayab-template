"use client";

import React from "react";
import { usePathname } from "next/navigation"; // ✅ Get current URL path
import Link from "next/link";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { AppSidebar } from "../app-sidebar";
import { Separator } from "@radix-ui/react-separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { ModeToggle } from "../ui/mode-toggle";
import { House } from "lucide-react";

const LayoutSidebar = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname(); // ✅ Get the current path
  const pathSegments = pathname.split("/").filter((segment) => segment); // Remove empty segments

  // ✅ Convert path segments into readable breadcrumbs
  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/");

    // ✅ Capitalize first letter & replace dashes with spaces
    const label = segment
      .replace(/-/g, " ") // Replace dashes with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter

    return { label, href, isLast: index === pathSegments.length - 1 };
  });

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />

            {/* ✅ Dynamically Generated Breadcrumb */}
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">
                    <House className="w-4 h-4" />
                  </BreadcrumbLink>
                </BreadcrumbItem>

                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={index}>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      {crumb.isLast ? (
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={crumb.href}>
                          {crumb.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Toggle button aligned to the right */}
          <div className="flex-1" />
          <div className="flex items-center gap-4 px-4">
            <ModeToggle />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default LayoutSidebar;
