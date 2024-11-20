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
import {BLOOD_BANK} from "../url/front";
import Button from "../../../../components/bootstrap/Button";
import Page from "../../../../layout/Page/Page";
import {bloodBankClient} from "../BloodBankClient";
import Permissions from "../../../../commons/permissions";
import BloodModel from "../BloodBankModel";

const List = () => {

    const dispatch = useAppDispatch();
    const ability = useContext(AbilityContext);

    const dataTableRef = useRef<DataTableRef<BloodModel>>();
    const [boxManagement, setBoxManagement] = useState<{
        mode: 'edit' | 'create' | 'delete',
        show: boolean,
        data: BloodModel | null
    }>({ mode: 'create', show: false, data: null });

    const getData: DataQueryResultFunction<BloodModel> = async (query) =>
        bloodBankClient
            .getAll(query);

    const refreshTable = () => {
        if (dataTableRef.current) {
            dataTableRef.current.refreshData();
        }
    }

    const handleDelete = () => {
        dispatch(setRequestGlobalLoader(true))

        bloodBankClient
            .delete(boxManagement.data?.id as string)
            .then(() => {
                refreshTable()
                NotificationManager.success(globalT("bloodBank.delete.success"))
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
                                key: 'bloodBank',
                                title: (<IntlMessages id='bloodBank.management.title' />),
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
                        to={BLOOD_BANK.ADD}>
                        <IntlMessages id='button.add' />
                    </Button>
                </SubHeaderRight>

            </SubHeader>
            <Page>
                <>
                    <div className='row px-sm-5'>
                        <div className="col-md-12">
                            <DataTable<BloodModel>
                                heading={{
                                    title: <IntlMessages id="bloodBank.management.title" />,
                                }}
                                emptyText={<IntlMessages id="bloodBank.list.empty" />}
                                getData={getData}
                                bindOnClickToDetails
                                forwardDataTableRef={_dataTableRef => {
                                    dataTableRef.current = _dataTableRef;
                                }}
                                actions={{
                                    edit: (rowData) => ({
                                        //hide: !ability.can(Permissions.documentCategory.change, Permissions),
                                        to: joinUrlWithParamsId(BLOOD_BANK.UPDATE, rowData.id),
                                    }),
                                    delete: {
                                        //hide: !ability.can(Permissions.documentCategory.delete, Permissions),
                                        onClick: (_, item) => setBoxManagement({ mode: 'delete', show: true, data: item as BloodModel })
                                    }
                                }}
                                columns={[
                                    {
                                        field: 'code',
                                        title: <IntlMessages id='form.field.code' />,
                                    },
                                     {
                                         field: 'name',
                                         title: <IntlMessages id='form.field.name' />,
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
                            message={globalT('bloodBank.delete.confirm')}
                            onCancel={() => setBoxManagement({ mode: 'create', show: false, data: null })}
                        />
                    )}
                </>
            </Page>
        </PageWrapper>
    );
};

export default List;