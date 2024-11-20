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
import {bloodBadClient} from "../BloodBadClient";
import Button from "../../../../components/bootstrap/Button";
import {BLOOD_BAD} from "../url/front";
import BloodBadModel from "../BloodBadModel";
import Spinner from "../../../../components/bootstrap/Spinner";
import ChecksInput from "../../../../components/forms/ChecksInput";
import SelectFromRemote from "../../../../components/forms/select/SelectFromRemote";
import {bloodTypeClient} from "../../bloodType/BloodTypeClient";
import {bloodBankClient} from "../../bloodBank/BloodBankClient";

type FormType = {
    code: string
    quantity?: string,
    bloodType: {id: string, name: string},
    bloodBank: {id: string, name: string},
}

const schema = yup.object().shape({
    quantity: YupShema.name,
})

const Add = () => {

    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const documentTypeId = useParams().id
    const [documenttype, setdocumentType] = useState<BloodBadModel | null>(null)

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<FormType>({
        mode: 'onChange',
        resolver: yupResolver(schema),
    });

    const loadBloodTypeById = () => {
        bloodBadClient.getOne(documentTypeId as string)
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

        const dataSend = {
            code: data.code,
            quantity: data.quantity,
            blood_bank: data.bloodBank.id,
            blood_type: data.bloodType.id,
        }

        bloodBadClient
            .update(documentTypeId as string, dataSend)
            .then((res) => {
                navigate(BLOOD_BAD.INDEX)
                NotificationManager.success(globalT('bloodBag.update.success'))
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
                                key: 'bloodBag.management',
                                title: (<IntlMessages id='bloodBag.management' />),
                                to:   BLOOD_BAD.INDEX
                            },
                            {
                                key: 'document-categories.update',
                                title: (<IntlMessages id='bloodBag.update.title' />),
                                to: BLOOD_BAD.ADD
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
                                        <IntlMessages id='bloodBag.update.title' />
                                    </CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <form className='row g-4 mx-3' onSubmit={handleSubmit(onSubmit)}>
                                        <div className='col-sm-12 '>
                                            <InputComponent
                                                name="quantity"
                                                errors={errors}
                                                type={"number"}
                                                control={control}
                                                displayRequiredAsterisk
                                                label={<IntlMessages id='form.field.quantity'/>}
                                            />
                                        </div>

                                        <div className="col-sm-12 col-md-12">
                                            <SelectFromRemote
                                                // isMulti
                                                name="bloodType"
                                                errors={errors}
                                                control={control}
                                                watchValue={null}
                                                setValue={setValue}
                                                mapItemsToOptions = {(item: any) => ({ id: item.id, name: item.code})}
                                                componentType='select'
                                                displayRequiredAsterisk
                                                getOptionValue={(option) => option.id}
                                                getOptionLabel={(option) => option.name}
                                                fetchData={() => bloodTypeClient.getAll({ page:1, pageSize: 300})}
                                                label={<IntlMessages id='bloodType.management.title'/>}
                                                emptyListText={{ id: 'bloodType.list.empty' }}
                                                placeholder={<IntlMessages id='bloodType.management'/>}
                                            />
                                        </div>

                                        <div className="col-sm-12 col-md-12">
                                            <SelectFromRemote
                                                // isMulti
                                                name="bloodBank"
                                                errors={errors}
                                                control={control}
                                                watchValue={null}
                                                setValue={setValue}
                                                componentType='select'
                                                displayRequiredAsterisk
                                                getOptionValue={(option) => option.id}
                                                getOptionLabel={(option) => option.name}
                                                fetchData={() => bloodBankClient.getAll({ page:1, pageSize: 300})}
                                                label={<IntlMessages id='bloodBank.management.title'/>}
                                                emptyListText={{ id: 'bloodBank.list.empty' }}
                                                placeholder={<IntlMessages id='bloodBank.management'/>}
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