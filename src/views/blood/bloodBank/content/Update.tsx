import React, {useEffect, useRef, useState} from 'react';
import {setRequestGlobalLoader} from "../../../../store/slices/requestGlobalLoader/actions";
import {useNavigate, useParams} from "react-router-dom";
import * as yup from 'yup'
import {yupResolver} from "@hookform/resolvers/yup";


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
import {bloodBankClient} from "../BloodBankClient";
import Button from "../../../../components/bootstrap/Button";
import {BLOOD_BANK} from "../url/front";
import BloodModel from "../BloodBankModel";
import Spinner from "../../../../components/bootstrap/Spinner";
import ChecksInput from "../../../../components/forms/ChecksInput";
import SelectFromRemote from "../../../../components/forms/select/SelectFromRemote";

type FormType = {
    code: string
    quantity?: string,
}

const schema = yup.object().shape({
    name: YupShema.name,
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
        bloodBankClient.getOne(documentTypeId as string)
            .then((resp) => {
                const data = resp.data.results
                reset({code: data.code, quantity: data.quantity})
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

        bloodBankClient
            .update(documentTypeId as string, data)
            .then((res) => {
                navigate(BLOOD_BANK.INDEX)
                NotificationManager.success(globalT('bloodBank.update.success'))
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
                                key: 'bloodBank.management',
                                title: (<IntlMessages id='bloodBank.management' />),
                                to:   BLOOD_BANK.INDEX
                            },
                            {
                                key: 'document-categories.add',
                                title: (<IntlMessages id='bloodBank.update.title' />),
                                to: BLOOD_BANK.ADD
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
                                        <IntlMessages id='bloodBank.add.title' />
                                    </CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <form className='row g-4 mx-3' onSubmit={handleSubmit(onSubmit)}>
                                        <div className='col-sm-12 '>
                                            <InputComponent
                                                name="quantity"
                                                errors={errors}
                                                control={control}
                                                displayRequiredAsterisk
                                                label={<IntlMessages id='form.field.quantity'/>}
                                            />
                                        </div>

                                        <div className='col-sm-12 '>
                                            <InputComponent
                                                name="code"
                                                errors={errors}
                                                control={control}
                                                displayRequiredAsterisk
                                                label={<IntlMessages id='form.field.code'/>}
                                            />
                                        </div>

                                        <div className='col-sm-12 '>
                                            <InputComponent
                                                name="bloodGroup"
                                                errors={errors}
                                                control={control}
                                                displayRequiredAsterisk
                                                label={<IntlMessages id='form.field.bloodGroup'/>}
                                            />
                                        </div>

                                        <div className='col-sm-12 '>
                                            <InputComponent
                                                name="description"
                                                errors={errors}
                                                control={control}
                                                required={false}
                                                componentType="textarea"
                                                label={<IntlMessages id='form.field.description'/>}
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