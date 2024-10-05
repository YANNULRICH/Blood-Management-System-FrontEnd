import * as yup from 'yup';
import React, { useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import { globalT } from '../../../lang';
import csuClient from '../../../network';
import { SubmitHandler, useForm } from 'react-hook-form';
import IntlMessages from '../../../components/IntlMessages';
import { useAppDispatch } from '../../../store/redux.types';
import * as yupSchema from '../../../components/forms/yupShema';
import InputComponent from '../../../components/forms/InputComponent';
import VisibilityGroup from '../../../commons/models/VisibilityGroup';
import DialogComponent from '../../../components/dialogs/DialogComponent';
import SelectFromRemote from '../../../components/forms/select/SelectFromRemote';
import NotificationManager from '../../../components/notifications/NotificationManager';
import { setRequestGlobalLoader } from '../../../store/slices/requestGlobalLoader/actions';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
	name: yupSchema.name,
});

type FormType = {
	name?: string
	description?: string
	districts?: Array<{ id: string, name: string, code: string }>
}

export type VisibilityGroupsAddOrUpdateProps = {
	show: boolean,
	mode: 'create' | 'edit',
	role: VisibilityGroup | null,
	onClose: (hasChanged: boolean) => void,
}

const VisibilityGroupsAddOrUpdate = ({ show, onClose, mode, role }: VisibilityGroupsAddOrUpdateProps) => {
	const dispatch = useAppDispatch();

	const {
		resetField,
		setValue,
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<FormType>({
		mode: 'onChange',
		resolver: yupResolver(schema),
	});

	useEffect(() => {
		if (mode === 'edit' && role) {
			setValue('name', role.name)
			setValue('description', role.description)
			setValue('districts', undefined)
		} else {
			setValue('name', "")
			setValue('description', "")
			setValue('districts', undefined)
		}
	}, [mode]);

	const resetForm = () => {
		resetField('name')
		resetField('description')
		resetField('districts')
	}

	const isFormValid = (data: FormType) => {
		if ( ! (Array.isArray(data.districts) && data.districts.length > 0) ) {
			NotificationManager.warning(globalT('security.groups.visibility.districts.required'));
			return false;
		}

		return true;
	};

	const onSubmit: SubmitHandler<FormType> = (data) => {
		if (!isFormValid(data))
			return;

		dispatch(setRequestGlobalLoader(true))

		if (mode === 'edit' && role) {
			csuClient
				.security
				.visibilityGroups
				.update(role.id, {
					name: data.name,
					description: data.description,
					districts: (data.districts || []).map(p => p.id)
				})
				.then(() => {
					onClose(true);
					resetForm();
				})
				.catch(() => null)
				.finally(() => dispatch(setRequestGlobalLoader(false)))
		} else {
			csuClient
				.security
				.visibilityGroups
				.create({
					name: data.name,
					slug: "fake",
					code: Math.random().toString(),
					description: data.description,
					districts: (data.districts || []).map(p => p.id)
				})
				.then(() => {
					onClose(true);
					resetForm();
				})
				.catch(() => null)
				.finally(() => dispatch(setRequestGlobalLoader(false)))
		}
	}

	return (
		<DialogComponent
			id="groups.visibility-add"
			size='lg'
			show={show}
			onClose={() => onClose(false)}
			title={(
				<IntlMessages
					id={mode === 'create' ? 'security.groups.visibility.add.title' : 'security.groups.visibility.update.title'}
					values={mode === 'create' ? undefined : { name: role?.name }}
				/>
			)}
			submitBtn={{
				onClick: handleSubmit(onSubmit)
			}}>
			<form className='row mx-2' onSubmit={handleSubmit(onSubmit)}>
				<div className="col-md-10 mb-4">
					<InputComponent
						name="name"
						errors={errors}
						control={control}
						displayRequiredAsterisk
						label={<IntlMessages id='form.field.name'/>}
					/>
				</div>

				<div className="col-md-10 mb-4">
					<InputComponent
						errors={errors}
						name="description"
						control={control}
						isRequired={false}
						displayRequiredAsterisk={false}
						label={<IntlMessages id='form.field.description' />}
					/>
				</div>

			</form>
		</DialogComponent>
	);
};

export default VisibilityGroupsAddOrUpdate;
