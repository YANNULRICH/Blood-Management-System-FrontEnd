import React, {useRef, useState} from 'react';
import {setRequestGlobalLoader} from "../../../../store/slices/requestGlobalLoader/actions";
import {useNavigate} from "react-router-dom";
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


type FormType = {
    code: string
    quantity?: string,
    bloodGroup?: string,
}

const schema = yup.object().shape({
    name: YupShema.name,
})

const Add = () => {

    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormType>({
        mode: 'onChange',
        resolver: yupResolver(schema),
    });

    const onSubmit: SubmitHandler<FormType> = (data) => {
        dispatch(setRequestGlobalLoader(true))

        bloodBankClient
            .create(data)
            .then((res) => {
                navigate(BLOOD_BANK.INDEX)
                NotificationManager.success(globalT('bloodBank.add.success'))
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
                                title: (<IntlMessages id='blood.management' />),
                                to:   BLOOD_BANK.INDEX
                            },
                            {
                                key: 'bloodBank.add',
                                title: (<IntlMessages id='blood.add.title' />),
                                to: BLOOD_BANK.ADD
                            },
                        ]}
                    />
                </SubHeaderLeft>
            </SubHeader>
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
        </PageWrapper>
    );
};

export default Add;