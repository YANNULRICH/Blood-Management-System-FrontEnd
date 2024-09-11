import React from 'react';
import {Route, Routes, Navigate} from "react-router-dom";

import UsersIndex from './users';
import RolesRoutesIndex from './roles';
import PermissionsRoutes from './permissions';
import VisibilityGroupsIndex from './visibility-groups';
import { SECURITY } from '../../commons/urls/front';
import Permissions from '../../commons/permissions';
import CanRoute from '../../commons/permissions/CanRoute';

const SecurityIndex = () => {
	return (
		<Routes>
			<Route
				path={SECURITY.ROUTES_ENGINE.ROLES.INDEX}
				element={(
					<CanRoute permissions={[ Permissions.security.roles.view ]}>
						<RolesRoutesIndex />
					</CanRoute>
				)}
			/>
			<Route
				path={SECURITY.ROUTES_ENGINE.PERMISSIONS.INDEX}
				element={(
					<CanRoute permissions={[ Permissions.security.permissions.view ]}>
						<PermissionsRoutes />
					</CanRoute>
				)}
			/>
			<Route
				path={SECURITY.ROUTES_ENGINE.VISIBILITY_GROUPS.INDEX}
				element={(
					<CanRoute permissions={[ Permissions.security.visibilityGroups.view ]}>
						<VisibilityGroupsIndex />
					</CanRoute>
				)}
			/>
			<Route
				path={SECURITY.ROUTES_ENGINE.USERS.INDEX}
				element={(
					<CanRoute permissions={[ Permissions.security.users.view ]}>
						<UsersIndex />
					</CanRoute>
				)}
			/>
			<Route path='*' element={<Navigate to={SECURITY.ROLES.INDEX} />} />
		</Routes>
	);
};

export default SecurityIndex;
