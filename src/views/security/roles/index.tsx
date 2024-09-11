import React from 'react';
import {Route, Routes} from "react-router-dom";

import List from './List';
import Add from './Add';
import Update from './Update';
import { SECURITY } from '../../../commons/urls/front';
import Permissions from '../../../commons/permissions';
import CanRoute from '../../../commons/permissions/CanRoute';

const RoleIndex = () => {
	return (
		<Routes>
			<Route
				path={SECURITY.ROUTES_ENGINE.ROLES.ADD}
				element={(
					<CanRoute permissions={[
						Permissions.security.roles.add,
						Permissions.security.roles.view
					]}>
						<Add />
					</CanRoute>
				)}
			/>
			<Route
				path={SECURITY.ROUTES_ENGINE.ROLES.UPDATE}
				element={(
					<CanRoute permissions={[
						Permissions.security.roles.change,
						Permissions.security.roles.view
					]}>
						<Update />
					</CanRoute>
				)}
			/>
			<Route
				path='*'
				element={(
					<CanRoute permissions={[ Permissions.security.roles.view ]}>
						<List />
					</CanRoute>
				)}
			/>
		</Routes>
	);
};

export default RoleIndex;
