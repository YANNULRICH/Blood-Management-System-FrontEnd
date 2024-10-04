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
import {CAMPAIGN} from "../url/front";
import Button from "../../../../components/bootstrap/Button";
import Page from "../../../../layout/Page/Page";
import {CampaignClient} from "../CampaignClient";
import Permissions from "../../../../commons/permissions";
import Donormodel from "../CampaignModel";
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
        CampaignClient
            .getAll(query);

    const refreshTable = () => {
        if (dataTableRef.current) {
            dataTableRef.current.refreshData();
        }
    }

    const handleDelete = () => {
        dispatch(setRequestGlobalLoader(true))

        CampaignClient
            .delete(boxManagement.data?.id as string)
            .then(() => {
                refreshTable()
                NotificationManager.success(globalT("campaign.delete.success"))
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
                                key: 'campaign',
                                title: (<IntlMessages id='campaign.management.title' />),
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
                        to={CAMPAIGN.ADD}>
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
                                    title: <IntlMessages id="campaign.management.title" />,
                                }}
                                emptyText={<IntlMessages id="campaign.list.empty" />}
                                getData={getData}
                                bindOnClickToDetails
                                forwardDataTableRef={_dataTableRef => {
                                    dataTableRef.current = _dataTableRef;
                                }}
                                actions={{
                                    edit: (rowData) => ({
                                        //hide: !ability.can(Permissions.documentCategory.change, Permissions),
                                        to: joinUrlWithParamsId(CAMPAIGN.UPDATE, rowData.id),
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
                                        field: 'startDate',
                                        title: <IntlMessages id='form.field.startDate' />,
                                        render: (item) => <span>{ dayjs(item.startDate).format("ll")}</span>
                                    },
                                    {
                                        field: 'endDate',
                                        title: <IntlMessages id='form.field.endDate' />,
                                        render: (item) => <span>{ dayjs(item.endDate).format("ll")}</span>
                                    },
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
                            message={globalT('campaign.delete.confirm')}
                            onCancel={() => setBoxManagement({ mode: 'create', show: false, data: null })}
                        />
                    )}
                </>
            </Page>
        </PageWrapper>
    );
};

export default List;