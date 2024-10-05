import React, { useContext, useRef, useState } from "react";
import DataTable from "../../../components/DataTable";
import SubHeader, {
  SubHeaderLeft,
  SubHeaderRight,
} from "../../../layout/SubHeader/SubHeader";
import DeleteConfirmBox from "../../../components/dialogs/DeleteConfirmBox";
import {
  DataQueryResultFunction,
  DataTableRef,
} from "../../../components/DataTable/types";
import IntlMessages from "../../../components/IntlMessages";
import { setRequestGlobalLoader } from "../../../store/slices/requestGlobalLoader/actions";
import { AbilityContext } from "../../../commons/permissions/Can";
import { joinUrlWithParamsId } from "../../../commons/helpers/funcHelper";
import { DASHBOARD } from "../../../commons/urls/front";
import PageWrapper from "../../../layout/PageWrapper/PageWrapper";
import NotificationManager from "../../../components/notifications/NotificationManager";
import { globalT } from "../../../lang";
import Breadcrumb from "../../../components/bootstrap/Breadcrumb";
import { ORDER_BLOOD } from "../url/front";
import Button from "../../../components/bootstrap/Button";
import Page from "../../../layout/Page/Page";
import Permissions from "../../../commons/permissions";
import { useAppDispatch } from "../../../store/redux.types";
import { orderPharmacieClient } from "../OrderpharmacieClient";
import OrderBloodModel from "../OrderPharmacieModel";

const List = () => {
  const dispatch = useAppDispatch();
  const ability = useContext(AbilityContext);

  const dataTableRef = useRef<DataTableRef<OrderBloodModel>>();
  const [boxManagement, setBoxManagement] = useState<{
    mode: "edit" | "create" | "delete";
    show: boolean;
    data: OrderBloodModel | null;
  }>({ mode: "create", show: false, data: null });

  const getData: DataQueryResultFunction<OrderBloodModel> = async (query) =>
    orderPharmacieClient.getAll(query);

  const refreshTable = () => {
    if (dataTableRef.current) {
      dataTableRef.current.refreshData();
    }
  };

  const handleDelete = () => {
    dispatch(setRequestGlobalLoader(true));

    orderPharmacieClient
      .delete(boxManagement.data?.id as string)
      .then(() => {
        refreshTable();
        NotificationManager.success(globalT("order.blood.delete.success"));
        setBoxManagement({ data: null, mode: "create", show: false });
      })
      .catch(() =>
        setBoxManagement({ data: null, mode: "create", show: false })
      )
      .finally(() => dispatch(setRequestGlobalLoader(false)));
  };

  return (
    <PageWrapper>
      <SubHeader>
        <SubHeaderLeft>
          <Breadcrumb
            list={[
              {
                key: "order.blood",
                title: <IntlMessages id="order.blood.management.title" />,
                to: DASHBOARD.INDEX,
              },
            ]}
          />
        </SubHeaderLeft>
        <SubHeaderRight>
          <Button
            tag="a"
            size="sm"
            icon="Add"
            color="primary"
            to={ORDER_BLOOD.ADD}
          >
            <IntlMessages id="button.add" />
          </Button>
        </SubHeaderRight>
      </SubHeader>
      <Page>
        <>
          <div className="row px-sm-5">
            <div className="col-md-12">
              <DataTable<OrderBloodModel>
                heading={{
                  title: <IntlMessages id="order.blood.management.title" />,
                }}
                emptyText={<IntlMessages id="order.blood.list.empty" />}
                getData={getData}
                bindOnClickToDetails
                forwardDataTableRef={(_dataTableRef) => {
                  dataTableRef.current = _dataTableRef;
                }}
                actions={{
                  edit: (rowData) => ({
                    //hide: !ability.can(Permissions.documentCategory.change, Permissions),
                    to: joinUrlWithParamsId(ORDER_BLOOD.UPDATE, rowData.id),
                  }),
                  delete: {
                    //hide: !ability.can(Permissions.documentCategory.delete, Permissions),
                    onClick: (_, item) =>
                      setBoxManagement({
                        mode: "delete",
                        show: true,
                        data: item as OrderBloodModel,
                      }),
                  },
                }}
                columns={[
                  {
                    field: "commandNumber",
                    title: <IntlMessages id="form.field.commandNumber" />,
                  },
                  {
                    field: "quantity",
                    title: <IntlMessages id="form.field.quantity" />,
                  },

                  {
                    field: "users",
                    title: <IntlMessages id="form.field.users" />,
                    render: (item) => {

                      console.log("item", item)
                      return (
                        <span>
                          {
                            // @ts-ignore
                            item.first_name
                          }
                        </span>
                      );
                    },
                  },

                  {
                    field: "blood_type",
                    title: <IntlMessages id="form.field.blood_type" />,
                    render: (item) => {
                      return (
                        <span>
                          {
                            // @ts-ignore
                            item.code
                          }
                        </span>
                      );
                    },
                  },
                ]}
              />
            </div>
          </div>

          {boxManagement.mode === "delete" && boxManagement.show && (
            <DeleteConfirmBox
              launcher
              onConfirm={handleDelete}
              message={globalT("order.blood.delete.confirm")}
              onCancel={() =>
                setBoxManagement({ mode: "create", show: false, data: null })
              }
            />
          )}
        </>
      </Page>
    </PageWrapper>
  );
};

export default List;
