import React, {useState} from 'react';
import * as yup from "yup";
import {AxiosError} from "axios";
import {useIntl} from "react-intl";
import {useNavigate} from 'react-router-dom';
import {yupResolver} from "@hookform/resolvers/yup";
import {SubmitHandler, useForm} from "react-hook-form";

import {useAppDispatch, useAppSelector} from "../../store/redux.types";
import Button from '../../components/bootstrap/Button';
import IntlMessages from "../../components/IntlMessages";
import * as yupSchema from '../../components/forms/yupShema';
import {loginUser} from "../../store/slices/authUser/actions";
import InputComponent from "../../components/forms/InputComponent";
import NotificationManager from "../../components/notifications/NotificationManager";
import {setRequestGlobalLoader} from "../../store/slices/requestGlobalLoader/actions";
import VisibilityOff from "../../components/icon/material-icons/VisibilityOff";
import Visibility from "../../components/icon/material-icons/Visibility";
import "./auth.scss"
import logo from "../../assets/img/landing2/chart.webp"
import {globalT} from "../../lang";
import classNames from "classnames";
import {HOME} from "../../commons/urls/front";

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
	email: yupSchema.email,
	password: yupSchema.password,
});

type FormType = {
	email: string;
	password: string;
}

const Login = () => {
	const intl = useIntl();
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const [show, setShow] = useState<boolean>(false)
	const { settings, authUserData } = useAppSelector(({ settings, authUser, }) => ({
		settings,
		authUserData: authUser.data
	}));

	const {
		control,
		handleSubmit,
		getValues,
		formState: {errors},
	} = useForm<FormType>({
		mode: 'onChange',
		defaultValues: {
			// 'email': 'admin@gmail.com',
			// 'password': 'Admin1*',
		},
		resolver: yupResolver(schema),
	});

	const onSubmit: SubmitHandler<FormType> = (data) => {
		dispatch(setRequestGlobalLoader(true));

		dispatch(loginUser({ email: data.email, password: data.password }))
			.then(() => {
				navigate(HOME)
			})
			.catch((e: AxiosError) => {
				if (e && e.response && ![400, 419, 500].includes(e.response.status)) {
					NotificationManager.error(intl.formatMessage({id: "auth.login.error"} ));
				}
			})
			.finally(() => dispatch(setRequestGlobalLoader(false)));
	}


	return (
		<div className="row h-100">
			<div className="col-xl-9 col-md-8 d-none d-sm-none d-md-block">
				<img src={"logo"} alt="minepat" className="h-100 w-100"/>
			</div>
			<div className= {classNames("col-xl-3 col-md-4 ps-sm-4 pe-sm-4 ps-md-0 pe-md-0")} >
				<div className='row h-100 align-items-center justify-content-center'>
					<div className=''>
						{/*<div className='text-center'>
							<LogoText className="fw-bold" />
						</div>

						<div className='my-4'>
							<div className='text-center h2 fw-bold'>
								<IntlMessages id='auth.login.text' />
							</div>
							<div className='text-center h4 text-muted'>
								<IntlMessages id='auth.login.text2' />
							</div>
						</div>*/}

						<form
							noValidate
							className='row g-4'
							onSubmit={handleSubmit(onSubmit)}>

							<div className='col-12'>
								<InputComponent
									name="email"
									type='email'
									errors={errors}
									control={control}
									helperLabel={<IntlMessages id='form.field.email' />}
								/>
							</div>

							<div className='col-12 hidePassword'>
								<InputComponent
									name="password"
									errors={errors}
									control={control}
									helperLabel={<IntlMessages id='form.field.password' />}
									type={!show ? 'password' : 'text'}
								/>
								<span className="">
											<Button
												isLink
												isOutline
												color='dark'
												className=''
												onClick={() => {
													setShow(!show)
												}}>
													{!show ? (
														<Visibility/>
													) : (
														<VisibilityOff/>
													)}
												</Button>
										</span>
							</div>

							<div className='col-12  text-end'>
								<div className="hidePassword">

								</div>

							</div>

							<div className="text-end">
								<Button
									tag={"a"}
									// isLight
									color='primary'
									isOutline={true}
									className='w-auto py-3'
									onClick={() => console.log("aaaaaaaa")}
								>
									{/*<IntlMessages id='auth.login.btn' />*/}
									<span>{globalT("login.forget.password")}</span>
								</Button>
							</div>

							<div className='col-12'>
								<Button
									color='primary'
									className='w-100 py-3'
									onClick={handleSubmit(onSubmit)}>
									<IntlMessages id='auth.login.btn' />
								</Button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
