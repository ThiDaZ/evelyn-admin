"use client"

import {
  Folder,
  Forward,
  MoreHorizontal,
  Trash2,
  type LucideIcon,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavProjects({
  supports,
}: {
  supports: {
    name: string
    url: string
    icon: LucideIcon
    isActive?: boolean;
  }[]
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Support</SidebarGroupLabel>
      <SidebarMenu>
        {  supports.map((item) => (
          <SidebarMenuItem key={item.name} >
          <SidebarMenuButton asChild isActive={item.isActive}>
            <a href={item.url}>
              {item.icon && <item.icon />}
              <span>{item.name}</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
        ))}

      </SidebarMenu>
    </SidebarGroup>
  )
}
