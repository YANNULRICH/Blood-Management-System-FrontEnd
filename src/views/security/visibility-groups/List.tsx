import React, { useContext, useRef, useState } from 'react';
import { globalT } from '../../../lang';
import csuClient from '../../../network';
import Page from '../../../layout/Page/Page';
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
import VisibilityGroup from '../../../commons/models/VisibilityGroup';
import VisibilityGroupsAddOrUpdate from './VisibilityGroupsAddOrUpdate';
import DeleteConfirmBox from '../../../components/dialogs/DeleteConfirmBox';
import { setRequestGlobalLoader } from '../../../store/slices/requestGlobalLoader/actions';
import { DataQueryResultFunction, DataTableRef } from '../../../components/DataTable/types';
import SubHeader, { SubHeaderLeft, SubHeaderRight } from '../../../layout/SubHeader/SubHeader';
import {useNavigate} from "react-router-dom";
import {joinUrlWithParamsId} from "../../../commons/helpers/funcHelper";

const VisibilityGroups = () => {
    const dispatch = useAppDispatch();
    const ability = useContext(AbilityContext)

    const dataTableRef = useRef<DataTableRef<VisibilityGroup>>();
    const [boxManagement, setBoxManagement] = useState<{
        mode: 'edit' | 'create' | 'delete',
        show: boolean,
        data: VisibilityGroup | null
    }>({ mode: 'create', show: false, data: null });
    const navigate = useNavigate()

    const getData: DataQueryResultFunction<VisibilityGroup> = async (query) =>
        csuClient
            .security
            .visibilityGroups
            .getAll(query);

    const refreshTable = () => {
        if (dataTableRef.current) {
            dataTableRef.current.refreshData();
        }
    }

    const handleOnAddClose = (hasChanged: boolean) => {
        if (hasChanged) {
            refreshTable()
        }

        setBoxManagement({ data: null, mode: 'create', show: false });
    }

    const handleDelete = () => {
        dispatch(setRequestGlobalLoader(true))

        csuClient
            .security
            .roles
            .delete(boxManagement.data?.id as string)
            .then(() => {
                refreshTable()
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
                            { key: 'security.groups.visibility', title: (<IntlMessages id='security.groups.visibility' />), to: DASHBOARD.INDEX },
                        ]}
                    />
                </SubHeaderLeft>

                {ability.can(Permissions.security.visibilityGroups.add, Permissions) && (
                    <SubHeaderRight>
                        <Button
                            size='sm'
                            icon='Add'
                            color='primary'
                            onClick={() => navigate(SECURITY.VISIBILITY_GROUPS.ADD)}>
                            <IntlMessages id='button.add' />
                        </Button>
                    </SubHeaderRight>
                )}
            </SubHeader>
            <Page>
                <>
                    <div className='row px-sm-5'>
                        <div className="col-md-12">
                            <DataTable<VisibilityGroup>
                                heading={{
                                    title: <IntlMessages id="security.groups.visibility" />,
                                }}
                                emptyText={<IntlMessages id="security.groups.visibility.list.empty" />}
                                getData={getData}
                                forwardDataTableRef={_dataTableRef => {
                                    dataTableRef.current = _dataTableRef;
                                }}
                                actions={{
                                    edit: (rowData) => ({
                                        hide: !ability.can(Permissions.security.visibilityGroups.change, Permissions),
                                        to: joinUrlWithParamsId(SECURITY.VISIBILITY_GROUPS.UPDATE, rowData.id),
                                    }),
                                    delete: {
                                        hide: !ability.can(Permissions.security.visibilityGroups.delete, Permissions),
                                        onClick: (_, item) => setBoxManagement({ mode: 'delete', show: true, data: item as VisibilityGroup })
                                    }
                                }}
                                columns={[
                                    {
                                        field: 'name',
                                        title: <IntlMessages id='form.field.name' />,
                                    },

                                ]}
                            />
                        </div>
                    </div>

                    {boxManagement.mode === 'delete' && boxManagement.show && (
                        <DeleteConfirmBox
                            launcher
                            onConfirm={handleDelete}
                            message={globalT('security.groups.visibility.delete.confirm')}
                            onCancel={() => setBoxManagement({ mode: 'create', show: false, data: null })}
                        />
                    )}

                    <VisibilityGroupsAddOrUpdate
                        role={boxManagement.data}
                        mode={boxManagement.mode === 'create' ? 'create' : 'edit'}
                        show={boxManagement.mode !== 'delete' && boxManagement.show}
                        onClose={handleOnAddClose}
                    />
                </>
            </Page>
        </PageWrapper>
    );
};

export default VisibilityGroups;
