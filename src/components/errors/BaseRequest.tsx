// @ts-nocheck
import React from 'react';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import Page from '../../layout/PageWrapper/Page';
import Humans from '../../assets/img/scene4.png';
import HumansWebp from '../../assets/img/scene4.webp';
import Button from '../bootstrap/Button';
import IntlMessages from "../IntlMessages";
import {mainMenu} from "../../menu";
import {globalT} from "../../lang";
import classNames from "classnames";
import {AUTH, DASHBOARD} from "../../commons/urls/front";
import {useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../store/redux.types";
import {logoutUser} from "../../store/slices/authUser/actions";
import {getJwtData} from "../../commons/helpers/jwtHelper";

export type BaseRequestProps = {
	showBtn: boolean;
	title: React.ReactElement,
	message: {
		id: string;
		values?: Record<string, any>;
	};
};

const BaseRequest = ({ title, message, showBtn }: BaseRequestProps) => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { authUserData } = useAppSelector(({  authUser }) => ({
		authUserData: authUser.data
	}));
	const jwrData = getJwtData();

	return (
		<PageWrapper title={title}>
			<Page>
				<div className='row d-flex align-items-center'>
					<div className='col-12 mt-5 d-flex flex-column justify-content-center align-items-center'>
						<div
							// style={{ fontSize: 'calc(1rem + 2vw)' }}>
							>
							<h1 className='text-primary text-center fw-bold'>{title}</h1>
						</div>
						<div
							// style={{ fontSize: 'calc(1.5rem + 1.5vw)' }}>
							style={{ fontSize: '17px', textAlign: 'center', maxWidth: '80%' }}>
							<IntlMessages {...message} />
						</div>
					</div>
					<div className='col-12 my-4 d-flex align-items-baseline justify-content-center'>
						<img
							srcSet={HumansWebp}
							src={Humans}
							alt='Humans'
							style={{ height: '40vh' }}
						/>
					</div>
					<div className='col-12 d-flex flex-column justify-content-center align-items-center'>
						{showBtn && (
							<div>
								{authUserData && jwrData && (
									<Button
										className='px-5 py-2 me-5'
										type='button'
										// onClick={() => navigate(DASHBOARD.INDEX)}
										color='primary'
										isLight
										icon='HolidayVillage'
										tag='a'
										href={"ARTICLE.BARBI"}
									>
										<IntlMessages id="button.backToDashbord" />
									</Button>
								)}
								<Button
									type='button'
									onClick={() => { navigate(AUTH.LOGIN); dispatch(logoutUser())}}
									className='px-5 py-2 me-5'
									color='primary'
									isLight
									icon='HolidayVillage'
									tag='a'
									// href={DASHBOARD.INDEX}
								>
									<IntlMessages id="button.backToLogin" />
								</Button>

								{/*<Button*/}
								{/*	type='button'*/}
								{/*	className='px-5 py-2 me-5'*/}
								{/*	color='dark'*/}
								{/*	// icon='HolidayVillage'*/}
								{/*	tag='a'*/}
								{/*	onClick={navigation.goBack}*/}
								{/*>*/}
								{/*	<IntlMessages id="button.backToHome" />*/}
								{/*</Button>*/}
							</div>

						)}
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default BaseRequest;
