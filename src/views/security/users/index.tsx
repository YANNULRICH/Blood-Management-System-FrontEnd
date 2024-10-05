import React from 'react';
import {Route, Routes} from "react-router-dom";

import List from './List';
import Add from './Add';
import Update from './Update';
import Details from './Details';
import { SECURITY } from '../../../commons/urls/front';
import Permissions from '../../../commons/permissions';
import CanRoute from '../../../commons/permissions/CanRoute';

const UsersIndex = () => {
	return (
		<Routes>
			<Route
				path={SECURITY.ROUTES_ENGINE.USERS.ADD}
				element={(
					<CanRoute permissions={[
						Permissions.security.users.add,
						Permissions.security.users.view
					]}>
						<Add />
					</CanRoute>
				)}
			/>
			<Route
				path={SECURITY.ROUTES_ENGINE.USERS.UPDATE}
				element={(
					<CanRoute permissions={[
						Permissions.security.users.change,
						Permissions.security.users.view
					]}>
						<Update />
					</CanRoute>
				)}
			/>
			<Route
				path={SECURITY.ROUTES_ENGINE.USERS.DETAILS}
				element={(
					<CanRoute permissions={[ Permissions.security.users.view ]}>
						<Details />
					</CanRoute>
				)}
			/>
			<Route
				path='*'
				element={(
					<CanRoute permissions={[ Permissions.security.users.view ]}>
						<List />
					</CanRoute>
				)}
			/>
		</Routes>
	);
};

export default UsersIndex;
