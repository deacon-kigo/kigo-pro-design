"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/organisms/Header/Header";
import Sidebar from "@/components/organisms/Sidebar/Sidebar";
import { useAppSelector } from "@/lib/redux/hooks";
import { AIChat } from "@/components/features/ai";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/atoms/Breadcrumb";

interface AppLayoutProps {
  children: ReactNode;
  customBreadcrumb?: ReactNode;
}

export const AppLayout = ({ children, customBreadcrumb }: AppLayoutProps) => {
  const { sidebarCollapsed } = useAppSelector((state) => state.ui);
  const sidebarWidth = sidebarCollapsed ? "70px" : "225px";
  const pathname = usePathname();

  // Add client-side detection to avoid hydration errors
  const [isClient, setIsClient] = useState(false);

  // Ensure CSS variable matches the actual sidebar width
  useEffect(() => {
    document.documentElement.style.setProperty("--sidebar-width", sidebarWidth);
    setIsClient(true);
  }, [sidebarWidth]);

  // Generate breadcrumb items based on current path
  const getBreadcrumbItems = () => {
    if (!pathname) return null;

    // Skip generating breadcrumbs for home page
    if (pathname === "/") return null;

    const pathSegments = pathname.split("/").filter(Boolean);

    if (pathSegments.length === 0) return null;

    return (
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>

          {pathSegments.map((segment, index) => {
            const isLast = index === pathSegments.length - 1;
            const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
            const formattedSegment = segment
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");

            return (
              <React.Fragment key={href}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{formattedSegment}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={href}>
                      {formattedSegment}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    );
  };

  return (
    <div className="flex min-h-screen bg-bg-light">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main
          className="pt-[72px] p-6 min-h-screen overflow-auto transition-all duration-300"
          style={{
            paddingLeft: isClient ? `calc(${sidebarWidth} + 1.5rem)` : "1.5rem",
            width: "100%",
          }}
        >
          <div className="h-full w-full max-w-[1600px] mx-auto pt-4">
            {customBreadcrumb || getBreadcrumbItems()}
            {children}
          </div>
        </main>
      </div>
      <AIChat />
    </div>
  );
};

export default AppLayout;
