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
import {BLOOD_BAD} from "../url/front";
import Button from "../../../../components/bootstrap/Button";
import Page from "../../../../layout/Page/Page";
import {bloodBadClient} from "../BloodBadClient";
import Permissions from "../../../../commons/permissions";
import BloodBadModel from "../BloodBadModel";

const List = () => {

    const dispatch = useAppDispatch();
    const ability = useContext(AbilityContext);

    const dataTableRef = useRef<DataTableRef<BloodBadModel>>();
    const [boxManagement, setBoxManagement] = useState<{
        mode: 'edit' | 'create' | 'delete',
        show: boolean,
        data: BloodBadModel | null
    }>({ mode: 'create', show: false, data: null });

    const getData: DataQueryResultFunction<BloodBadModel> = async (query) =>
        bloodBadClient
            .getAll(query);

    const refreshTable = () => {
        if (dataTableRef.current) {
            dataTableRef.current.refreshData();
        }
    }

    const handleDelete = () => {
        dispatch(setRequestGlobalLoader(true))

        bloodBadClient
            .delete(boxManagement.data?.id as string)
            .then(() => {
                refreshTable()
                NotificationManager.success(globalT("bloodBag.delete.success"))
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
                                key: 'bloodBag',
                                title: (<IntlMessages id='bloodBag.management.title' />),
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
                        to={BLOOD_BAD.ADD}>
                        <IntlMessages id='button.add' />
                    </Button>
                </SubHeaderRight>

            </SubHeader>
            <Page>
                <>
                    <div className='row px-sm-5'>
                        <div className="col-md-12">
                            <DataTable<BloodBadModel>
                                heading={{
                                    title: <IntlMessages id="bloodBag.management.title" />,
                                }}
                                emptyText={<IntlMessages id="bloodBag.list.empty" />}
                                getData={getData}
                                bindOnClickToDetails
                                forwardDataTableRef={_dataTableRef => {
                                    dataTableRef.current = _dataTableRef;
                                }}
                                actions={{
                                    edit: (rowData) => ({
                                        //hide: !ability.can(Permissions.documentCategory.change, Permissions),
                                        to: joinUrlWithParamsId(BLOOD_BAD.UPDATE, rowData.id),
                                    }),
                                    delete: {
                                        //hide: !ability.can(Permissions.documentCategory.delete, Permissions),
                                        onClick: (_, item) => setBoxManagement({ mode: 'delete', show: true, data: item as BloodBadModel })
                                    }
                                }}
                                columns={[
                                    {
                                        field: 'code',
                                        title: <IntlMessages id='form.field.code' />,
                                    },
                                     {
                                         field: 'quantity',
                                         title: <IntlMessages id='form.field.quantity' />,
                                     },
                                    /*{
                                        field: 'bloodBank',
                                        title: <IntlMessages id='form.field.quantity' />,
                                        render: (item) => <span>{item.bloodBank.code}</span>
                                    },
                                    {
                                        field: 'bloodType',
                                        title: <IntlMessages id='form.field.quantity' />,
                                        render: (item) => <span>{item.bloodBank.code}</span>
                                    },*/
                                ]}
                            />
                        </div>
                    </div>

                    {boxManagement.mode === 'delete' && boxManagement.show && (
                        <DeleteConfirmBox
                            launcher
                            onConfirm={handleDelete}
                            message={globalT('bloodBag.delete.confirm')}
                            onCancel={() => setBoxManagement({ mode: 'create', show: false, data: null })}
                        />
                    )}
                </>
            </Page>
        </PageWrapper>
    );
};

export default List;