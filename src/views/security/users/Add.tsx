import * as yup from 'yup';
import React, {useRef, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';

import { globalT } from '../../../lang';
import csuClient from '../../../network';
import Page from '../../../layout/Page/Page';
import metadata from '../../../commons/data/metadata';
import { SECURITY } from '../../../commons/urls/front';
import Button from '../../../components/bootstrap/Button';
import { useAppDispatch } from '../../../store/redux.types';
import IntlMessages from '../../../components/IntlMessages';
import * as yupSchema from '../../../components/forms/yupShema';
import ChecksInput from '../../../components/forms/ChecksInput';
import Breadcrumb from '../../../components/bootstrap/Breadcrumb';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import InputComponent from '../../../components/forms/InputComponent';
import { ChecksGroup } from '../../../components/bootstrap/forms/Checks';
import { joinUrlWithParamsId } from '../../../commons/helpers/funcHelper';
import SubHeader, { SubHeaderLeft } from '../../../layout/SubHeader/SubHeader';
import SelectFromRemote from '../../../components/forms/select/SelectFromRemote';
import NotificationManager from '../../../components/notifications/NotificationManager';
import { setRequestGlobalLoader } from '../../../store/slices/requestGlobalLoader/actions';
import Card, {CardBody, CardHeader, CardLabel, CardSubTitle, CardTitle} from '../../../components/bootstrap/Card';
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
	password: yupSchema.password,
	confirmPassword: yupSchema.password,
})

type FormType = {
	firstName?: string
	lastName?: string
	gender?: 'M' | 'F'
	registerNumber?: string
	phoneNumber?: string
	email?: string
	password?: string
	confirmPassword?: string
	isActive?: boolean
	roles?: Array<{ id: string, name: string, code: string }>
	visibilityGroups?: Array<{ id: string, name: string, code: string }>
	permissions?: Array<{ id: string, name: string, code: string }>
	region?: { id: number, name: string },
	department?: { id: number, name: string },
	district?: { id: number, name: string },
	fosa?: { id: number, name: string },
	userType?: string,
	regionalFund?: { id: string, name: string },
	isFixePosition?: boolean | null | undefined,
	isOcs?: boolean | null | undefined
}

const Add = () => {
	const navigate = useNavigate()
	const dispatch = useAppDispatch()
	const [showPassword, setShowPassword] = useState<boolean>(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
	const isPositionFixe = useRef<boolean | null | undefined>(false)
	const is_ocs = useRef<boolean | null | undefined>(false)

	const {
		setError,
		setValue,
		watch,
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<FormType>({
		mode: 'onChange',
		resolver: yupResolver(schema),
	});

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

		if (data.password !== data.confirmPassword) {
			isValid = false
			const message = globalT('form.errors.password.confirmation.long')
			errors.push((shouldFocus) => setError("password", { type: "custom", message }, { shouldFocus }));
		}

		if (errors.length > 0)
			errors.forEach((fn, index) => {
				if (index === 0)
					fn(true)
				else fn(false)
			});

		return isValid;
	};

	isPositionFixe.current = watch('isFixePosition');
	is_ocs.current = watch('isOcs');


	const onSubmit: SubmitHandler<FormType> = (data) => {
		if (!isFormValid(data))
			return;

		dispatch(setRequestGlobalLoader(true))

		const _data: Record<string, any> = {
			lastName: data.lastName,
			firstName: data.firstName,
			gender: data.gender,
			phoneNumber: data.phoneNumber,
			registerNumber: data.registerNumber || undefined,
			email: data.email,
			password: data.password,
			isActive: Boolean(data.isActive),
			groups: (data.roles || []).map(p => p.id),
			visibilityGroups: (data.visibilityGroups || []).map(p => p.id),
			userPermissions: (data.permissions || []).map(p => p.id),
			userType: data.userType,
			regional_fund: data.regionalFund?.id,
			healthArea: data.fosa?.id,
			is_ocs: is_ocs.current ? true : false
		}

		csuClient
			.security
			.users
			.create(_data)
			.then((res) => {
				navigate(joinUrlWithParamsId(SECURITY.USERS.DETAILS, res.data.results.id))
			})
			.catch(() => null)
			.finally(() => dispatch(setRequestGlobalLoader(false)))
	}

	return (
		<PageWrapper metadata={metadata.dashboard.addUser}>
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
								title: (<IntlMessages id='security.users.management.add' />),
								to: SECURITY.USERS.ADD
							},
						]}
					/>
				</SubHeaderLeft>
			</SubHeader>
			<Page className='px-sm-3'>
				<div className='row'>
					<div className='col-12'>
						<Card>
							<CardHeader>
								<CardTitle tag='h3'>
									<IntlMessages id='metadata.users.add.title' />
								</CardTitle>
							</CardHeader>
							<CardBody>
								<form className='row g-4 mx-3' onSubmit={handleSubmit(onSubmit)}>

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
									</div>

									<div className="col-sm-12 col-md-10">
										<div className='row no-gutters'>
											<div className='col hidePasswordUser'>
												<InputComponent
													type={!showPassword ? 'password' : 'text'}
													name="password"
													errors={errors}
													control={control}
													label={<IntlMessages id='form.field.password' />}
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
											<div className='col hidePasswordUser'>
												<InputComponent
													type={!showConfirmPassword? 'password' : 'text'}
													errors={errors}
													control={control}
													name="confirmPassword"
													label={<IntlMessages id='form.field.password.confirmation' />}
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
										</div>
									</div><br/>

									<div className="col-md-10 mb-2">
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
													defaultAdditional ={{page: 1, pageSize: 50}}
													defaultOptions
													getOptionValue={(option) => option.id}
													getOptionLabel={(option) => option.name}
													placeholder={<IntlMessages id='security.permissions'/>}
													fetchData={async (page, pageSize, search) => await csuClient.security.permissions.getAll({
														page,
														pageSize,
														search
													})}
												/>
											)}
										/>
									</div>

									<div className="col-sm-12 col-md-10">
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
											fetchData={() => csuClient.security.permissions.getAll({page_size:700})}
											label={<IntlMessages id='security.permissions'/>}
											placeholder={<IntlMessages id='security.permissions'/>}
										/>
									</div>

									<div className="col-sm-12 col-md-10">
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

									<div className="col-sm-12 col-md-10">
										<Button
											icon='Save'
											type='submit'
											color='primary'
											// iconPosition='right'
											className="text-nowrap bg-gradient ms-2">
											<IntlMessages id='button.save' />
										</Button>
									</div>

								</form>
							</CardBody>
						</Card>
					</div>
				</div>
			</Page>
		</PageWrapper>
	)
}

export default Add;
