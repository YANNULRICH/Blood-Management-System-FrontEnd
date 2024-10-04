import React, { useEffect, useRef, useState } from "react";
import { setRequestGlobalLoader } from "../../../store/slices/requestGlobalLoader/actions";
import { useNavigate, useParams } from "react-router-dom";
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
import { HOSPITAL } from "../url/front";
import Spinner from "../../../components/bootstrap/Spinner";
import ChecksInput from "../../../components/forms/ChecksInput";
import SelectFromRemote from "../../../components/forms/select/SelectFromRemote";
import { hospitalClient } from "../HospitalClient";
import HospitalModel from "../HospitalModel";
import * as yupSchema from "../../../components/forms/yupShema";

type FormType = {
  address: string;
  email?: string;
  phoneNumber?: string;
  name: string;
};

const schema = yup.object().shape({
  address: YupShema.name,
  phoneNumber: yupSchema.phone,
  email: yupSchema.email,
  name: yupSchema.name,
});

const Add = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const hospitalId = useParams().id;
  const [hospit, sethospit] = useState<HospitalModel | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormType>({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const loadhospitalById = () => {
    hospitalClient
      .getOne(hospitalId as string)
      .then((resp) => {
        const data = resp.data.results;
        reset({
          address: data.address,
          email: data.email,
          name: data.name,
          phoneNumber: data.phoneNumber,
        });
        sethospit(data);
      })
      .catch(() => {
        return null;
      });
  };

  useEffect(() => {
    loadhospitalById();
  }, []);

  const onSubmit: SubmitHandler<FormType> = (data) => {
    dispatch(setRequestGlobalLoader(true));

    hospitalClient
      .update(hospitalId as string, data)
      .then((res: any) => {
        navigate(HOSPITAL.INDEX);
        NotificationManager.success(globalT("hospital.update.success"));
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
                key: "document-categories.add",
                title: <IntlMessages id="hospital.update.title" />,
                to: HOSPITAL.ADD,
              },
            ]}
          />
        </SubHeaderLeft>
      </SubHeader>
      {hospit ? (
        <Page className="px-sm-3">
          <div className="row">
            <div className="col-12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h3">
                    <IntlMessages id="hospital.update.title" />
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
      ) : (
        <Spinner size="3rem" color="primary" />
      )}
    </PageWrapper>
  );
};

export default Add;
