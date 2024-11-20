import React, { useRef, useState } from "react";
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
import { appUserClient } from "../AppUserClient";
import Button from "../../../components/bootstrap/Button";
import { APP_USER } from "../url/front";
import * as yupSchema from "../../../components/forms/yupShema";
import SelectFromRemote from "../../../components/forms/select/SelectFromRemote";
import { orderPharmacieClient } from "../../bigPharmOrder/OrderpharmacieClient";
import {
  Visibility,
  VisibilityOff,
} from "../../../components/icon/material-icons";
import { hospitalClient } from "../../hospital/HospitalClient";

type FormType = {
  name: string;
  surname?: string;
  sex?: string;
  phone_number: string;
  email?: string;
  password?: string;
  hospital: { id: string; name: string };
};

const schema = yup.object().shape({
  hospital: YupShema.objectDefault,
  phone_number: yupSchema.phone,
  email: yupSchema.email,
  name: yupSchema.name,
  surname: yupSchema.name,
  sex: yupSchema.name,
  password: yupSchema.password,
});

const Add = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [show, setShow] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormType>({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<FormType> = (data) => {
    dispatch(setRequestGlobalLoader(true));

    const requestBody = {
      hospital: data.hospital?.id,
      name: data.name,
      surname: data.surname,
      sex: data.sex,

      phone_number: data.phone_number,
      email: data.email,
      password: data.password,
    };

    appUserClient
      .create(requestBody)
      .then((res: any) => {
        navigate(APP_USER.INDEX);
        NotificationManager.success(globalT("APP_USER.add.success"));
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
                key: "APP_USER.management",
                title: <IntlMessages id="APP_USER.management" />,
                to: APP_USER.INDEX,
              },
              {
                key: "APP_USER.add",
                title: <IntlMessages id="APP_USER.add.title" />,
                to: APP_USER.ADD,
              },
            ]}
          />
        </SubHeaderLeft>
      </SubHeader>
      <Page className="px-sm-3">
        <div className="row">
          <div className="col-12">
            <Card>
              <CardHeader>
                <CardTitle tag="h3">
                  <IntlMessages id="APP_USER.add.title" />
                </CardTitle>
              </CardHeader>
              <CardBody>
                <form
                  className="row g-4 mx-3"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div className="row mx-3">
                    <div className="col-sm-6 ">
                      <InputComponent
                        name="name"
                        errors={errors}
                        control={control}
                        displayRequiredAsterisk
                        label={<IntlMessages id="form.field.name" />}
                      />
                    </div>

                    <div className="col-sm-6 ">
                      <InputComponent
                        name="surname"
                        errors={errors}
                        control={control}
                        displayRequiredAsterisk
                        label={<IntlMessages id="form.field.surname" />}
                      />
                    </div>
                  </div>

                  <div className="row mx-3 mt-4">
                    <div className="col-sm-6">
                      <SelectFromRemote
                        // isMulti
                        name="hospital"
                        errors={errors}
                        control={control}
                        watchValue={null}
                        setValue={setValue}
                        componentType="select"
                        displayRequiredAsterisk
                        getOptionValue={(option) => option.id}
                        getOptionLabel={(option) => option.name}
                        fetchData={() => hospitalClient.getAll()}
                        label={<IntlMessages id="id.hospital" />}
                        emptyListText={{ id: "hospital.list.empty" }}
                        placeholder={<IntlMessages id="id.hospital" />}
                      />
                    </div>

                    <div className="col-sm-6">
                      <InputComponent
                        name="sex"
                        errors={errors}
                        control={control}
                        displayRequiredAsterisk
                        label={<IntlMessages id="form.field.sex" />}
                      />
                    </div>
                  </div>

                  <div className="row mx-3 my-4">
                    <div className="col-sm-12 col-md-6">
                      <InputComponent
                        name="email"
                        type="email"
                        errors={errors}
                        control={control}
                        displayRequiredAsterisk
                        label={<IntlMessages id="form.field.email" />}
                        otherValidators={{
                          validate: (val: string | undefined) =>
                            yupSchema.email.isValidSync(val) || (
                              <IntlMessages id="form.errors.email" />
                            ),
                        }}
                      />
                    </div>

                    <div className="col-sm-12 col-md-6">
                      <InputComponent
                        name="phone_number"
                        errors={errors}
                        control={control}
                        displayRequiredAsterisk
                        label={<IntlMessages id="form.field.phoneNumber" />}
                        otherValidators={{
                          validate: (val: string | undefined) =>
                            !val
                              ? true
                              : yupSchema.regex.cameroonPhoneNumber.test(
                                  val || ""
                                ) || (
                                  <IntlMessages id="form.errors.phone.cmr" />
                                ),
                        }}
                      />
                    </div>
                  </div>

                  <div className="col-6 hidePassword mt-4">
                    <InputComponent
                      name="password"
                      errors={errors}
                      control={control}
                      helperLabel={<IntlMessages id="form.field.password" />}
                      type={!show ? "password" : "text"}
                    />
                    <span className="">
                      <Button
                        isLink
                        isOutline
                        color="dark"
                        className=""
                        onClick={() => {
                          setShow(!show);
                        }}
                      >
                        {!show ? <Visibility /> : <VisibilityOff />}
                      </Button>
                    </span>
                  </div>

                  <div className="col-sm-12 col-md-10">
                    <Button
                      icon="Save"
                      type="submit"
                      color="primary"
                      // iconPosition='right'
                      className="text-nowrap bg-gradient ms-2"
                    >
                      <IntlMessages id="button.save" />
                    </Button>
                  </div>
                </form>
              </CardBody>
            </Card>
          </div>
        </div>
      </Page>
    </PageWrapper>
  );
};

export default Add;
