import React, {useEffect, useRef, useState} from 'react';
import {FetchResource} from "../../../network/network.types";
import csuClient from "../../../network";
import {useNavigate, useParams} from "react-router-dom";
import {SubmitHandler, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import * as yupSchema from "../../../components/forms/yupShema";
import NotificationManager from "../../../components/notifications/NotificationManager";
import {globalT} from "../../../lang";
import { SECURITY} from "../../../commons/urls/front";
import PageWrapper from "../../../layout/PageWrapper/PageWrapper";
import metadata from "../../../commons/data/metadata";
import SubHeader, {SubHeaderLeft} from "../../../layout/SubHeader/SubHeader";
import Breadcrumb from "../../../components/bootstrap/Breadcrumb";
import IntlMessages from "../../../components/IntlMessages";
import Page from "../../../layout/Page/Page";
import Card, {CardBody, CardHeader, CardTitle} from "../../../components/bootstrap/Card";
import InputComponent from "../../../components/forms/InputComponent";
import Button from "../../../components/bootstrap/Button";
import Spinner from "../../../components/bootstrap/Spinner";
import LocationPicker from "../../../layout/LocationPicker";
import {setRequestGlobalLoader} from "../../../store/slices/requestGlobalLoader/actions";
import {useAppDispatch} from "../../../store/redux.types";
import Role from "../../../commons/models/Role";
import VisibilityGroup from "../../../commons/models/VisibilityGroup";

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
    name: yupSchema.name,
    // slug: yupSchema.name
});

type FormType = {
    name?: string,
    description?: string,
    // slug?: string
}

const Update = () => {

    const refDistrict = useRef<any>()
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const visibilityId = useParams().id
    const {
        control,
        handleSubmit,
        formState: {errors},
        reset,
    } = useForm<FormType>({
        mode: 'onChange',
        resolver: yupResolver(schema),
    });

    const [resource, setResource] = useState<FetchResource<any>>({
        loading: true,
        content: null,
        error: null,
    });

    const [defaultDistrict, setDefaultDistrict] = useState<FetchResource<VisibilityGroup|undefined>>({
        loading: true,
        content: null,
        error: null,
    });

    const onSubmit: SubmitHandler<FormType> = (data) => {

        dispatch(setRequestGlobalLoader(true))
        const selectdNode = refDistrict.current?.getSelectedNode();
        const districts: string[] = selectdNode.map((item: { districtId: string; }) => item.districtId as string)
        const submitData = {
            ...data,
            code: Math.random().toString(),
            slug: Math.random().toString(),
            districts: districts
        }
        csuClient.security.visibilityGroups.update(visibilityId as string, submitData)
            .then((resp) => {
                NotificationManager.success(globalT('security.visibility.management.update.success'))
                navigate(SECURITY.VISIBILITY_GROUPS.INDEX);
            })
            .catch((error) => NotificationManager.error(error))
            .finally(() => dispatch(setRequestGlobalLoader(false)))
    }

    const loadResource = () => {

        setResource({
            ...resource,
            loading: true,
        });

        csuClient
            .location
            .region
            .getAll({page_size:30})
            .then((res) => {
                const data = res.data.results;
                setResource({
                    loading: false,
                    content: data,
                    error: null,
                });
            })
            .catch((error) => {
                setResource({
                    loading: false,
                    content: null,
                    error,
                });
            });
    }

    const loadDefaultDistrict = () => {
        if (!visibilityId)
            return;

        setDefaultDistrict({
            ...defaultDistrict,
            loading: true,
        });

        csuClient
            .security
            .visibilityGroups
            .getOne(visibilityId)
            .then((res) => {
                const data = res.data.results;
                reset({'name': data.name,  description:data.description})
                setDefaultDistrict({
                    loading: false,
                    content: data,
                    error: null,
                });
            })
            .catch((error) => {
                setDefaultDistrict({
                    loading: false,
                    content: null,
                    error,
                });
            });
    }

    const loadData = async () => {
        await loadDefaultDistrict()
        loadResource();
    }

    useEffect(() => {
        loadData()
    }, []);

    return (
        <PageWrapper metadata={metadata.dashboard.addUser}>
            <SubHeader>
                <SubHeaderLeft>
                    <Breadcrumb
                        list={[
                            {
                                key: 'security.visibility.management',
                                title: (<IntlMessages id='security.groups.visibility' />),
                                to: SECURITY.VISIBILITY_GROUPS.INDEX
                            },
                            {
                                key: 'security.visibility.management.add',
                                title: (<IntlMessages id='security.visibility.management.add' />),
                                to: SECURITY.VISIBILITY_GROUPS.ADD
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
                                    <IntlMessages id='security.visibility.management.update' />
                                </CardTitle>
                            </CardHeader>
                            <CardBody>
                                <form className='row g-4 mx-3' onSubmit={handleSubmit(onSubmit)}>
                                    <div className="col-md-10 mb-4">
                                        <InputComponent
                                            name="name"
                                            errors={errors}
                                            control={control}
                                            displayRequiredAsterisk
                                            label={<IntlMessages id='form.field.name'/>}
                                        />
                                    </div>

                                    {/*<div className="col-md-10 mb-4">*/}
                                    {/*    <InputComponent*/}
                                    {/*        name="slug"*/}
                                    {/*        errors={errors}*/}
                                    {/*        control={control}*/}
                                    {/*        displayRequiredAsterisk*/}
                                    {/*        label={<IntlMessages id='form.field.slug'/>}*/}
                                    {/*    />*/}
                                    {/*</div>*/}

                                    <div className="col-md-10 mb-4">
                                        <InputComponent
                                            errors={errors}
                                            name="description"
                                            control={control}
                                            isRequired={false}
                                            displayRequiredAsterisk={false}
                                            label={<IntlMessages id='form.field.description' />}
                                        />
                                    </div>

                                    {!resource.loading ? (
                                        <div className=''>
                                            {resource.content && defaultDistrict.content && (
                                                <LocationPicker
                                                    ref={refDistrict}
                                                    data={resource.content}
                                                    defaultSelected={defaultDistrict.content}
                                                />
                                            )}
                                        </div>
                                    ) : (
                                        <Spinner color='primary' size='3rem' />
                                    )}
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

export default Update;
