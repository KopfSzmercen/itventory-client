"use client";

import { type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
};

export function NavMain({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Menu</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item, index) => (
          <Link key={index} href={item.url} passHref>
            <SidebarMenuItem key={index}>
              <SidebarMenuButton
                tooltip={item.title}
                className="cursor-pointer"
                data-active={
                  pathname === item.url ||
                  item.items?.some((subItem) => pathname === subItem.url)
                    ? "true"
                    : "false"
                }
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>

              {item.items?.map((subItem) => (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton asChild>
                    <a href={subItem.url}>
                      <span>{subItem.title}</span>
                    </a>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuItem>
          </Link>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
