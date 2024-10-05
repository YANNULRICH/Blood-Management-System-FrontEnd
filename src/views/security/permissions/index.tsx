import React, { useRef } from 'react';
import csuClient from '../../../network';
import Page from '../../../layout/Page/Page';
import metadata from '../../../commons/data/metadata';
import DataTable from '../../../components/DataTable';
import Permission from '../../../commons/models/Permission';
import IntlMessages from '../../../components/IntlMessages';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import { DataQueryResultFunction, DataTableRef } from '../../../components/DataTable/types';

const Permissions = () => {
	const dataTableRef = useRef<DataTableRef<Permission>>();

	const getData: DataQueryResultFunction<Permission> = async (query) =>
		csuClient
			.security
			.permissions
			.getAll(query);

	return (
		<PageWrapper metadata={metadata.dashboard.permissions}>
			<Page>
				<div className='row px-3'>
					<div className="col-md-12">
						<DataTable<Permission>
							heading={{
								title: <IntlMessages id="security.permissions" />,
							}}
							emptyText={<IntlMessages id="security.permissions.empty" />}
							getData={getData}
							forwardDataTableRef={_dataTableRef => {
								dataTableRef.current = _dataTableRef;
							}}
							actions={{ }}
							bindOnClickToDetails={false}
							columns={[
								{
									field: 'id',
									title: <IntlMessages id='form.field.id' />,
								},
								{
									field: 'name',
									title: <IntlMessages id='form.field.name' />,
								},
								{
									field: 'code',
									title: <IntlMessages id='form.field.code' />,
								},
							]}
						/>
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default Permissions;
