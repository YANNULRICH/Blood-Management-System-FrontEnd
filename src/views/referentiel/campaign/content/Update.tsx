import React, {useEffect, useRef, useState} from 'react';
import {setRequestGlobalLoader} from "../../../../store/slices/requestGlobalLoader/actions";
import {useNavigate, useParams} from "react-router-dom";
import * as yup from 'yup'
import {yupResolver} from "@hookform/resolvers/yup";
import * as yupSchema from '../../../../components/forms/yupShema';


import * as YupShema from '../../../../components/forms/yupShema'
import Card, {CardBody, CardHeader, CardTitle} from "../../../../components/bootstrap/Card";
import Breadcrumb from "../../../../components/bootstrap/Breadcrumb";
import IntlMessages from "../../../../components/IntlMessages";
import SubHeader, {SubHeaderLeft} from "../../../../layout/SubHeader/SubHeader";
import PageWrapper from "../../../../layout/PageWrapper/PageWrapper";
import Page from "../../../../layout/Page/Page";
import NotificationManager from "../../../../components/notifications/NotificationManager";
import {globalT} from "../../../../lang";
import {SubmitHandler, useForm} from "react-hook-form";
import {useAppDispatch} from "../../../../store/redux.types";
import InputComponent from "../../../../components/forms/InputComponent";
import {CampaignClient} from "../CampaignClient";
import Button from "../../../../components/bootstrap/Button";
import {CAMPAIGN} from "../url/front";
import BloodModel from "../CampaignModel";
import Spinner from "../../../../components/bootstrap/Spinner";
import ChecksInput from "../../../../components/forms/ChecksInput";
import SelectFromRemote from "../../../../components/forms/select/SelectFromRemote";
import {ChecksGroup} from "../../../../components/bootstrap/forms/Checks";
import Visibility from "../../../../components/icon/material-icons/Visibility";
import VisibilityOff from "../../../../components/icon/material-icons/VisibilityOff";
import dayjs from "dayjs";

type FormType = {
    name: string
    email: string,
    startDate: string,
    endDate: string,
}

const schema = yup.object().shape({
    name: YupShema.name,
    email: YupShema.email,
})

const Add = () => {

    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const documentTypeId = useParams().id
    const [documenttype, setdocumentType] = useState<BloodModel | null>(null)

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormType>({
        mode: 'onChange',
        resolver: yupResolver(schema),
    });

    const loadBloodTypeById = () => {
        CampaignClient.getOne(documentTypeId as string)
            .then((resp) => {
                const data = resp.data.results
                //reset({code: data.code, quantity: data.quantity})
                setdocumentType(data)
            })
            .catch(() => {
                return null
            })
    }

    useEffect(() => {
        loadBloodTypeById()
    }, [])


    const onSubmit: SubmitHandler<FormType> = (data) => {
        dispatch(setRequestGlobalLoader(true))

        const dataSend = {
            name: data.name,
            start_date: dayjs(data.startDate).format("") ,
            end_date: dayjs(data.endDate).format("") ,
            email: data.email,
        }

        CampaignClient
            .update(documentTypeId as string, dataSend)
            .then((res) => {
                navigate(CAMPAIGN.INDEX)
                NotificationManager.success(globalT('campaign.update.success'))
                // navigate(joinUrlWithParamsId(ADMINISTRATION.USER.INDEX, res.data.results.id))
            })
            .catch(() => null)
            .finally(() => dispatch(setRequestGlobalLoader(false)))
    }

    return (
        <PageWrapper>
            <SubHeader>
                <SubHeaderLeft>
                    <Breadcrumb
                        list={[
                            {
                                key: 'campaign.management',
                                title: (<IntlMessages id='campaign.management' />),
                                to:   CAMPAIGN.INDEX
                            },
                            {
                                key: 'document-categories.add',
                                title: (<IntlMessages id='campaign.update.title' />),
                                to: CAMPAIGN.ADD
                            },
                        ]}
                    />
                </SubHeaderLeft>
            </SubHeader>
            {documenttype ? (
                <Page className='px-sm-3'>
                    <div className='row'>
                        <div className='col-12'>
                            <Card>
                                <CardHeader>
                                    <CardTitle tag='h3'>
                                        <IntlMessages id='campaign.update.title' />
                                    </CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <form className='row g-4 mx-3' onSubmit={handleSubmit(onSubmit)}>
                                        <div className='col-sm-6 '>
                                            <InputComponent
                                                name="name"
                                                errors={errors}
                                                control={control}
                                                displayRequiredAsterisk
                                                label={<IntlMessages id='form.field.name'/>}
                                            />
                                        </div>


                                        <div className="col-6">
                                            <InputComponent
                                                errors={errors}
                                                type={"date"}
                                                control={control}
                                                name="startDate"
                                                displayRequiredAsterisk
                                                label={
                                                    <IntlMessages id="form.field.startDate" />
                                                }
                                            />
                                        </div>

                                        <div className="col-6">
                                            <InputComponent
                                                errors={errors}
                                                type={"date"}
                                                control={control}
                                                name="endDate"
                                                displayRequiredAsterisk
                                                label={
                                                    <IntlMessages id="form.field.endDate" />
                                                }
                                            />
                                        </div>

                                        <div className="col-sm-6 col-md-6">
                                            <InputComponent
                                                name="email"
                                                type="email"
                                                errors={errors}
                                                control={control}
                                                displayRequiredAsterisk
                                                label={<IntlMessages id='form.field.email'/>}
                                                otherValidators={{
                                                    validate: (val: string | undefined) => yupSchema.email.isValidSync(val)
                                                        || (<IntlMessages id="form.errors.email" />)
                                                }}
                                            />
                                        </div>

                                        <div className="col-sm-12 col-md-10">
                                            <Button
                                                icon='Save'
                                                type='submit'
                                                color='primary'
                                                // iconPosition='right'
                                                className="text-nowrap bg-gradient ms-2">
                                                <IntlMessages id='button.save' />
                                            </Button>
                                        </div>

                                    </form>
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                </Page>
            ) : (
                <Spinner size='3rem' color='primary' />
            )}

        </PageWrapper>
    );
};

export default Add;