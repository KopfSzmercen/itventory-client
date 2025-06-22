"use client";
import * as React from "react";

import { NavItem, NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail
} from "@/components/ui/sidebar";
import {
  Binary,
  Building,
  Computer,
  Home,
  IdCardLanyard,
  User
} from "lucide-react";
import { useSession } from "next-auth/react";

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/app",
    icon: Home
  },
  {
    title: "Biura",
    url: "/app/offices",
    icon: Building
  },
  {
    title: "Oddziały",
    url: "/app/departments",
    icon: Building
  },
  {
    title: "Użytkownicy",
    url: "/app/users",
    icon: User
  },
  {
    title: "Pracownicy",
    url: "/app/employees",
    icon: IdCardLanyard
  },
  {
    title: "Sprzęt",
    url: "/app/hardware",
    icon: Computer
  },
  {
    title: "Oprogramowanie",
    url: "/app/software",
    icon: Binary
  }
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const session = useSession();
  return (
    <Sidebar collapsible="icon" {...props}>
      <NavUser
        user={{ ...(session.data?.user as { name: string; email: string }) }}
      />
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>

      <SidebarFooter>
        <ThemeToggle />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
