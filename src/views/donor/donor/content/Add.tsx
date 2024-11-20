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
import {donorClient} from "../DonorClient";
import Button from "../../../../components/bootstrap/Button";
import {DONOR} from "../url/front";
import {ChecksGroup} from "../../../../components/bootstrap/forms/Checks";
import ChecksInput from "../../../../components/forms/ChecksInput";
import * as yupSchema from "../../../../components/forms/yupShema";
import Visibility from "../../../../components/icon/material-icons/Visibility";
import VisibilityOff from "../../../../components/icon/material-icons/VisibilityOff";
import dayjs from "dayjs";


type FormType = {
    name: string
    surname: string,
    sex: string,
    age: string,
    phoneNumber: string,
    date: string,
    email: string,
    bloodGroup: string,
    password: string,
}

const schema = yup.object().shape({
    name: YupShema.name,
})

const Add = () => {

    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState<boolean>(false)

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

        const dataSend = {
            blood_group: data.bloodGroup,
            name: data.name,
            surname: data.surname,
            sex: data.sex,
            age: data.age,
            phone_number: data.phoneNumber,
            date: dayjs(data.date).format("") ,
            email: data.email,
            password: data.password,
        }

        donorClient
            .create(dataSend)
            .then((res) => {
                navigate(DONOR.INDEX)
                NotificationManager.success(globalT('donor.add.success'))
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
                                key: 'donor.management',
                                title: (<IntlMessages id='donor.management' />),
                                to:   DONOR.INDEX
                            },
                            {
                                key: 'donor.add',
                                title: (<IntlMessages id='donor.add.title' />),
                                to: DONOR.ADD
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
                                    <IntlMessages id='donor.add.title' />
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

                                    <div className='col-sm-6'>
                                        <InputComponent
                                            name="surname"
                                            errors={errors}
                                            control={control}
                                            displayRequiredAsterisk
                                            label={<IntlMessages id='form.field.surname'/>}
                                        />
                                    </div>

                                    <div className="col-6 col-md-6">
                                        <ChecksGroup
                                            checkWrapperProps={{ className: "mt-3" }}
                                            label={
                                                <>
                                                    <IntlMessages id="form.field.gender" />
                                                    <span className="text-danger">*</span>
                                                </>
                                            }
                                        >
                                            <ChecksInput
                                                isInline
                                                value="M"
                                                isRequired
                                                type="radio"
                                                name="sex"
                                                id={`gender_M`}
                                                // isRequired={false}
                                                errors={errors}
                                                control={control}
                                                wrapperClassName="d-inline-block"
                                                label={
                                                    <IntlMessages id="form.field.gender.male" />
                                                }
                                            />

                                            <ChecksInput
                                                isInline
                                                value="F"
                                                // isRequired={false}
                                                isRequired
                                                type="radio"
                                                name="sex"
                                                errors={errors}
                                                id={`gender_F`}
                                                control={control}
                                                wrapperClassName="d-inline-block"
                                                label={
                                                    <IntlMessages id="form.field.gender.female" />
                                                }
                                            />
                                        </ChecksGroup>
                                    </div>

                                    <div className='col-sm-6 '>
                                        <InputComponent
                                            name="age"
                                            errors={errors}
                                            control={control}
                                            type={"number"}
                                            displayRequiredAsterisk
                                            label={<IntlMessages id='form.field.age'/>}
                                        />
                                    </div>

                                    <div className="col-sm-6 col-md-6">
                                        <InputComponent
                                            name="phoneNumber"
                                            errors={errors}
                                            control={control}
                                            displayRequiredAsterisk
                                            label={<IntlMessages id='form.field.phoneNumber'/>}
                                            otherValidators={{
                                                validate: (val: string | undefined) => !val ? true : yupSchema.regex.cameroonPhoneNumber.test(val || '')
                                                    || (<IntlMessages id="form.errors.phone.cmr" />)
                                            }}
                                        />
                                    </div>

                                    <div className="col-6">
                                        <InputComponent
                                            errors={errors}
                                            type={"date"}
                                            control={control}
                                            name="date"
                                            displayRequiredAsterisk
                                            label={
                                                <IntlMessages id="form.field.date" />
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

                                    <div className="col-sm-6 col-md-6">
                                        <div className='row no-gutters'>
                                            <div className='col hidePasswordUser'>
                                                <InputComponent
                                                    type={!showPassword ? 'password' : 'text'}
                                                    name="password"
                                                    errors={errors}
                                                    control={control}
                                                    label={<IntlMessages id='form.field.password' />}
                                                />
                                                <span className="">
											<Button
                                                isLink
                                                isOutline
                                                color='dark'
                                                className=''
                                                onClick={() => {
                                                    setShowPassword(!showPassword)
                                                }}>
													{!showPassword ? (
                                                        <Visibility/>
                                                    ) : (
                                                        <VisibilityOff/>
                                                    )}
												</Button>
										</span>
                                            </div>
                                        </div>
                                    </div><br/>

                                    <div className='col-sm-6 '>
                                        <InputComponent
                                            name="bloodGroup"
                                            errors={errors}
                                            control={control}
                                            displayRequiredAsterisk
                                            label={<IntlMessages id='form.field.bloodGroup'/>}
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