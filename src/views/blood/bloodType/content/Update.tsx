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
import {bloodTypeClient} from "../BloodTypeClient";
import Button from "../../../../components/bootstrap/Button";
import {BLOOD_TYPE} from "../url/front";
import BloodTypeModel from "../BloodTypeModel";
import Spinner from "../../../../components/bootstrap/Spinner";
import ChecksInput from "../../../../components/forms/ChecksInput";
import SelectFromRemote from "../../../../components/forms/select/SelectFromRemote";

type FormType = {
    code: string
    quantity?: string,
}

const schema = yup.object().shape({
    quantity: YupShema.name,
})

const Add = () => {

    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const documentTypeId = useParams().id
    const [documenttype, setdocumentType] = useState<BloodTypeModel | null>(null)

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
        bloodTypeClient.getOne(documentTypeId as string)
            .then((resp) => {
                const data = resp.data.results
                reset({code: data.code})
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

        bloodTypeClient
            .update(documentTypeId as string, data)
            .then((res) => {
                navigate(BLOOD_TYPE.INDEX)
                NotificationManager.success(globalT('bloodType.update.success'))
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
                                key: 'bloodType.management',
                                title: (<IntlMessages id='bloodType.management' />),
                                to:   BLOOD_TYPE.INDEX
                            },
                            {
                                key: 'document-categories.add',
                                title: (<IntlMessages id='bloodType.update.title' />),
                                to: BLOOD_TYPE.ADD
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
                                        <IntlMessages id='bloodType.update.title' />
                                    </CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <form className='row g-4 mx-3' onSubmit={handleSubmit(onSubmit)}>
                                       

                                        <div className='col-sm-12 '>
                                            <InputComponent
                                                name="code"
                                                errors={errors}
                                                control={control}
                                                displayRequiredAsterisk
                                                label={<IntlMessages id='form.field.code'/>}
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