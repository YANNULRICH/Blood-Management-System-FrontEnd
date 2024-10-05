import React, { lazy, useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";

import * as FRONT from "../commons/urls/front";
import { StoreType } from "../store/redux.types";
import Permissions from "../commons/permissions";
import WrapperLayout from "../layout/Wrapper/Wrapper";
import AsideRoutes from "../layout/Aside/AsideRoutes";
import CanRoute from "../commons/permissions/CanRoute";
import { setAuthUser } from "../store/slices/authUser/actions";
import Forbidden403 from "../components/errors/ConnexionExpired403";
import ContentSkeletonLoader from "../components/loaders/ContentSkeletonLoader";
import { getJwtData } from "../commons/helpers/jwtHelper";
import Login from "../views/auth/Login";
import MixedRoutes from "./MixedRoutes";
import { HOSPITAL } from "../views/hospital/url/front";
import { ORDER_BLOOD } from "../views/bigPharmOrder/url/front";
import { APP_USER } from "../views/appUser/url/front";
import { BLOOD_TYPE } from "../views/blood/bloodType/url/front";
import { BLOOD_BANK } from "../views/blood/bloodBank/url/front";
import { BLOOD_DONATION } from "../views/blood/bloodDonation/url/front";
import { BLOOD_BAD } from "../views/blood/bloodBag/url/front";
import { DONOR } from "../views/donor/donor/url/front";
import { CAMPAIGN } from "../views/referentiel/campaign/url/front";

const LazyBlood = lazy(() => import("../views/blood/bloodBank/content/index"));

const LazyHospital = lazy(() => import("../views/hospital/content/index"));

const LazyOrderBlood = lazy(
  () => import("../views/bigPharmOrder/content/index")
);

const LazyAppUser = lazy(() => import("../views/appUser/content/index"));

const LazySecurity = lazy(() => import("../views/security"));
const LazyHome = lazy(() => import("../views/dashboard/index"));
const LazyBloodType = lazy(
  () => import("../views/blood/bloodType/content/index")
);
const LazyBloodBank = lazy(
  () => import("../views/blood/bloodBank/content/index")
);
const LazyBloodDonation = lazy(
  () => import("../views/blood/bloodDonation/content/index")
);
const LazyBloodBag = lazy(
  () => import("../views/blood/bloodBag/content/index")
);
const LazyDonor = lazy(() => import("../views/donor/donor/content/index"));
const LazyCampaign = lazy(
  () => import("../views/referentiel/campaign/content/index")
);

/* Redux Provide */
const mapStateToProps = ({ authUser }: StoreType) => ({ authUser });

const mapDispatchToProps = {
  setAuthUser,
};

/* State and Props Type */
const AuthRoutesConnected = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof AuthRoutesConnected>;

type State = {
  // isAuthValid: undefined | bool
};

const AuthRoutes = ({ authUser, setAuthUser }: PropsFromRedux) => {
  const { data, loading, error, fetched } = authUser;
  const jwrData = getJwtData();

  useEffect(() => {
    if (!data) setAuthUser().catch(() => null);
  }, []);

  if (!fetched || loading) return <ContentSkeletonLoader />;

  if (data && jwrData) {
    return (
      <>
        <AsideRoutes />

        <WrapperLayout>
          <Routes>
            <Route
              path={BLOOD_TYPE.ROUTES_ENGINE.INDEX}
              element={<LazyBloodType />}
            />
            <Route
              path={BLOOD_BANK.ROUTES_ENGINE.INDEX}
              element={<LazyBlood />}
            />
            <Route
              path={HOSPITAL.ROUTES_ENGINE.INDEX}
              element={<LazyHospital />}
            />

            <Route
              path={ORDER_BLOOD.ROUTES_ENGINE.INDEX}
              element={<LazyOrderBlood />}
            />

            <Route
              path={APP_USER.ROUTES_ENGINE.INDEX}
              element={<LazyAppUser />}
            />
            <Route path={FRONT.HOME} element={<LazyHome />} />
            <Route
              path={BLOOD_TYPE.ROUTES_ENGINE.INDEX}
              element={<LazyBloodType />}
            />
            <Route
              path={CAMPAIGN.ROUTES_ENGINE.INDEX}
              element={<LazyCampaign />}
            />
            <Route
              path={BLOOD_BANK.ROUTES_ENGINE.INDEX}
              element={<LazyBloodBank />}
            />
            <Route
              path={BLOOD_DONATION.ROUTES_ENGINE.INDEX}
              element={<LazyBloodDonation />}
            />
            <Route
              path={BLOOD_BAD.ROUTES_ENGINE.INDEX}
              element={<LazyBloodBag />}
            />
            <Route path={DONOR.ROUTES_ENGINE.INDEX} element={<LazyDonor />} />
            <Route
              element={
                <CanRoute
                  some
                  permissions={[
                    Permissions.security.roles.view,
                    Permissions.security.permissions.view,
                    Permissions.security.users.view,
                  ]}
                >
                  <LazySecurity />
                </CanRoute>
              }
              path={FRONT.SECURITY.ROUTES_ENGINE.INDEX}
            />
            <Route path="*" element={<MixedRoutes />} />
          </Routes>
        </WrapperLayout>
      </>
    );
  }

  return <Login />;
};

export default AuthRoutesConnected(AuthRoutes);
