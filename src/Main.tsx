import dayjs from "dayjs";
import {useSelector} from "react-redux";
import {ThemeProvider} from "react-jss";
import {IntlProvider} from "react-intl";
import {ToastProvider} from "react-toast-notifications";
import React, {useEffect, useMemo, Suspense} from 'react';

import MainRoutes from "./routes";
import steps, {styles} from "./steps";
import {Language} from "./commons/types";
import {TourProvider} from "@reactour/tour";
import Portal from "./layout/Portal/Portal";
import {StoreType} from "./store/redux.types";
import AppLocale, {onIntlError} from "./lang";
import useDarkMode from "./hooks/useDarkMode";
import COLORS from "./commons/data/enumColors";
import {getOS} from "./commons/helpers/funcHelper";
import ErrorBoundary from "./components/errors/ErrorBoundaries";
import RequestGlobalLoader from "./components/RequestGlobalLoader";
import {Toast, ToastContainer} from "./components/bootstrap/Toasts";
import ContentSkeletonLoader from "./components/loaders/ContentSkeletonLoader";
import ReactNotificationWrapper from "./components/notifications/ReactNotificationWrapper";

const Main = () => {
	const settings = useSelector(({ settings }: StoreType) => settings);

	/**
	 * Dark Mode
	 */
	const { themeStatus, darkModeStatus } = useDarkMode();
	const theme = {
		theme: themeStatus,
		primary: COLORS.PRIMARY.code,
		secondary: COLORS.SECONDARY.code,
		success: COLORS.SUCCESS.code,
		info: COLORS.INFO.code,
		warning: COLORS.WARNING.code,
		danger: COLORS.DANGER.code,
		dark: COLORS.DARK.code,
		light: COLORS.LIGHT.code,
	};

	useEffect(() => {
		getOS();
	}, []);

	useEffect(() => {
		if (darkModeStatus) {
			document.documentElement.setAttribute('theme', 'dark');
		}
		return () => {
			document.documentElement.removeAttribute('theme');
		};
	}, [darkModeStatus]);

	const currentAppLocale = useMemo(() => {
		const _currentAppLocale: Language = AppLocale[settings.language];

		// Apply change to dayjs
		dayjs.locale(_currentAppLocale.locale);

		return _currentAppLocale;
	}, [settings.language]);

	return (
		<IntlProvider
			locale={currentAppLocale.locale}
			// @ts-ignore
			messages={currentAppLocale.messages}
			onError={onIntlError}
		>
			<ErrorBoundary>
				<Suspense fallback={<ContentSkeletonLoader />}>
					<ThemeProvider theme={theme}>
						<ToastProvider components={{ ToastContainer, Toast }}>
							<TourProvider
								steps={steps}
								styles={styles}
								showNavigation={false}
								showBadge={false}>
								<div className='app'>
									<MainRoutes />
								</div>
								<Portal id='portal-notification'>
									<ReactNotificationWrapper />
								</Portal>

								<RequestGlobalLoader />
							</TourProvider>
						</ToastProvider>
					</ThemeProvider>
				</Suspense>
			</ErrorBoundary>
		</IntlProvider>
	);
};

export default React.memo(Main);
