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
  "title" | "users"  | "visibilityGroups" | "permissions"| "group" ,
  MenuItem
> = {
  title: {
    id: "security.users.management.title",
    text: "security.users.management",
    icon: "Extension",
    some: true,
    permissions: [
      Permissions.security.roles.view,
      Permissions.security.users.view,
      Permissions.security.permissions.view,
      Permissions.security.visibilityGroups.view,
    ],
  },
  users: {
    id: "security.users.management",
    text: "security.users.management",
    path: FRONT.SECURITY.USERS.INDEX,
    icon: "ListAlt",
    subMenu: null,
    permissions: [Permissions.security.users.view],
  },
  // addUsers: {
  //   id: "security.users.management.add",
  //   text: "security.users.management.add",
  //   path: FRONT.SECURITY.USERS.ADD,
  //   icon: "PersonAddAlt1",
  //   subMenu: null,
  //   permissions: [Permissions.security.users.add],
  // },
  visibilityGroups: {
    id: "security.groups.visibility",
    text: "security.groups.visibility",
    path: FRONT.SECURITY.VISIBILITY_GROUPS.INDEX,
    icon: "Groups",
    subMenu: null,
    permissions: [Permissions.security.visibilityGroups.view],
  },
  group: {
    id: "security.roles",
    text: "security.roles",
    path: FRONT.SECURITY.ROLES.INDEX,
    icon: "Shield",
    subMenu: null,
    permissions: [Permissions.security.roles.view],
  },
  permissions: {
    id: "security.permissions",
    text: "security.permissions",
    path: FRONT.SECURITY.PERMISSIONS.INDEX,
    icon: "Lock",
    subMenu: null,
    permissions: [Permissions.security.permissions.view],
  },
};
