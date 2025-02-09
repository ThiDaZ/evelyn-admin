import {
  Ban,
    CircleCheck,
    TestTubeDiagonal,
    UserRoundCog,
    UsersRound,
  } from "lucide-react"
  
  export const labels = [
    {
      value: "bug",
      label: "Bug",
    },
    {
      value: "feature",
      label: "Feature",
    },
    {
      value: "documentation",
      label: "Documentation",
    },
  ]
  
  export const statuses = [
    {
      value: "active",
      label: "Active",
      icon: CircleCheck,
    },
    {
      value: "deactivated",
      label: "Deactivated",
      icon: Ban,
    },
  ]
  
  export const roles = [
    {
      label: "Admin",
      value: "admin",
      icon: UserRoundCog,
    },
    {
      label: "Skin Expert",
      value: "skin_expert",
      icon: TestTubeDiagonal,
    },
    {
      label: "User",
      value: "user",
      icon: UsersRound,
    },
  ]