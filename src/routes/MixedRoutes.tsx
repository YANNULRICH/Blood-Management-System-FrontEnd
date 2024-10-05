import React, {lazy} from 'react';
import {Route, Routes} from "react-router-dom";
// import Routes from "./index";

const Error404 = lazy(() => import('../views/errors/Error404'));

const MixedRoutes = () => {
    return (
        <Route>

            <Route path='*' element={<Error404 />} />
        </Route>
    );
};

export default MixedRoutes;
