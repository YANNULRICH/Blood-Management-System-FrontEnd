import React, { useContext, useRef, useState } from 'react';
import { globalT } from '../../../lang';
import csuClient from '../../../network';
import Page from '../../../layout/Page/Page';
import DataTable from '../../../components/DataTable';
import metadata from '../../../commons/data/metadata';
import UserList from '../../../commons/models/UserList';
import Button from '../../../components/bootstrap/Button';
import IntlMessages from '../../../components/IntlMessages';
import { useAppDispatch } from '../../../store/redux.types';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import { DASHBOARD, SECURITY } from '../../../commons/urls/front';
import Breadcrumb from '../../../components/bootstrap/Breadcrumb';
import { joinUrlWithParamsId } from '../../../commons/helpers/funcHelper';
import DeleteConfirmBox from '../../../components/dialogs/DeleteConfirmBox';
import NotificationManager from '../../../components/notifications/NotificationManager';
import { setRequestGlobalLoader } from '../../../store/slices/requestGlobalLoader/actions';
import { DataQueryResultFunction, DataTableRef } from '../../../components/DataTable/types';
import SubHeader, { SubHeaderLeft, SubHeaderRight } from '../../../layout/SubHeader/SubHeader';
import { AbilityContext } from '../../../commons/permissions/Can';
import Permissions from '../../../commons/permissions';

const UsersList = () => {
	const dispatch = useAppDispatch();
	const ability = useContext(AbilityContext);

	const dataTableRef = useRef<DataTableRef<UserList>>();
	const [boxManagement, setBoxManagement] = useState<{
		mode: 'edit' | 'create' | 'delete',
		show: boolean,
		data: UserList | null
	}>({ mode: 'create', show: false, data: null });

	const getData: DataQueryResultFunction<UserList> = async (query) =>
		csuClient
			.security
			.users
			.getAll(query);

	const refreshTable = () => {
		if (dataTableRef.current) {
			dataTableRef.current.refreshData();
		}
	}

	const handleDelete = () => {
		dispatch(setRequestGlobalLoader(true))

		csuClient
			.security
			.roles
			.delete(boxManagement.data?.id as string)
			.then(() => {
				refreshTable()
				NotificationManager.success(globalT("security.users.management.delete.success"))
				setBoxManagement({ data: null, mode: 'create', show: false });
			})
			.catch(() => setBoxManagement({ data: null, mode: 'create', show: false }))
			.finally(() => dispatch(setRequestGlobalLoader(false)))
	}

	return (
		<PageWrapper metadata={metadata.dashboard.visibilityGroups}>
			<SubHeader>
				<SubHeaderLeft>
					<Breadcrumb
						list={[
							{
								key: 'security.users.management',
								title: (<IntlMessages id='security.users.management' />),
								to: DASHBOARD.INDEX
							},
						]}
					/>
				</SubHeaderLeft>
				{/*{ability.can(Permissions.security.users.add, Permissions) && (
					<SubHeaderRight>
						<Button
							tag='a'
							size='sm'
							icon='Add'
							color='primary'
							to={SECURITY.USERS.ADD}>
							<IntlMessages id='button.add' />
						</Button>
					</SubHeaderRight>
				)}*/}
			</SubHeader>
			<Page>
				<>
					<div className='row px-sm-5'>
						<div className="col-md-12">
							<DataTable<UserList>
								heading={{
									title: <IntlMessages id="security.users.management" />,
								}}
								emptyText={<IntlMessages id="security.users.management.list.empty" />}
								getData={getData}
								/*bindOnClickToDetails
								getRowLink={rowData => joinUrlWithParamsId(SECURITY.USERS.DETAILS, rowData.id)}*/
								forwardDataTableRef={_dataTableRef => {
									dataTableRef.current = _dataTableRef;
								}}
								actions={{
									/*edit: (rowData) => ({
										hide: !ability.can(Permissions.security.users.change, Permissions),
										to: joinUrlWithParamsId(SECURITY.USERS.UPDATE, rowData.id),
									}),*/
									delete: {
										hide: !ability.can(Permissions.security.users.delete, Permissions),
										onClick: (_, item) => setBoxManagement({ mode: 'delete', show: true, data: item as UserList })
									}
								}}
								columns={[
									{
										field: 'email',
										title: <IntlMessages id='form.field.email' />,
									},
								]}
							/>
						</div>
					</div>

					{boxManagement.mode === 'delete' && boxManagement.show && (
						<DeleteConfirmBox
							launcher
							onConfirm={handleDelete}
							message={globalT('security.users.management.delete.confirm')}
							onCancel={() => setBoxManagement({ mode: 'create', show: false, data: null })}
						/>
					)}
				</>
			</Page>
		</PageWrapper>
	);
};

export default UsersList;
