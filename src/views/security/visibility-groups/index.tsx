import React from 'react';
import {Route, Routes} from "react-router-dom";

import List from './List';
import Add from './Add';
import Update from './Update';
import { SECURITY } from '../../../commons/urls/front';
import Permissions from '../../../commons/permissions';
import CanRoute from '../../../commons/permissions/CanRoute';

const VisibilityGroupsIndex = () => {
	return (
		<Routes>
			<Route
				path={SECURITY.ROUTES_ENGINE.VISIBILITY_GROUPS.ADD}
				element={(
					<CanRoute permissions={[
						Permissions.security.visibilityGroups.add,
						Permissions.security.visibilityGroups.view
					]}>
						<Add />
					</CanRoute>
				)}
			/>
			<Route
				path={SECURITY.ROUTES_ENGINE.VISIBILITY_GROUPS.UPDATE}
				element={(
					<CanRoute permissions={[
						Permissions.security.visibilityGroups.change,
						Permissions.security.visibilityGroups.view
					]}>
						<Update />
					</CanRoute>
				)}
			/>
			<Route
				path='*'
				element={(
					<CanRoute permissions={[ Permissions.security.visibilityGroups.view ]}>
						<List />
					</CanRoute>
				)}
			/>
		</Routes>
	);
};

export default VisibilityGroupsIndex;
