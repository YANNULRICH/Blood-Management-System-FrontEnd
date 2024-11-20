import React from 'react';
import { dashboardMenu, mainMenu } from '../menu';
import DefaultHeader from '../pages/_layout/_headers/DefaultHeader';

const headers = [
	{ path: dashboardMenu.dashboard.path, element: <DefaultHeader />, exact: true },
	{ path: mainMenu.home.path, element: <DefaultHeader />, exact: true },
	{ path: '*', element: <DefaultHeader /> },
];

export default headers;
