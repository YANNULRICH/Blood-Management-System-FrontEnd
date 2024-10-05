import React from "react"
import { useAbility } from '@casl/react';
import { Navigate, Route, RouteProps, useLocation } from 'react-router-dom';
import { AbilityContext } from './Can';
import Permissions from './index';
import { ERRORS } from '../urls/front';

export type CanRouteProps = {
	can?: null | boolean,
	/**
	 * All permissions should match or only one of them ?
	 * true means ONE permission is needed in order to be valid
	 * false means ALL permissions are needed in order to be valid
	 * default to false
	 */
	some?: boolean,
	permissions: string[],
	children: React.ReactElement
}

/**
 * Access a route if permissions fulfilled
 * @param can
 * @param some
 * @param permissions
 * @param restProps
 * @return {JSX.Element}
 * @constructor
 */
const CanRoute = ({ can, some = false, permissions, children }: CanRouteProps): JSX.Element => {
	const ability = useAbility(AbilityContext);
	const location = useLocation()

	// Check if the user respect all permissions specified in the permissions array prop
	let _can = some
		? permissions.some((p) => ability.can(p, Permissions))
		: permissions.every((p) => ability.can(p, Permissions))

	_can = can !== null && can !== undefined ? can && _can : _can;

	return _can ? children : <Navigate to={ERRORS['403']} replace state={{ from: location }} />;
};

export default CanRoute;
