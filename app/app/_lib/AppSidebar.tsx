"use client";
import * as React from "react";

import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail
} from "@/components/ui/sidebar";
import { auth } from "@/auth";
import { TeamSwitcher } from "@/components/team-switcher";
import { GalleryVerticalEnd } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { NavMain } from "@/components/nav-main";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const session = useSession();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarFooter>
        <NavUser
          user={{ ...(session.data?.user! as { name: string; email: string }) }}
        />
        <SidebarContent>
          <NavMain
            items={[
              {
                title: "Galeria",
                url: "#",
                icon: GalleryVerticalEnd
              }
            ]}
          />
        </SidebarContent>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
