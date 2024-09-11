import React, {lazy} from 'react';
import {Navigate, Route, Routes} from "react-router-dom";

import * as FRONT from "../commons/urls/front";
import OnlyUnAuthRouteMiddleware from './OnlyUnAuthRouteMiddleware';
import Confidentialite from "../views/Home/Confidentialite";

const LazyLogin = lazy(() => import('../views/auth/Login'));
const LazyErrors = lazy(() => import('../views/errors'));

const UnauthRoutes = () => {
    return (
        <Routes>
            <Route path={FRONT.AUTH.LOGIN} element={<OnlyUnAuthRouteMiddleware component={<LazyLogin />} />} />
            <Route path={"/confidentialite"} element={<Confidentialite />} />
            <Route path={FRONT.ERRORS.ROUTES_ENGINE.INDEX} element={<LazyErrors />} />
            <Route path='*' element={<Navigate to={FRONT.AUTH.LOGIN} replace />} />
            {/*<Route path='*' element={<LazyLogin />} />*/}

            {/*<MixedRoutes />*/}
        </Routes>
    );
};

export default UnauthRoutes;
