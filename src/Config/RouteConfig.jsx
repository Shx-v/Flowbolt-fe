import DashboardIcon from "@mui/icons-material/Dashboard";
import WidgetsIcon from "@mui/icons-material/Widgets";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import GroupIcon from "@mui/icons-material/Group";
import GroupsIcon from "@mui/icons-material/Groups";
import { useAuth } from "../Context/AuthContext";

export const useRoutes = () => {
  const { userDetails } = useAuth();
  const isAdmin =
    userDetails?.permissions?.some((p) => p.key === "ADMIN_ACCESS") ||
    userDetails?.role?.permissions?.some((p) => p.key === "ADMIN_ACCESS");

  const adminOnly = [
    {
      title: "Roles",
      path: "/role",
      icon: <ManageAccountsIcon />,
    },
    {
      title: "Users",
      path: "/user",
      icon: <GroupIcon />,
    },
  ];

  const common = [
    {
      title: "Groups",
      path: "/group",
      icon: <GroupsIcon />,
    },
    {
      title: "Projects",
      path: "/project",
      icon: <WidgetsIcon />,
    },
    {
      title: "Tickets",
      path: "/ticket",
      icon: <FormatListBulletedIcon />,
    },
  ];

  if (isAdmin)
    return [
      {
        title: "Dashboard",
        path: "/dashboard",
        icon: <DashboardIcon />,
      },
      ...adminOnly,
      ...common,
    ];

  return common;
};
