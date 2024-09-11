import React, {useContext, useLayoutEffect, useState} from 'react';

import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../components/bootstrap/Dropdown';

import classNames from 'classnames';
import { globalT } from '../../../lang';
import Avatar from '../../../components/Avatar';
import LogoText from '../../../components/LogoText';
import useDarkMode from '../../../hooks/useDarkMode';
import { LanguageDict } from '../../../commons/types';
import { mainMenu, dashboardMenu } from '../../../menu';
import useCurrentPath from '../../../hooks/useCurrentPath';
import { avatars } from '../../../commons/data/avatarData';
import Spinner from '../../../components/bootstrap/Spinner';
import IntlMessages from '../../../components/IntlMessages';
import Popovers from '../../../components/bootstrap/Popovers';
import LANG, { getLangWithKey } from '../../../lang/language';
import { AUTH, DASHBOARD } from '../../../commons/urls/front';

import { logoutUser } from '../../../store/slices/authUser/actions';
import { setLanguage } from '../../../store/slices/settings/actions';
import Button, { IButtonProps } from '../../../components/bootstrap/Button';
import { useAppDispatch, useAppSelector } from '../../../store/redux.types';
import Header, { HeaderLeft, HeaderRight } from '../../../layout/Header/Header';
import DialogComponent from "../../../components/dialogs/DialogComponent";
import {AbilityContext} from "../../../commons/permissions/Can";
import Permissions from "../../../commons/permissions";
import {getJwtData} from "../../../commons/helpers/jwtHelper";

const DefaultHeader = () => {
	const dispatch = useAppDispatch();
	const ability = useContext(AbilityContext)
	const [showDialog, setShowDialog] = useState<boolean>(false)
	const { settings, authUserData } = useAppSelector(({ settings, authUser, }) => ({
		settings,
		authUserData: authUser.data
	}));
	const jwtData = getJwtData()

	const { darkModeStatus, setDarkModeStatus } = useDarkMode();
	const styledBtn: IButtonProps = {
		color: darkModeStatus ? 'dark' : 'light',
		hoverShadow: 'default',
		isLight: !darkModeStatus,
		size: 'lg',
	};
	const currentPath = useCurrentPath();

	const changeLanguage = (locale: LanguageDict) => {
		if (locale !== settings.language) {
			dispatch(setLanguage(locale));
		}
	};

	const onLogout = () => {
		dispatch(logoutUser());
	}

	/**
	 * Language attribute
	 */
	useLayoutEffect(() => {
		document.documentElement.setAttribute('lang', settings.language);
	});

	return (
		<Header>
			<HeaderLeft>
				<div className='align-items-center col-auto d-block d-md-flex headerStyle text-sm-left text-center'>
					{!authUserData && !currentPath?.includes(DASHBOARD.INDEX) && (
						<LogoText className="fw-bold" />
					)}

					{/*<Button*/}
					{/*	tag='a'*/}
					{/*	isLink*/}
					{/*	color='primary'*/}
					{/*	to={mainMenu.home.path}*/}
					{/*	icon={mainMenu.home.icon}*/}
					{/*	aria-label={globalT(mainMenu.home.text as string)}*/}
					{/*	isLight={currentPath === mainMenu.home.path}*/}
					{/*	className={classNames('ms-md-3 mb-md-0')}>*/}
					{/*	<IntlMessages id={mainMenu.home.text as string} />*/}
					{/*</Button>*/}

				</div>
			</HeaderLeft>

			<HeaderRight>
				<div className='row g-3 align-items-center'>
					{/* Dark Mode */}
					<div className='col-auto'>
						<Popovers trigger='hover' desc='Dark / Light mode'>
							<Button
								// eslint-disable-next-line react/jsx-props-no-spreading
								{...styledBtn}
								icon={darkModeStatus ? 'DarkMode' : 'LightMode'}
								onClick={() => setDarkModeStatus(!darkModeStatus)}
								aria-label='Toggle fullscreen'
								data-tour='dark-mode'
							/>
						</Popovers>
					</div>


					{/* Lang Selector */}
					<div className='col-auto'>
						{LANG.fr.text === getLangWithKey(settings.language)?.text ? (
							<Button
								// eslint-disable-next-line react/jsx-props-no-spreading
								onClick={() => changeLanguage(LANG.en.locale)}
								aria-label='Change language'
								{...styledBtn}
								data-tour='lang-selector'>
								{ globalT(LANG.en.text) }
							</Button>
						) : (
							<Button
								// eslint-disable-next-line react/jsx-props-no-spreading
								onClick={() => changeLanguage(LANG.fr.locale)}
								aria-label='Change language'
								{...styledBtn}
								data-tour='lang-selector'
							>
								{ globalT(LANG.fr.text) }
							</Button>
						)}

					</div>

					<div
						className='col d-flex align-items-center cursor-pointer'
						// onClick={() => setState(!state)}
						role='presentation'>
						{authUserData && (
							<div className='me-3'>
								<div className='text-end'>
									<div className='fw-bold fs-6 mb-0'>
										{authUserData.email}
									</div>
								</div>
							</div>
						)}
						<div className='position-relative'>
							<Dropdown>
								<DropdownToggle hasIcon={false}>
									<Avatar
										size={42}
										// Here, we can later change color according to pending actions like notifications or urgent things to do.
										// For example put red to say urgent thing to validate or green to say account ok...
										// color='primary'
										srcSet={(authUserData && authUserData.person?.pictureFile) ? authUserData && authUserData.person?.pictureFile : avatars['guy1'].srcSetBlur}
										src={(authUserData && authUserData.person?.pictureFile) ? authUserData && authUserData.person?.pictureFile : avatars['guy1'].srcSetBlur}
										color="success"
									/>
								</DropdownToggle>
								{/* @ts-ignore */}
								<DropdownMenu isAlignmentEnd isCloseAfterLeave={false}>
									{!(authUserData && jwtData ) ? (
										<>
											<DropdownItem>
												<Button tag="a" to={AUTH.LOGIN} {...styledBtn}>
													<i className='bx bx-pull-left bx-sm bx-log-out' />
													<IntlMessages id='auth.login' />
												</Button>
											</DropdownItem>
										</>

									) : (
										<>
											{authUserData.person && (
												<DropdownItem>
													<Button tag="a" to={AUTH.PROFILE} {...styledBtn}>
														<i className='bx bx-pull-left bx-sm bx-log-out' />
														<IntlMessages id='auth.profile' />
													</Button>
												</DropdownItem>
											)}

											<DropdownItem>
												<Button onClick={onLogout} {...styledBtn}>
													<i className='bx bx-pull-left bx-sm bx-log-out' />
													<IntlMessages id='auth.logout' />
												</Button>
											</DropdownItem>
										</>

									)}
								</DropdownMenu>
							</Dropdown>
						</div>
					</div>

				</div>
			</HeaderRight>
		</Header>
	);
};

export default DefaultHeader;
