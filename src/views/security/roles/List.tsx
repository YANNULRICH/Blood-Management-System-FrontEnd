import React, { useContext, useRef, useState } from 'react';

import { globalT } from '../../../lang';
import csuClient from '../../../network';
import Page from '../../../layout/Page/Page';
import Role from '../../../commons/models/Role';
import DataTable from '../../../components/DataTable';
import metadata from '../../../commons/data/metadata';
import Permissions from '../../../commons/permissions';
import {DASHBOARD, SECURITY} from '../../../commons/urls/front';
import Button from '../../../components/bootstrap/Button';
import IntlMessages from '../../../components/IntlMessages';
import { useAppDispatch } from '../../../store/redux.types';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Breadcrumb from '../../../components/bootstrap/Breadcrumb';
import { AbilityContext } from '../../../commons/permissions/Can';
import DeleteConfirmBox from '../../../components/dialogs/DeleteConfirmBox';
import { setRequestGlobalLoader } from '../../../store/slices/requestGlobalLoader/actions';
import { DataQueryResultFunction, DataTableRef } from '../../../components/DataTable/types';
import SubHeader, { SubHeaderLeft, SubHeaderRight } from '../../../layout/SubHeader/SubHeader';
import {useNavigate} from "react-router-dom";
import {joinUrlWithParamsId} from "../../../commons/helpers/funcHelper";

const Roles = () => {
    const dispatch = useAppDispatch();
    const ability = useContext(AbilityContext);
    const navigate = useNavigate()

    const dataTableRef = useRef<DataTableRef<Role>>();
    const [boxManagement, setBoxManagement] = useState<{
        mode: 'edit' | 'create' | 'delete',
        show: boolean,
        data: Role | null
    }>({ mode: 'create', show: false, data: null });

    const getData: DataQueryResultFunction<Role> = async (query) =>
        csuClient
            .security
            .roles
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
            .delete(boxManagement.data?.id?.toFixed() as string)
            .then(() => {
                refreshTable()
                setBoxManagement({ data: null, mode: 'create', show: false });
            })
            .catch(() => setBoxManagement({ data: null, mode: 'create', show: false }))
            .finally(() => dispatch(setRequestGlobalLoader(false)))
    }

    return (
        <PageWrapper metadata={metadata.dashboard.roles}>
            <SubHeader>
                <SubHeaderLeft>
                    <Breadcrumb
                        list={[
                            { key: 'advertisers', title: (<IntlMessages id='security.roles' />), to: DASHBOARD.INDEX },
                        ]}
                    />
                </SubHeaderLeft>
                {ability.can(Permissions.security.roles.add, Permissions) && (
                    <SubHeaderRight>
                        <Button
                            size='sm'
                            icon='Add'
                            color='primary'
                            onClick={() => navigate(SECURITY.ROLES.ADD)}>
                            <IntlMessages id='button.add' />
                        </Button>
                    </SubHeaderRight>
                )}
            </SubHeader>
            <Page>
                <>
                    <div className='row px-sm-5'>
                        <div className="col-md-12">
                            <DataTable<Role>
                                heading={{
                                    title: <IntlMessages id="security.roles" />,
                                }}
                                emptyText={<IntlMessages id="security.roles.list.empty" />}
                                getData={getData}
                                forwardDataTableRef={_dataTableRef => {
                                    dataTableRef.current = _dataTableRef;
                                }}
                                actions={{
                                    edit: (rowData) => ({
                                        hide: !ability.can(Permissions.security.roles.change, Permissions),
                                        to: joinUrlWithParamsId(SECURITY.ROLES.UPDATE, rowData.id),
                                    }),
                                    delete: {
                                        hide: !ability.can(Permissions.security.roles.delete, Permissions),
                                        onClick: (_, item) => setBoxManagement({ mode: 'delete', show: true, data: item as Role })
                                    }
                                }}
                                columns={[
                                    {
                                        field: 'name',
                                        title: <IntlMessages id='form.field.name' />,
                                    },
                                    {
                                        field: 'permissions',
                                        title: <IntlMessages id='security.permissions.count' />,
                                        render: (rowData) => (
                                            <strong>{rowData.permissions.length}</strong>
                                        )
                                    },
                                ]}
                            />
                        </div>
                    </div>

                    {boxManagement.mode === 'delete' && boxManagement.show && (
                        <DeleteConfirmBox
                            launcher
                            onConfirm={handleDelete}
                            message={globalT('security.roles.delete.confirm')}
                            onCancel={() => setBoxManagement({ mode: 'create', show: false, data: null })}
                        />
                    )}

                    {/*<RoleAddOrUpdate*/}
                    {/*    role={boxManagement.data}*/}
                    {/*    mode={boxManagement.mode === 'create' ? 'create' : 'edit'}*/}
                    {/*    show={boxManagement.mode !== 'delete' && boxManagement.show}*/}
                    {/*    onClose={handleOnAddClose}*/}
                    {/*/>*/}
                    {/*<Add/>*/}
                </>
            </Page>
        </PageWrapper>
    );
};

export default Roles;
