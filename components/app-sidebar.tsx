"use client"

import * as React from "react"
import {
  BookOpen,
  GalleryVerticalEnd,
  List,
  Tag,
  Users,
  SquareTerminal,
  PersonStanding,
  MessageSquare,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "admin",
    email: "",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Evelyn",
      logo: GalleryVerticalEnd,
      plan: "Admin",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Product",
      url: "/dashboard/product-list",
      icon: BookOpen,
    },
    {
      title: "Users",
      url: "/dashboard/user-list",
      icon: Users,
    },
    {
      title: "Brands",
      url: "/dashboard/brand-list",
      icon: Tag,
    },
    {
      title: "Categories",
      url: "/dashboard/category-list",
      icon: List,
    },
    {
      title: "Skin Types",
      url: "/dashboard/skinType-list",
      icon: PersonStanding,
    },
  ],
  support: [
    {
      name: "Chat",
      url: "/dashboard/chat",
      icon: MessageSquare,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects supports={data.support} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
