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
import { hospitalClient } from "../HospitalClient";
import Button from "../../../components/bootstrap/Button";
import { HOSPITAL } from "../url/front";
import * as yupSchema from "../../../components/forms/yupShema";

type FormType = {
  address: string;
  email?: string;
  phone_number?: string;
  name: string;
};

const schema = yup.object().shape({
  address: YupShema.name,
  phone_number: yupSchema.phone,
  email: yupSchema.email,
  name: yupSchema.name,
});

const Add = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormType>({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<FormType> = (data) => {
    dispatch(setRequestGlobalLoader(true));

    hospitalClient
      .create(data)
      .then((res: any) => {
        navigate(HOSPITAL.INDEX);
        NotificationManager.success(globalT("hospital.add.success"));
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
                key: "hospital.management",
                title: <IntlMessages id="hospital.management" />,
                to: HOSPITAL.INDEX,
              },
              {
                key: "hospital.add",
                title: <IntlMessages id="hospital.add.title" />,
                to: HOSPITAL.ADD,
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
                  <IntlMessages id="hospital.add.title" />
                </CardTitle>
              </CardHeader>
              <CardBody>
                <form
                  className="row g-4 mx-3"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div className="row">
                    <div className="col-sm-6 ">
                      <InputComponent
                        name="name"
                        errors={errors}
                        control={control}
                        displayRequiredAsterisk
                        label={<IntlMessages id="form.field.name" />}
                      />
                    </div>
                    <div className="col-sm-6">
                      <InputComponent
                        name="address"
                        errors={errors}
                        control={control}
                        displayRequiredAsterisk
                        label={<IntlMessages id="form.field.address" />}
                      />
                    </div>
                  </div>

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
                              ) || <IntlMessages id="form.errors.phone.cmr" />,
                      }}
                    />
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
