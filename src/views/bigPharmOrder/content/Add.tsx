import React, { useRef, useState, useEffect } from "react";
import { setRequestGlobalLoader } from "../../../store/slices/requestGlobalLoader/actions";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import * as YupShema from "../../../components/forms/yupShema";
import Card, {
  CardBody,
  CardHeader,
  CardTitle,
} from "../../../components/bootstrap/Card";
import Breadcrumb from "../../../components/bootstrap/Breadcrumb";
import IntlMessages from "../../../components/IntlMessages";
import SubHeader, { SubHeaderLeft } from "../../../layout/SubHeader/SubHeader";
import PageWrapper from "../../../layout/PageWrapper/PageWrapper";
import Page from "../../../layout/Page/Page";
import NotificationManager from "../../../components/notifications/NotificationManager";
import { globalT } from "../../../lang";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAppDispatch } from "../../../store/redux.types";
import InputComponent from "../../../components/forms/InputComponent";
import Button from "../../../components/bootstrap/Button";
import { ORDER_BLOOD } from "../url/front";
import DragAndDrop, { FileItem } from "../../../components/DragAndDrop";
import SelectFromRemote from "../../../components/forms/select/SelectFromRemote";
import ChecksInput from "../../../components/forms/ChecksInput";
import { orderPharmacieClient } from "../OrderpharmacieClient";
import { bloodTypeClient } from "../../blood/bloodType/BloodTypeClient";
import csuClient from "../../../network";
import { appUserClient } from "../../appUser/AppUserClient";

type FormType = {
  users?: { id: string; name: string };
  blood_type?: { id: string; name: string };
  command_number?: string;
  code?: string;
  quantity?: string;
};

const schema = yup.object().shape({
  blood_type: YupShema.objectDefault,
  command_number: YupShema.numberDefault,
  users: YupShema.objectDefault,
  quantity: YupShema.name,
  code: YupShema.name,
});

const Add = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<FormType>({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<FormType> = (data) => {
    const requestBody = {
      users: data.users?.id,
      blood_type: data.blood_type?.id,
      command_number: data.command_number,
      code: data.code,
      quantity: data.quantity,
    };
    dispatch(setRequestGlobalLoader(true));
    orderPharmacieClient
      .create(requestBody)
      .then((res) => {
        navigate(ORDER_BLOOD.INDEX);
        NotificationManager.success(globalT("order.blood.add.success"));
        // navigate(joinUrlWithParamsId(ADMINISTRATION.USER.INDEX, res.data.results.id))
      })
      .catch(() => null)
      .finally(() => dispatch(setRequestGlobalLoader(false)));
  };

  return (
    <PageWrapper>
      <SubHeader>
        <SubHeaderLeft>
          <Breadcrumb
            list={[
              {
                key: "order.blood.management",
                title: <IntlMessages id="order.blood.management" />,
                to: ORDER_BLOOD.INDEX,
              },
              {
                key: "order.blood.add",
                title: <IntlMessages id="order.blood.add.title" />,
                to: ORDER_BLOOD.ADD,
              },
            ]}
          />
        </SubHeaderLeft>
      </SubHeader>
      <div style={{ marginTop: "9vh" }}>
        <Page className="px-sm-3">
          <div className="row">
            <div className="col-12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h3">
                    <IntlMessages id="order.blood.add.title" />
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <form
                    className="row g-4 mx-3"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <div className="row mt-4">
                      <div className="col-sm-6">
                        <SelectFromRemote
                          // isMulti
                          name="users"
                          errors={errors}
                          control={control}
                          watchValue={null}
                          setValue={setValue}
                          componentType="select"
                          displayRequiredAsterisk
                          getOptionValue={(option) => option.id}
                          getOptionLabel={(option) => option.name}
                          fetchData={() => appUserClient.getAll()}
                          label={<IntlMessages id="users" />}
                          emptyListText={{ id: "users.list.empty" }}
                          placeholder={<IntlMessages id="users" />}
                        />
                      </div>
                      <div className="col-sm-6">
                        <SelectFromRemote
                          // isMulti
                          name="blood_type"
                          errors={errors}
                          control={control}
                          watchValue={null}
                          setValue={setValue}
                          componentType="select"
                          mapItemsToOptions={(item: any) => ({
                            id: item.id,
                            name: item.code,
                          })}
                          getOptionValue={(option) => option.id}
                          getOptionLabel={(option) => option.name}
                          fetchData={() => bloodTypeClient.getAll()}
                          label={<IntlMessages id="id.blood_type" />}
                          emptyListText={{ id: "blood_type.list.empty" }}
                          placeholder={<IntlMessages id="id.blood_type" />}
                        />
                      </div>
                    </div>

                    <div className="row mt-4">
                      <div className="col-sm-6">
                        <InputComponent
                          name="quantity"
                          errors={errors}
                          control={control}
                          displayRequiredAsterisk
                          label={<IntlMessages id="form.field.quantity" />}
                        />
                      </div>

                      <div className="col-sm-6">
                        <InputComponent
                          name="command_number"
                          errors={errors}
                          control={control}
                          displayRequiredAsterisk
                          label={
                            <IntlMessages id="form.field.command_number" />
                          }
                        />
                      </div>
                    </div>

                    <div className="row mt-4">
                      <div className="col-sm-6">
                        <InputComponent
                          name="code"
                          errors={errors}
                          control={control}
                          displayRequiredAsterisk
                          label={<IntlMessages id="form.field.code" />}
                        />
                      </div>
                    </div>

                    <div className="row" style={{ marginTop: "4vh" }}>
                      <div className=" d-flex justify-content-center">
                        <div>
                          <Button
                            // icon="Save"
                            type="submit"
                            color="primary"
                            size="sm"
                            // iconPosition='right'
                            className="text-nowrap bg-gradient ms-2"
                          >
                            <IntlMessages id="button.Envoye" />
                          </Button>
                        </div>
                        <div>
                          <Button
                            // icon="Save"
                            type="submit"
                            color="light"
                            size="sm"
                            onClick={() => reset()}
                            // iconPosition='right'
                            className="text-nowrap bg-gradient ms-2"
                          >
                            <IntlMessages id="button.reset" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </form>
                </CardBody>
              </Card>
            </div>
          </div>
        </Page>
      </div>
    </PageWrapper>
  );
};

export default Add;
