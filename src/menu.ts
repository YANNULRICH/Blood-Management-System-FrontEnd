import * as FRONT from "./commons/urls/front";
import Permissions from "./commons/permissions";
import { TIcons } from "./type/icons-type";

import {BLOOD_BAD} from "./views/blood/bloodBag/url/front";
import {DONOR} from "./views/donor/donor/url/front";
import {BLOOD_DONATION} from "./views/blood/bloodDonation/url/front";
import {CAMPAIGN} from "./views/referentiel/campaign/url/front";
import { BLOOD_TYPE } from "./views/blood/bloodType/url/front";
import { BLOOD_BANK } from "./views/blood/bloodBank/url/front";
import { HOSPITAL } from "./views/hospital/url/front";
import { ORDER_BLOOD } from "./views/bigPharmOrder/url/front";
import { APP_USER } from "./views/appUser/url/front";

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

export const userManagementPages: Record<"users", MenuItem> = {
  users: {
    id: "security.users.management",
    text: "security.users.management",
    path: FRONT.SECURITY.USERS.INDEX,
    icon: "ListAlt",
    subMenu: null,
    permissions: [Permissions.security.users.view],
  },
};

export const campaignManagementPages: Record<
    "campaign" ,
    MenuItem
    > = {
  campaign: {
    id: "campaign.management",
    text: "campaign.management",
    path: CAMPAIGN.INDEX,
    icon: "Campaign",
    subMenu: null,
    permissions: [Permissions.security.users.view],
  },
};

export const bloodmanagement: Record<
      "blood",
    MenuItem
    > = {

  blood: {
    id: "blood.management",
    text: "blood.management",
    path: BLOOD_TYPE.INDEX,
    icon: "Group",
    subMenu: {
      bloodType: {
        id: "bloodType.management",
        text: "bloodType.management",
        path: BLOOD_TYPE.INDEX,
        icon: "Bloodtype",
        subMenu: null,
        //permissions: [Permissions.articles.barbi],
      },
      bloodBank: {
        id: "bloodBank.management",
        text: "bloodBank.management",
        path: BLOOD_BANK.INDEX,
        icon: "FoodBank",
        subMenu: null,
        //permissions: [Permissions.articles.barbi],
      },
      bloodBag: {
        id: "bloodBag.management",
        text: "bloodBag.management",
        path: BLOOD_BAD.INDEX,
        icon: "Badge",
        subMenu: null,
        //permissions: [Permissions.articles.barbi],
      },
      bloodDonation: {
        id: "bloodDonnation.management",
        text: "bloodDonation.management",
        path: BLOOD_DONATION.INDEX,
        icon: "Gif",
        subMenu: null,
        //permissions: [Permissions.articles.barbi],
      }
    },
    //permissions: [Permissions.documentCategory.view],
  },
};

export const donormanagement: Record<
    "donor",
    MenuItem
    > = {

  donor: {
    id: "donor.management",
    text: "donor.management",
    path: DONOR.INDEX,
    icon: "Gite",
    subMenu: null
    //permissions: [Permissions.documentCategory.view],
  },

};

export const hospitalmanagement: Record<"hospital", MenuItem> = {
  hospital: {
    id: "hospital.management",
    text: "hospital.management",
    path: HOSPITAL.INDEX,
    icon: "Group",
    subMenu: {
      hospitalBank: {
        id: "hospitalBank.management",
        text: "hospitalBank.management",
        path: HOSPITAL.INDEX,
        icon: "FoodBank",
        subMenu: null,
        //permissions: [Permissions.articles.barbi],
      },
    },
    //permissions: [Permissions.documentCategory.view],
  },
};

export const OrderBlood: Record<"gestOrder", MenuItem> = {
  gestOrder: {
    id: "id.blood.order",
    text: "order.management.title",
    path: ORDER_BLOOD.INDEX,
    icon: "Medication",
    subMenu: {
      hospitalBank: {
        id: "blood.Order.title",
        text: "blood.order",
        path: ORDER_BLOOD.INDEX,
        icon: "FoodBank",
        subMenu: null,
        //permissions: [Permissions.articles.barbi],
      },
    }, //permissions: [Permissions.pharmOrder.view],
  },
};

export const appUsermanagement: Record<"appUser", MenuItem> = {
  appUser: {
    id: "appUser.management",
    text: "appUser.management",
    path: APP_USER.INDEX,
    icon: "Group",
    subMenu: {
      hospitalBank: {
        id: "appUserBank.management",
        text: "appUserBank.management",
        path: APP_USER.INDEX,
        icon: "FoodBank",
        subMenu: null,
        //permissions: [Permissions.articles.barbi],
      },
    },
    //permissions: [Permissions.documentCategory.view],
  },
};
