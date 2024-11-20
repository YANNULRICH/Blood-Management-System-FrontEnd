import * as yup from 'yup';
import React, {useEffect, useRef, useState} from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

import { globalT } from '../../../lang';
import csuClient from '../../../network';
import Page from '../../../layout/Page/Page';
import metadata from '../../../commons/data/metadata';
import { SECURITY } from '../../../commons/urls/front';
import Button from '../../../components/bootstrap/Button';
import { useAppDispatch } from '../../../store/redux.types';
import IntlMessages from '../../../components/IntlMessages';
import { FetchResource } from '../../../network/network.types';
import * as yupSchema from '../../../components/forms/yupShema';
import UserListItem from '../../../commons/models/UserListItem';
import ChecksInput from '../../../components/forms/ChecksInput';
import Nav, { NavItem } from '../../../components/bootstrap/Nav';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Breadcrumb from '../../../components/bootstrap/Breadcrumb';
import InputComponent from '../../../components/forms/InputComponent';
import { joinUrlWithParamsId } from '../../../commons/helpers/funcHelper';
import SelectFromRemote from '../../../components/forms/select/SelectFromRemote';
import ErrorRequestComponent from '../../../components/errors/ErrorRequestComponent';
import ContentSkeletonLoader from '../../../components/loaders/ContentSkeletonLoader';
import NotificationManager from '../../../components/notifications/NotificationManager';
import { setRequestGlobalLoader } from '../../../store/slices/requestGlobalLoader/actions';
import SubHeader, { SubHeaderLeft, SubHeaderRight } from '../../../layout/SubHeader/SubHeader';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTitle
} from '../../../components/bootstrap/Card';
import { ChecksGroup } from '../../../components/bootstrap/forms/Checks';
import Visibility from "../../../components/icon/material-icons/Visibility";
import VisibilityOff from "../../../components/icon/material-icons/VisibilityOff";
import SingleItemTransition from "../../../components/transitions/SingleItemTransition";
import Label from "../../../components/bootstrap/forms/Label";
import SelectAsyncPaginate from "../../../components/forms/select/SelectAsyncPaginate";

const schema = yup.object().shape({
	firstName: yupSchema.name,
	lastName: yupSchema.name,
	phoneNumber: yupSchema.phone,
	email: yupSchema.email,
	newPassword: yupSchema.passwordNotRequired,
	confirmNewPassword: yupSchema.passwordNotRequired,
})

type FormType = {
	firstName?: string
	lastName?: string
	gender?: 'M' | 'F'
	registerNumber?: string
	phoneNumber?: string
	email?: string
	newPassword?: string
	confirmNewPassword?: string
	isActive?: boolean
	roles?: Array<{ id: string, name: string, code: string }>
	visibilityGroups?: Array<{ id: string, name: string, code: string }>
	permissions?: Array<{ id: string, name: string, code: string }>
	region?: { id: number, name: string },
	department?: { id: number, name: string },
	district?: { id: number, name: string },
	fosa?: { id: number, name: string },
	userType?: { id: string, name: string },
	isFixePosition?: boolean | null | undefined,
	isOcs?: boolean | null | undefined
	regionalFund?: { id: string, name: string },
}

type UpdateProps = {
	user: UserListItem
}

