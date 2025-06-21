"use client";
import * as React from "react";

import { NavItem, NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail
} from "@/components/ui/sidebar";
import {
  Building,
  Computer,
  Home,
  IdCardIcon,
  IdCardLanyard,
  User
} from "lucide-react";
import { useSession } from "next-auth/react";
import { ThemeToggle } from "@/components/theme/theme-toggle";

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
  }
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const session = useSession();
  return (
    <Sidebar collapsible="icon" {...props}>
      <NavUser
        user={{ ...(session.data?.user! as { name: string; email: string }) }}
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
