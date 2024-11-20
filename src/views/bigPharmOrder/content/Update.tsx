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
import { orderPharmacieClient } from "../OrderpharmacieClient";
import Button from "../../../components/bootstrap/Button";
import Spinner from "../../../components/bootstrap/Spinner";
import SelectFromRemote from "../../../components/forms/select/SelectFromRemote";
import DragAndDrop, { FileItem } from "../../../components/DragAndDrop";
import { bloodTypeClient } from "../../blood/bloodType/BloodTypeClient";
import csuClient from "../../../network";
import OrderBloodModel from "../OrderPharmacieModel";
import { ORDER_BLOOD } from "../url/front";


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
  const pharmacyId = useParams().id;
  const [pharmacy, setpharmacy] = useState<OrderBloodModel | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormType>({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const loadpharmacyById = () => {
    orderPharmacieClient
      .getOne(pharmacyId as string)
      .then((resp) => {
        const data = resp.data.results;
        // @ts-ignore
        reset({
          users: data.users,
          blood_type: data.blood_type,
          command_number: data.commandNumber,
          code: data.code,
          quantity: data.quantity,
        });
        // reset({name: data.name, nameEn: data.nameEn, description: data.description, tags: data.tags.map(t => t.name).join(", ")})
        setpharmacy(data);
      })
      .catch(() => {
        return null;
      });
  };

  useEffect(() => {
    loadpharmacyById();
  }, []);

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
        NotificationManager.success(globalT("pharmacyBig.add.success"));
        // navigate(joinUrlWithParamsId(ADMINISTRATION.USER.INDEX, res.data.results.id))
      })
      .catch(() => null)
      .finally(() => dispatch(setRequestGlobalLoader(false)));
  };

  return (
    <PageWrapper>
      {pharmacy ? (
        <Page className="px-sm-3">
          <div className="row">
            <div className="col-12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h3">
                    <IntlMessages id="pharmacy.update.title" />
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
                          fetchData={() => csuClient.security.users.getAll()}
                          label={<IntlMessages id="pharm" />}
                          emptyListText={{ id: "pharm.list.empty" }}
                          placeholder={<IntlMessages id="pharm" />}
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
                          displayRequiredAsterisk
                          getOptionValue={(option) => option.id}
                          getOptionLabel={(option) => option.name}
                          fetchData={() => bloodTypeClient.getAll()}
                          label={<IntlMessages id="big.pharm" />}
                          emptyListText={{ id: "blood_type.list.empty" }}
                          placeholder={<IntlMessages id="big.pharm" />}
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
                          label={<IntlMessages id="form.field.horaire" />}
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
      ) : (
        <Spinner size="3rem" color="primary" />
      )}
    </PageWrapper>
  );
};

export default Add;
