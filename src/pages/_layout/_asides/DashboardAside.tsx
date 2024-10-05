import React, { useContext } from "react";
import Brand from "../../../layout/Brand/Brand";
import ThemeContext from "../../../contexts/themeContext";

import Aside, { AsideBody, AsideHead } from "../../../layout/Aside/Aside";
import Navigation, {
  NavigationLine,
} from "../../../layout/Navigation/Navigation";
import { AbilityContext } from "../../../commons/permissions/Can";
import Permissions from "../../../commons/permissions";

import {
  bloodmanagement,
  hospitalmanagement,
  OrderBlood,
  appUsermanagement,
  campaignManagementPages,
  donormanagement,
  userManagementPages,
} from "../../../menu";

const DashboardAside = () => {
  const { asideStatus, setAsideStatus } = useContext(ThemeContext);
  const ability = useContext(AbilityContext);

  return (
    <Aside>
      <AsideHead>
        <Brand asideStatus={asideStatus} setAsideStatus={setAsideStatus} />
      </AsideHead>
      <AsideBody>
        {/*<Navigation menu={{ dashboard: dashboardMenu.dashboard }} id='aside-dashboard' />*/}
        {/*<NavigationLine />*/}
        <Navigation menu={userManagementPages} id="aside-users.management" />
        {ability.can(Permissions.security.users.view, Permissions) && (
          <NavigationLine />
        )}
        <Navigation menu={bloodmanagement} id="aside-blood.management" />
        <Navigation menu={hospitalmanagement} id="aside-hospital.management" />
        <Navigation menu={OrderBlood} id="aside-blood.order.management" />
        <Navigation menu={appUsermanagement} id="aside-appUsermanagement" />
        <Navigation
          menu={campaignManagementPages}
          id="aside-campaign.management"
        />
        <Navigation menu={donormanagement} id="aside-donor.management" />

        <NavigationLine />
      </AsideBody>
    </Aside>
  );
};

export default DashboardAside;
