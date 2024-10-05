import React, { useEffect } from 'react';
import { useAppSelector } from '../store/redux.types';
import { useNavigate } from 'react-router-dom';
import { DASHBOARD } from '../commons/urls/front';

type OnlyUnAuthRouteProps = {
	component: React.ReactElement
}

const OnlyUnAuthRouteMiddleware = ({ component }: OnlyUnAuthRouteProps): React.ReactElement => {
	const navigate = useNavigate();
	const authUserData = useAppSelector(state => state.authUser.data);

	useEffect(() => {
		if (authUserData) {
			navigate(DASHBOARD.INDEX)
		}
	}, []);

	if (authUserData) {
		return (<></>)
	}

	return component;
}

export default OnlyUnAuthRouteMiddleware;
