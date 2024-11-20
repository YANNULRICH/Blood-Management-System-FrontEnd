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
import {bloodDonationClient} from "../BloodDonationClient";
import Button from "../../../../components/bootstrap/Button";
import {BLOOD_DONATION} from "../url/front";
import BloodBadModel from "../BloodDonationModel";
import Spinner from "../../../../components/bootstrap/Spinner";
import ChecksInput from "../../../../components/forms/ChecksInput";
import SelectFromRemote from "../../../../components/forms/select/SelectFromRemote";
import {bloodTypeClient} from "../../bloodType/BloodTypeClient";
import {bloodBankClient} from "../../bloodBank/BloodBankClient";
import {donorClient} from "../../../donor/donor/DonorClient";
import dayjs from "dayjs";

type FormType = {
    expirationDate: string
    quantity?: string,
    donor: {id: string, name: string},
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
        bloodDonationClient.getOne(documentTypeId as string)
            .then((resp) => {
                const data = resp.data.results
                reset({quantity: data.quantity})
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
            quantity: data.quantity,
            Expiration_date: dayjs(data.expirationDate).format("YYYY-MM-DDThh:mm") ,
            donor: data.donor.id ,
            blood_bank: data.bloodBank.id,
        }

        bloodDonationClient
            .update(documentTypeId as string, dataSend)
            .then((res) => {
                navigate(BLOOD_DONATION.INDEX)
                NotificationManager.success(globalT('bloodDonation.update.success'))
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
                                key: 'bloodDonation.management',
                                title: (<IntlMessages id='bloodDonation.management' />),
                                to:   BLOOD_DONATION.INDEX
                            },
                            {
                                key: 'document-categories.add',
                                title: (<IntlMessages id='bloodDonation.update.title' />),
                                to: BLOOD_DONATION.ADD
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
                                        <IntlMessages id='bloodDonation.update.title' />
                                    </CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <form className='row g-4 mx-3' onSubmit={handleSubmit(onSubmit)}>
                                        <div className="col-12">
                                            <InputComponent
                                                errors={errors}
                                                control={control}
                                                type={"date"}
                                                name="expirationDate"
                                                displayRequiredAsterisk
                                                label={
                                                    <IntlMessages id="form.field.expirationDate" />
                                                }
                                            />
                                        </div>

                                        <div className='col-sm-12'>
                                            <InputComponent
                                                name="quantity"
                                                errors={errors}
                                                control={control}
                                                displayRequiredAsterisk
                                                label={<IntlMessages id='form.field.quantity'/>}
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
                                                mapItemsToOptions = {(item: any) => ({ id: item.id, name: item.code})}
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

                                        <div className="col-sm-12 col-md-12">
                                            <SelectFromRemote
                                                // isMulti
                                                name="donor"
                                                errors={errors}
                                                control={control}
                                                watchValue={null}
                                                setValue={setValue}
                                                componentType='select'
                                                displayRequiredAsterisk
                                                getOptionValue={(option) => option.id}
                                                getOptionLabel={(option) => option.name}
                                                fetchData={() => donorClient.getAll({ page:1, pageSize: 300})}
                                                label={<IntlMessages id='donor.management'/>}
                                                emptyListText={{ id: 'donor.list.empty' }}
                                                placeholder={<IntlMessages id='donor.management'/>}
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