import {
  Ban,
  CircleCheck,
  TestTubeDiagonal,
  UserRoundCog,
  UsersRound,
} from "lucide-react";

export const viewOption = true
export const search ={
  placeholder: "Filter users...",
  column: "fullName",
}

export const filters = [
  {
    column: "status",
    title: "Status",
    options: [
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
    ],
  },
  {
    column: "role",
    title: "Role",
    options: [
      {
        value: "admin",
        label: "Admin",
        icon: UserRoundCog,
      },
      {
        value: "skin_expert",
        label: "Skin Expert",
        icon: TestTubeDiagonal,
      },
      {
        value: "user",
        label: "User",
        icon: UsersRound,
      },
    ],
  },
];

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
];

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
];
