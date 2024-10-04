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
import { APP_USER } from "../url/front";
import Button from "../../../components/bootstrap/Button";
import Page from "../../../layout/Page/Page";
import Permissions from "../../../commons/permissions";
import { useAppDispatch } from "../../../store/redux.types";
import APP_USERModel from "../AppUserModel";
import { appUserClient } from "../AppUserClient";

const List = () => {
  const dispatch = useAppDispatch();
  const ability = useContext(AbilityContext);

  const dataTableRef = useRef<DataTableRef<APP_USERModel>>();
  const [boxManagement, setBoxManagement] = useState<{
    mode: "edit" | "create" | "delete";
    show: boolean;
    data: APP_USERModel | null;
  }>({ mode: "create", show: false, data: null });

  const getData: DataQueryResultFunction<APP_USERModel> = async (query) =>
    appUserClient.getAll(query);

  const refreshTable = () => {
    if (dataTableRef.current) {
      dataTableRef.current.refreshData();
    }
  };

  const handleDelete = () => {
    dispatch(setRequestGlobalLoader(true));

    appUserClient
      .delete(boxManagement.data?.id as string)
      .then(() => {
        refreshTable();
        NotificationManager.success(globalT("APP_USER.delete.success"));
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
                key: "APP_USER",
                title: <IntlMessages id="APP_USER.management.title" />,
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
            to={APP_USER.ADD}
          >
            <IntlMessages id="button.add" />
          </Button>
        </SubHeaderRight>
      </SubHeader>
      <Page>
        <>
          <div className="row px-sm-5">
            <div className="col-md-12">
              <DataTable<APP_USERModel>
                heading={{
                  title: <IntlMessages id="APP_USER.management.title" />,
                }}
                emptyText={<IntlMessages id="APP_USER.list.empty" />}
                getData={getData}
                bindOnClickToDetails
                forwardDataTableRef={(_dataTableRef) => {
                  dataTableRef.current = _dataTableRef;
                }}
                actions={{
                  edit: (rowData) => ({
                    //hide: !ability.can(Permissions.documentCategory.change, Permissions),
                    to: joinUrlWithParamsId(APP_USER.UPDATE, rowData.id),
                  }),
                  delete: {
                    //hide: !ability.can(Permissions.documentCategory.delete, Permissions),
                    onClick: (_, item) =>
                      setBoxManagement({
                        mode: "delete",
                        show: true,
                        data: item as APP_USERModel,
                      }),
                  },
                }}
                columns={[
                  {
                    field: "name",
                    title: <IntlMessages id="form.field.name" />,
                  },
                  {
                    field: "surname",
                    title: <IntlMessages id="form.field.surname" />,
                  },
                  {
                    field: "email",
                    title: <IntlMessages id="form.field.email" />,
                  },

                  {
                    field: "phoneNumber",
                    title: <IntlMessages id="form.field.phoneNumber" />,
                  },
                  {
                    field: "sex",
                    title: <IntlMessages id="form.field.sex" />,
                  },
                ]}
              />
            </div>
          </div>

          {boxManagement.mode === "delete" && boxManagement.show && (
            <DeleteConfirmBox
              launcher
              onConfirm={handleDelete}
              message={globalT("APP_USER.delete.confirm")}
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
