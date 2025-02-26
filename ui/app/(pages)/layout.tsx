import LayoutSidebar from "@/components/layout/sidebar";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return <LayoutSidebar>{children}</LayoutSidebar>;
};

export default layout;
