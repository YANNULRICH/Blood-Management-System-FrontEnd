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
import { HOSPITAL } from "../url/front";
import Button from "../../../components/bootstrap/Button";
import Page from "../../../layout/Page/Page";
import Permissions from "../../../commons/permissions";
import { useAppDispatch } from "../../../store/redux.types";
import HospitalModel from "../HospitalModel";
import { hospitalClient } from "../HospitalClient";

const List = () => {
  const dispatch = useAppDispatch();
  const ability = useContext(AbilityContext);

  const dataTableRef = useRef<DataTableRef<HospitalModel>>();
  const [boxManagement, setBoxManagement] = useState<{
    mode: "edit" | "create" | "delete";
    show: boolean;
    data: HospitalModel | null;
  }>({ mode: "create", show: false, data: null });

  const getData: DataQueryResultFunction<HospitalModel> = async (query) =>
    hospitalClient.getAll(query);

  const refreshTable = () => {
    if (dataTableRef.current) {
      dataTableRef.current.refreshData();
    }
  };

  const handleDelete = () => {
    dispatch(setRequestGlobalLoader(true));

    hospitalClient
      .delete(boxManagement.data?.id as string)
      .then(() => {
        refreshTable();
        NotificationManager.success(globalT("hospital.delete.success"));
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
                key: "hospital",
                title: <IntlMessages id="hospital.management.title" />,
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
            to={HOSPITAL.ADD}
          >
            <IntlMessages id="button.add" />
          </Button>
        </SubHeaderRight>
      </SubHeader>
      <Page>
        <>
          <div className="row px-sm-5">
            <div className="col-md-12">
              <DataTable<HospitalModel>
                heading={{
                  title: <IntlMessages id="hospital.management.title" />,
                }}
                emptyText={<IntlMessages id="hospital.list.empty" />}
                getData={getData}
                bindOnClickToDetails
                forwardDataTableRef={(_dataTableRef) => {
                  dataTableRef.current = _dataTableRef;
                }}
                actions={{
                  edit: (rowData) => ({
                    //hide: !ability.can(Permissions.documentCategory.change, Permissions),
                    to: joinUrlWithParamsId(HOSPITAL.UPDATE, rowData.id),
                  }),
                  delete: {
                    //hide: !ability.can(Permissions.documentCategory.delete, Permissions),
                    onClick: (_, item) =>
                      setBoxManagement({
                        mode: "delete",
                        show: true,
                        data: item as HospitalModel,
                      }),
                  },
                }}
                columns={[
                  {
                    field: "address",
                    title: <IntlMessages id="form.field.address" />,
                  },
                  {
                    field: "email",
                    title: <IntlMessages id="form.field.email" />,
                  },

                  {
                    field: "phoneNumber",
                    title: <IntlMessages id="form.field.phoneNumber" />,
                  },
                ]}
              />
            </div>
          </div>

          {boxManagement.mode === "delete" && boxManagement.show && (
            <DeleteConfirmBox
              launcher
              onConfirm={handleDelete}
              message={globalT("hospital.delete.confirm")}
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