const Update = ({ user }: UpdateProps) => {
	const navigate = useNavigate()
	const dispatch = useAppDispatch()

	const [mode, setMode] = useState<'normal' | 'password'>('normal');
	const [showPassword, setShowPassword] = useState<boolean>(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
	const isPositionFixe = useRef<boolean | null | undefined>(false)
	const is_ocs = useRef<boolean | null | undefined>(false)

	const {
		setError,
		reset,
		setValue,
		control,
		watch,
		handleSubmit,
		formState: { errors },
	} = useForm<FormType>({
		mode: 'onChange',
		defaultValues: {

			isActive: user.isActive,
			email: user.email,
			userType: {id:user.userType, name:user.userType},
		},
		resolver: yupResolver(schema),
	});

	isPositionFixe.current = watch('isFixePosition');
	is_ocs.current = watch('isOcs');

	// useEffect(() => {
	// 	reset({userType: {id:user.userType}})
	// }, [])

	const content = [
		{
			"id": "CENTRAL",
			"code": "Central",
			"name": "Central"
		},
		{
			"id": "DISTRICT",
			"code": "District",
			"name": "District"
		},
		{
			"id": "REGIONAL",
			"code": "regional",
			"name": "regional"
		}
	]


	const isFormValid = (data: FormType) => {
		let isValid = true
		const errors: Array<(shouldFocus: boolean) => unknown> = []

		if ( data.gender !== 'M' && data.gender !== 'F' ) {
			isValid = false
			const message = globalT('enrollment.gender.error');
			errors.push((shouldFocus) => setError("gender", { type: "custom", message }, { shouldFocus }));
		}

		if ( ! (Array.isArray(data.visibilityGroups) && data.visibilityGroups.length > 0) ) {
			isValid = false
			NotificationManager.warning(globalT('security.groups.visibility.required'));
		}

		if ( ! (Array.isArray(data.roles) && data.roles.length > 0) ) {
			isValid = false
			NotificationManager.warning(globalT('security.roles.required'));
		}

		if (data.newPassword || data.confirmNewPassword) {
			if (data.newPassword !== data.confirmNewPassword) {
				const message = globalT('form.errors.password.confirmation.long')
				errors.push((shouldFocus) => setError("newPassword", { type: "custom", message }, { shouldFocus }));
			}
		}

		if (errors.length > 0)
			errors.forEach((fn, index) => {
				if (index === 0)
					fn(true)
				else fn(false)
			});

		return isValid;
	};

	const isFormValidPassWord = (data: FormType) => {
		let isValid = true
		const regex = /^(?=.*[A-Z])(?=.*[\W_]).{5,}$/;

		if (!regex.test(data.newPassword as string)) {
			isValid =false;
			const message = globalT('form.errors.password.valid');
			setError("newPassword", { type: "custom", message })
		}

		if (!regex.test(data.confirmNewPassword as string)) {
			isValid =false;
			const message = globalT('form.errors.password.valid');
			setError("confirmNewPassword", { type: "custom", message })
		}

		if (data.newPassword !== data.confirmNewPassword) {
			isValid =false;
			NotificationManager.warning('le mot de passe doit être egal a la confirmation du mot de passe')
		}

		return isValid
	}

	const onSubmit: SubmitHandler<FormType> = (data) => {
		if (mode === 'password') {
			if (!isFormValidPassWord(data)) return;
		} else
			if (!isFormValid(data)) return;


		dispatch(setRequestGlobalLoader(true))

		console.log("data :", data)

		if (mode === 'password') {
			csuClient
				.security
				.users
				.updatePassword(user.id, { password: data.newPassword })
				.then(() => {
					navigate(joinUrlWithParamsId(SECURITY.USERS.DETAILS, user.id))
				})
				.catch(() => null)
				.finally(() => dispatch(setRequestGlobalLoader(false)))
		} else {
			const datas = {
				lastName: data.lastName,
				firstName: data.firstName,
				gender: data.gender,
				phoneNumber: data.phoneNumber,
				registerNumber: data.registerNumber || undefined,
				email: data.email,
				isActive: Boolean(data.isActive),
				groups: (data.roles || []).map(p => p.id),
				visibilityGroups: (data.visibilityGroups || []).map(p => p.id),
				userPermissions: (data.permissions || []).map(p => p.id),
				userType: data.userType,
				is_ocs: is_ocs.current ? true : false,
				regional_fund: data.regionalFund?.id,
			}

			csuClient
				.security
				.users
				.update(user.id, datas)
				.then(() => {
					navigate(joinUrlWithParamsId(SECURITY.USERS.DETAILS, user.id))
				})
				.catch(() => null)
				.finally(() => dispatch(setRequestGlobalLoader(false)))
		}
	}

	return (
		<div className='col-12'>
			<Card>
				<CardHeader className='pb-0'>
					<CardTitle tag='h2'>
						<IntlMessages id='metadata.users.update.title' />
					</CardTitle>
					<CardActions>
						<Nav design='tabs'>
							<NavItem
								className="cursor-pointer"
								isActive={mode === 'normal'}
								onClick={() => {
									setMode('normal')
									reset({newPassword: '', confirmNewPassword: ''})
									// setValue('confirmNewPassword', '')
								} }>
								<span>
									<IntlMessages id='users.management.update.data.normal' />
								</span>
							</NavItem>
							<NavItem
								isActive={mode === 'password'}
								className="cursor-pointer"
								onClick={() => setMode('password')}>
								<span>
									<IntlMessages id='users.management.update.data.password' />
								</span>
							</NavItem>
						</Nav>
					</CardActions>
				</CardHeader>
				<CardBody>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className='row g-4' hidden={mode === 'password'}>

							<div className='col-sm-12 col-md-6'>
								<InputComponent
									name="firstName"
									errors={errors}
									control={control}
									displayRequiredAsterisk
									label={<IntlMessages id='form.field.firstName'/>}
								/>
							</div>

							<div className='col-sm-12 col-md-6'>
								<InputComponent
									name="lastName"
									errors={errors}
									control={control}
									displayRequiredAsterisk
									label={<IntlMessages id='form.field.lastName'/>}
								/>
							</div>

							<div className="col-sm-12 col-md-6">
								<InputComponent
									name="email"
									type="email"
									errors={errors}
									control={control}
									displayRequiredAsterisk
									label={<IntlMessages id='form.field.email'/>}
									otherValidators={{
										validate: (val: string | undefined) => yupSchema.email.isValidSync(val)
											|| (<IntlMessages id="form.errors.email" />)
									}}
								/>
							</div>

							<div className="col-sm-12 col-md-6">
								<ChecksGroup
									checkWrapperProps={{ className: 'mt-3' }}
									label={<><IntlMessages id='form.field.gender'/><span className="text-danger">*</span></>}>
									<ChecksInput
										isInline
										value='M'
										isRequired
										type='radio'
										name="gender"
										id={`gender_M`}
										errors={errors}
										control={control}
										wrapperClassName='d-inline-block'
										label={<IntlMessages id='form.field.gender.male'/>}
									/>
									<ChecksInput
										isInline
										value='F'
										isRequired
										type='radio'
										name="gender"
										errors={errors}
										id={`gender_F`}
										control={control}
										wrapperClassName='d-inline-block'
										label={<IntlMessages id='form.field.gender.female'/>}
									/>
								</ChecksGroup>
							</div>

							<div className="col-sm-12 col-md-6">
								<InputComponent
									name="phoneNumber"
									errors={errors}
									control={control}
									displayRequiredAsterisk
									label={<IntlMessages id='form.field.phoneNumber'/>}
									otherValidators={{
										validate: (val: string | undefined) => !val ? true : yupSchema.regex.cameroonPhoneNumber.test(val || '')
											|| (<IntlMessages id="form.errors.phone.cmr" />)
									}}
								/>
							</div>

							<div className="col-sm-12 col-md-6">
								<InputComponent
									errors={errors}
									control={control}
									isRequired={false}
									name="registerNumber"
									label={<IntlMessages id='form.field.register.number'/>}
								/>
							</div><br/>

							<div className="pt-2 pb-4">
								<ChecksInput
									isInline
									value=''
									type='checkbox'
									name="isFixePosition"
									id='fixed'
									errors={errors}
									control={control}
									wrapperClassName='d-inline-block'
									label={<IntlMessages id='form.field.positionFixe'/>}
								/>
							</div>



							<div className="pt-2 pb-4">
								<ChecksInput
									isInline
									value=''
									type='checkbox'
									name="isOcs"
									id='fixed'
									errors={errors}
									control={control}
									wrapperClassName='d-inline-block'
									label={<IntlMessages id='form.field.isOcs'/>}
								/>
							</div>

							<div className=''>
								<InputComponent
									errors={errors}
									control={control}
									options={content.map(item => ({id: item.id, label: item.name}))}
									setValue={setValue}
									componentType="select"
									name='userType'
									// getOptionLabel={(option) => option.name}
									label={<IntlMessages id='user.type'/>}
									placeholder={<IntlMessages id='user.type'/>}
								/>
							</div>

							<div className="col-sm-12 col-md-12">
								<SelectFromRemote
									isMulti
									errors={errors}
									control={control}
									watchValue={null}
									setValue={setValue}
									name="visibilityGroups"
									componentType='select'
									displayRequiredAsterisk
									getOptionValue={(option) => option.id}
									getOptionLabel={(option) => option.name}
									fetchData={() => csuClient.security.visibilityGroups.getAll({page_size:200})}
									label={<IntlMessages id='security.groups.visibility'/>}
									emptyListText={{ id: 'security.users.management.single.vg.empty' }}
									placeholder={<IntlMessages id='security.groups.visibility'/>}
									defaultValues={user ? user.visibilityGroups.map(vg => vg.id) : undefined}
								/>
							</div>

							<div className="col-sm-12 col-md-12">
								<SelectFromRemote
									isMulti
									name="roles"
									errors={errors}
									control={control}
									watchValue={null}
									setValue={setValue}
									componentType='select'
									displayRequiredAsterisk
									getOptionValue={(option) => option.id}
									getOptionLabel={(option) => option.name}
									fetchData={() => csuClient.security.roles.getAll({page_size:200})}
									defaultValues={user ? user.roles.map(r => r.id) : undefined}
									label={<IntlMessages id='security.roles'/>}
									emptyListText={{ id: 'security.roles.list.empty' }}
									placeholder={<IntlMessages id='security.roles'/>}
								/>
							</div>

							<div className="col-sm-12 col-md-12">
								<SelectFromRemote
									isMulti
									errors={errors}
									control={control}
									watchValue={null}
									name="permissions"
									setValue={setValue}
									componentType='select'
									displayRequiredAsterisk={false}
									getOptionValue={(option) => option.id}
									getOptionLabel={(option) => option.name}
									mapItemsToOptions={data => data}
									defaultValuesMatchFn={(itemFromData, itemFromDefaultValues) => itemFromData.code === itemFromDefaultValues}
									fetchData={() => csuClient.security.permissions.getAll({page_size:700})}
									label={<IntlMessages id='security.permissions'/>}
									defaultValues={user ? user.permissions : undefined}
									placeholder={<IntlMessages id='security.permissions'/>}
								/>
							</div>

							{/*<div className="col-md-10 mb-2">
								<Label isRequired>
									<IntlMessages id='security.permissions'/>
								</Label>
								<InputComponent
									id="permissions"
									errors={errors}
									control={control}
									name="permissions"
									componentType="custom"
									// @ts-ignore
									render={({ field }) => (
										<SelectAsyncPaginate<{ id: number, name: string }>
											{...field}
											isMulti
											defaultOptions
											getOptionValue={(option) => option.id}
											getOptionLabel={(option) => option.name}
											onFirstDataReady={options => {
												if (user.roles) {
													const defaultPermissions = options.filter(o => user.roles.map(r => r.permissions.includes(o.id))).map((i) => ({id: `${i.id}`, name: i.name, code: i.name}))
													if (defaultPermissions.length > 0)
														setValue('permissions', defaultPermissions)
												}
											}}
											placeholder={<IntlMessages id='security.permissions'/>}
											fetchData={async (page, pageSize, search) => await csuClient.security.permissions.getAll({
												page,
												pageSize,
												search
											})}
										/>
									)}
								/>
							</div>*/}

							<div className="col-sm-12 col-md-12">
								<ChecksInput
									isInline
									id='isActive'
									type='switch'
									name='isActive'
									errors={errors}
									control={control}
									isRequired={false}
									wrapperClassName='d-inline-block'
									label={<IntlMessages id='security.users.management.add.active'/>}
								/>
							</div>

							<div className="col-sm-12 col-md-12">
								<Button
									icon='Send'
									type='submit'
									color='primary'
									iconPosition='right'
									className="text-nowrap bg-gradient ms-2">
									<IntlMessages id='button.update' />
								</Button>
							</div>
						</div>

						<div className='row g-4' hidden={mode === 'normal'}>
							<div className="col-sm-12 col-md-10 hidePasswordUser">
								<InputComponent
									type={!showConfirmPassword ? 'password' : 'text'}
									errors={errors}
									control={control}
									name="newPassword"
									isRequired={false}
									label={<IntlMessages id='form.field.password.new' />}
								/>
								<span className="">
											<Button
												isLink
												isOutline
												color='dark'
												className=''
												onClick={() => {
													setShowConfirmPassword(!showConfirmPassword)
												}}>
													{!showConfirmPassword ? (
														<Visibility/>
													) : (
														<VisibilityOff/>
													)}
												</Button>
										</span>
							</div>
							<div className="col-sm-12 col-md-10 hidePasswordUser">
								<InputComponent
									type={!showPassword ? 'password' : 'text'}
									errors={errors}
									control={control}
									isRequired={false}
									name="confirmNewPassword"
									label={<IntlMessages id='form.field.password.new.confirmation' />}
								/>
								<span className="">
											<Button
												isLink
												isOutline
												color='dark'
												className=''
												onClick={() => {
													setShowPassword(!showPassword)
												}}>
													{!showPassword ? (
														<Visibility/>
													) : (
														<VisibilityOff/>
													)}
												</Button>
										</span>
							</div>
							<div className="col-sm-12 col-md-10">
								<Button
									icon='Send'
									type='submit'
									color='primary'
									iconPosition='right'
									className="text-nowrap bg-gradient ms-2">
									<IntlMessages id='button.update' />
								</Button>
							</div>
						</div>
					</form>
				</CardBody>
			</Card>
		</div>
	)
}

const AddOrUpdateWrapper = () => {
	const userId = useParams().id

	const [resource, setResource] = useState<FetchResource<UserListItem>>({
		loading: true,
		content: null,
		error: null,
	});

	const loadResource = () => {
		if (!userId)
			return;

		setResource({
			...resource,
			loading: true,
		});

		csuClient
			.security
			.users
			.getOne(userId)
			.then((res) => {
				const data = res.data.results;

				setResource({
					loading: false,
					content: data,
					error: null,
				});
			})
			.catch((error) => {
				setResource({
					loading: false,
					content: null,
					error,
				});
			});
	}

	const loadData = () => {
		loadResource();
	}

	useEffect(() => {
		if (userId) {
			loadData();
		}
	}, [userId]);

	const { loading, content, error } = resource;

	return (
		<PageWrapper metadata={metadata.dashboard.updateUser}>
			<SubHeader>
				<SubHeaderLeft>
					<Breadcrumb
						list={[
							{
								key: 'security.users.management',
								title: (<IntlMessages id='security.users.management' />),
								to: SECURITY.USERS.INDEX
							},
							{
								key: 'security.users.management.add',
								title: (<IntlMessages id='security.users.management.update' />),
								to: SECURITY.USERS.ADD
							},
						]}
					/>
				</SubHeaderLeft>
				{content && (
					<SubHeaderRight>
						<Button
							tag='a'
							size='sm'
							color='primary'
							icon='RemoveRedEye'
							to={joinUrlWithParamsId(SECURITY.USERS.DETAILS, content.id)}>
							<IntlMessages id='button.details' />
						</Button>
					</SubHeaderRight>
				)}
			</SubHeader>
			<Page className='px-sm-3'>
				<div className='row'>
					<div className='col-12'>
						{loading ? (
							<ContentSkeletonLoader />
						) : (!content || error) ? (
							<ErrorRequestComponent error={error} loadData={loadResource} />
						) : (
							<Update user={content} />
						)}
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default AddOrUpdateWrapper;
