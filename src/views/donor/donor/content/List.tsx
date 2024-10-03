import React, {useContext, useRef, useState} from 'react';
import DataTable from "../../../../components/DataTable";
import SubHeader, {SubHeaderLeft, SubHeaderRight} from "../../../../layout/SubHeader/SubHeader";
import DeleteConfirmBox from "../../../../components/dialogs/DeleteConfirmBox";
import {DataQueryResultFunction, DataTableRef} from "../../../../components/DataTable/types";
import IntlMessages from "../../../../components/IntlMessages";
import {setRequestGlobalLoader} from "../../../../store/slices/requestGlobalLoader/actions";
import {AbilityContext} from "../../../../commons/permissions/Can";
import {joinUrlWithParamsId} from "../../../../commons/helpers/funcHelper";
import {DASHBOARD} from "../../../../commons/urls/front";
import PageWrapper from "../../../../layout/PageWrapper/PageWrapper";
import NotificationManager from "../../../../components/notifications/NotificationManager";
import {globalT} from "../../../../lang";
import Breadcrumb from "../../../../components/bootstrap/Breadcrumb";
import {useAppDispatch} from "../../../../store/redux.types";
import {DONOR} from "../url/front";
import Button from "../../../../components/bootstrap/Button";
import Page from "../../../../layout/Page/Page";
import {donorClient} from "../DonorClient";
import Permissions from "../../../../commons/permissions";
import Donormodel from "../DonorModel";
import dayjs from "dayjs";

const List = () => {

    const dispatch = useAppDispatch();
    const ability = useContext(AbilityContext);

    const dataTableRef = useRef<DataTableRef<Donormodel>>();
    const [boxManagement, setBoxManagement] = useState<{
        mode: 'edit' | 'create' | 'delete',
        show: boolean,
        data: Donormodel | null
    }>({ mode: 'create', show: false, data: null });

    const getData: DataQueryResultFunction<Donormodel> = async (query) =>
        donorClient
            .getAll(query);

    const refreshTable = () => {
        if (dataTableRef.current) {
            dataTableRef.current.refreshData();
        }
    }

    const handleDelete = () => {
        dispatch(setRequestGlobalLoader(true))

        donorClient
            .delete(boxManagement.data?.id as string)
            .then(() => {
                refreshTable()
                NotificationManager.success(globalT("donor.delete.success"))
                setBoxManagement({ data: null, mode: 'create', show: false });
            })
            .catch(() => setBoxManagement({ data: null, mode: 'create', show: false }))
            .finally(() => dispatch(setRequestGlobalLoader(false)))
    }

    return (
        <PageWrapper >
            <SubHeader>
                <SubHeaderLeft>
                    <Breadcrumb
                        list={[
                            {
                                key: 'donor',
                                title: (<IntlMessages id='donor.management.title' />),
                                to: DASHBOARD.INDEX
                            },
                        ]}
                    />
                </SubHeaderLeft>
                <SubHeaderRight>
                    <Button
                        tag='a'
                        size='sm'
                        icon='Add'
                        color='primary'
                        to={DONOR.ADD}>
                        <IntlMessages id='button.add' />
                    </Button>
                </SubHeaderRight>

            </SubHeader>
            <Page>
                <>
                    <div className='row px-sm-5'>
                        <div className="col-md-12">
                            <DataTable<Donormodel>
                                heading={{
                                    title: <IntlMessages id="donor.management.title" />,
                                }}
                                emptyText={<IntlMessages id="donor.list.empty" />}
                                getData={getData}
                                bindOnClickToDetails
                                forwardDataTableRef={_dataTableRef => {
                                    dataTableRef.current = _dataTableRef;
                                }}
                                actions={{
                                    edit: (rowData) => ({
                                        //hide: !ability.can(Permissions.documentCategory.change, Permissions),
                                        to: joinUrlWithParamsId(DONOR.UPDATE, rowData.id),
                                    }),
                                    delete: {
                                        //hide: !ability.can(Permissions.documentCategory.delete, Permissions),
                                        onClick: (_, item) => setBoxManagement({ mode: 'delete', show: true, data: item as Donormodel })
                                    }
                                }}
                                columns={[
                                    {
                                        field: 'name',
                                        title: <IntlMessages id='form.field.name' />,
                                    },
                                     {
                                         field: 'surname',
                                         title: <IntlMessages id='form.field.surname' />,
                                     },
                                    {
                                        field: 'sex',
                                        title: <IntlMessages id='form.field.gender' />,
                                    },
                                    {
                                        field: 'phoneNumber',
                                        title: <IntlMessages id='form.field.phoneNumber' />,
                                    },
                                    {
                                        field: 'date',
                                        title: <IntlMessages id='form.field.date' />,
                                        render: (item) => <span>{ dayjs(item.date).format("ll")}</span>
                                    },
                                    {
                                        field: 'email',
                                        title: <IntlMessages id='form.field.email' />,
                                    },
                                    {
                                        field: 'bloodGroup',
                                        title: <IntlMessages id='form.field.bloodGroup' />,
                                    },
                                ]}
                            />
                        </div>
                    </div>

                    {boxManagement.mode === 'delete' && boxManagement.show && (
                        <DeleteConfirmBox
                            launcher
                            onConfirm={handleDelete}
                            message={globalT('donor.delete.confirm')}
                            onCancel={() => setBoxManagement({ mode: 'create', show: false, data: null })}
                        />
                    )}
                </>
            </Page>
        </PageWrapper>
    );
};

export default List;