import React from 'react';
import DashboardAside from '../pages/_layout/_asides/DashboardAside';

const asides = [
	{ path: '*', element: <DashboardAside />, exact: true },
];

export default asides;
