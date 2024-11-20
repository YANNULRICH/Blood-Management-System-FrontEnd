import dayjs from 'dayjs';
import React, {useEffect} from 'react';
import {Provider} from "react-redux";
import { BrowserRouter } from 'react-router-dom';

import Main from "./Main";
import configureStore from './store/appStore';
import ability from './commons/permissions/ability';
import { AbilityContext } from './commons/permissions/Can';
import { ThemeContextProvider } from './contexts/themeContext';
import {useState} from "react";

import 'react-loading-skeleton/dist/skeleton.css'
import StorageHelper, {StorageKeys} from "./commons/helpers/StorageHelper";
import {AUTH} from "./commons/urls/front";

// Initialize date and enable its localization
// eslint-disable-next-line @typescript-eslint/no-var-requires
const localizedFormat = require('dayjs/plugin/localizedFormat');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

const App = () => {

	return (
		<Provider store={configureStore}>
			<ThemeContextProvider>
				<AbilityContext.Provider value={ability}>
					<BrowserRouter>
						<Main />
					</BrowserRouter>
				</AbilityContext.Provider>
			</ThemeContextProvider>
		</Provider>
	);
};

export default App;
