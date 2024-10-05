import React from 'react';
import { mainMenu } from '../menu';
import Dashboard from '../views/dashboard';

const contents = [
	{
		path: mainMenu.home.path,
		element: <Dashboard />,
		exact: true,
	},
];

export default contents;
