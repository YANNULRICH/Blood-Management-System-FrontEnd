import React from 'react';
import DefaultFooter from '../pages/_layout/_footers/DefaultFooter';
import { AUTH } from '../commons/urls/front';

const footers = [
	{ path: AUTH.LOGIN, element: null, exact: true },
	{ path: '*', element: <DefaultFooter /> },
];

export default footers;
