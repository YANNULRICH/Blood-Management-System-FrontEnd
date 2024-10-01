import * as FRONT from "./commons/urls/front";
import Permissions from "./commons/permissions";
import { TIcons } from "./type/icons-type";

export type MenuItem = {
  id: string;
  text?: string;
  path?: string;
  icon?: TIcons;
  isDisable?: boolean;
  subMenu?: null | Record<string, MenuItem>;
  notification?: boolean | string;
  isMore?: boolean;
  hide?: boolean;
  some?: boolean;
  permissions?: Permissions[];
};

export const mainMenu: Record<"home" | "contactUs", MenuItem> = {
  home: {
    id: "home",
    text: "home",
    path: "/",
    icon: "Home",
    subMenu: null,
  },

  contactUs: {
    id: "contactUs",
    text: "contactUs",
    path: "/contactUs",
    subMenu: null,
    icon: "Mail Outline",
  },
};

export const dashboardMenu: Record<"dashboard", MenuItem> = {
  dashboard: {
    id: "dashboard",
    text: "dashboard",
    path: FRONT.DASHBOARD.INDEX,
    icon: "Dashboard",
    subMenu: null,
  },
};

export const userManagementPages: Record<
    "users" ,
  MenuItem
> = {
  users: {
    id: "security.users.management",
    text: "security.users.management",
    path: FRONT.SECURITY.USERS.INDEX,
    icon: "ListAlt",
    subMenu: null,
    permissions: [Permissions.security.users.view],
  },
};
