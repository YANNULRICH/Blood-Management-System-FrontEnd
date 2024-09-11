import React from 'react';
import AuthRoutes from "./AuthRoutes";
import UnauthRoutes from "./UnauthRoutes";
import { Route, Routes } from 'react-router-dom';
import { DASHBOARD } from '../commons/urls/front';

const MainRoutes = () => {
	return (
		<Routes>
			<Route path={DASHBOARD.ROUTES_ENGINE.INDEX} element={<AuthRoutes />} />
			<Route path='*' element={<UnauthRoutes />} />
		</Routes>
	)
};

export default MainRoutes;
