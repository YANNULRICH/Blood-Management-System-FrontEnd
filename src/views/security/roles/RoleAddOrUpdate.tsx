import * as yup from 'yup';
import React, { useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import { globalT } from '../../../lang';
import csuClient from '../../../network';
import Role from '../../../commons/models/Role';
import { SubmitHandler, useForm } from 'react-hook-form';
import IntlMessages from '../../../components/IntlMessages';
import { useAppDispatch } from '../../../store/redux.types';
import Label from '../../../components/bootstrap/forms/Label';
import * as yupSchema from '../../../components/forms/yupShema';
import InputComponent from '../../../components/forms/InputComponent';
import DialogComponent from '../../../components/dialogs/DialogComponent';
import SelectAsyncPaginate from '../../../components/forms/select/SelectAsyncPaginate';
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
	permissions?: Array<{ id: number, name: string }>
}

export type RoleAddOrUpdateProps = {
	show: boolean,
	mode: 'create' | 'edit',
	role: Role | null,
	onClose: (hasChanged: boolean) => void,
}

const RoleAddOrUpdate = ({ show, onClose, mode, role }: RoleAddOrUpdateProps) => {
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
			setValue('permissions', undefined)
		} else {
			setValue('name', "")
			setValue('permissions', undefined)
		}
	}, [mode]);

	const resetForm = () => {
		resetField('name')
		resetField('permissions')
	}

	const isFormValid = (data: FormType) => {
		if ( ! (Array.isArray(data.permissions) && data.permissions.length > 0) ) {
			NotificationManager.warning(globalT('security.permissions.required'));
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
				.roles
				.update(role.id.toString(), { name: data.name, permissions: (data.permissions || []).map(p => p.id) })
				.then(() => {
					onClose(true);
					resetForm();
				})
				.catch(() => null)
				.finally(() => dispatch(setRequestGlobalLoader(false)))
		} else {
			csuClient
				.security
				.roles
				.create({ name: data.name, permissions: (data.permissions || []).map(p => p.id) })
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
			id="role-add"
			size='lg'
			show={show}
			onClose={() => onClose(false)}
			title={(
				<IntlMessages
					id={mode === 'create' ? 'security.roles.add.title' : 'security.roles.update.title'}
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
						label={<IntlMessages id='form.field.name'/>}
					/>
				</div>

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
								defaultOptions
								getOptionValue={(option) => option.id}
								getOptionLabel={(option) => option.name}
								onFirstDataReady={options => {
									if (role) {
										const defaultPermissions = options.filter(o => role.permissions.includes(o.id))
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
				</div>

			</form>
		</DialogComponent>
	);
};

export default RoleAddOrUpdate;
