import React, {useEffect, useRef, useState} from 'react';
import metadata from "../../../commons/data/metadata";
import SubHeader, {SubHeaderLeft} from "../../../layout/SubHeader/SubHeader";
import Breadcrumb from "../../../components/bootstrap/Breadcrumb";
import IntlMessages from "../../../components/IntlMessages";
import {SECURITY} from "../../../commons/urls/front";
import Page from "../../../layout/Page/Page";
import Card, {CardBody, CardHeader, CardTitle} from "../../../components/bootstrap/Card";
import InputComponent from "../../../components/forms/InputComponent";
import PermissionPicker from "../../../layout/PermissionPicker";
import Button from "../../../components/bootstrap/Button";
import PageWrapper from "../../../layout/PageWrapper/PageWrapper";
import {useNavigate, useParams} from "react-router-dom";
import {SubmitHandler, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {FetchResource} from "../../../network/network.types";
import csuClient from "../../../network";
import NotificationManager from "../../../components/notifications/NotificationManager";
import {globalT} from "../../../lang";
import * as yup from "yup";
import * as yupSchema from "../../../components/forms/yupShema";
import Role from '../../../commons/models/Role'
import Spinner from "../../../components/bootstrap/Spinner";

const schema = yup.object().shape({
    name: yupSchema.name,
});

const defaultValues = {
    name:''
}

type FormType = {
    name?: string
    permissions?: Array<{ id: number, name: string }>
}

const Update = () => {

    const refPermission = useRef<any>()
    const navigate = useNavigate();
    const roleId = useParams().id;

    const {
        control,
        handleSubmit,
        formState: {errors},
        reset
    } = useForm<FormType>({
        mode: 'onChange',
        defaultValues,
        resolver: yupResolver(schema),
    });

    const [resource, setResource] = useState<FetchResource<any>>({
        loading: true,
        content: null,
        error: null,
    });

    const [defaultPermission, setDefaultPermission] = useState<FetchResource<Role|undefined>>({
        loading: true,
        content: null,
        error: null,
    });

    const onSubmit: SubmitHandler<FormType> = (data) => {

        const selectdNode = refPermission.current?.getSelectedNode();
        const permission = selectdNode.map((item: { id: any; }) => item.id);
        const submitData = {
            name: data.name,
            permissions: permission
        }
        // return
        csuClient.security.roles.update(roleId as string, submitData)
            .then((resp) => {
                NotificationManager.success(globalT('security.roles.management.add.success'))
                navigate(SECURITY.ROLES.INDEX);
            } )
            .catch((error) => NotificationManager.error(error))
    }

    const loadResource = () => {

        setResource({
            ...resource,
            loading: true,
        });

        csuClient
            .security
            .permissions
            .getAll({page_size:600})
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

    const loadDefaultPermission = () => {
        if (!roleId)
            return;

        setDefaultPermission({
            ...defaultPermission,
            loading: true,
        });

        csuClient
            .security
            .roles
            .getOne(roleId)
            .then((res) => {
                const data = res.data.results;
                reset({'name': data.name})
                setDefaultPermission({
                    loading: false,
                    content: data,
                    error: null,
                });
            })
            .catch((error) => {
                setDefaultPermission({
                    loading: false,
                    content: null,
                    error,
                });
            });
    }

    const loadData = async () => {
        await loadDefaultPermission();
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
                                key: 'security.role.management',
                                title: (<IntlMessages id='security.role.management' />),
                                to: SECURITY.ROLES.INDEX
                            },
                            {
                                key: 'referentiel.role.management.update',
                                title: (<IntlMessages id='security.role.update' />),
                                to: SECURITY.ROLES.ADD
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
                                    <IntlMessages id='metadata.role.update.title' />
                                </CardTitle>
                            </CardHeader>
                            <CardBody>
                                <form className='row g-4 mx-3' onSubmit={handleSubmit(onSubmit)}>
                                    <div className='col-12'>
                                        <InputComponent
                                            name="name"
                                            errors={errors}
                                            control={control}
                                            displayRequiredAsterisk
                                            label={<IntlMessages id='form.field.name'/>}
                                        />
                                    </div>
                                    {!resource.loading ? (
                                        <div className=''>
                                            {resource.content && (
                                                <PermissionPicker
                                                    ref={refPermission}
                                                    data={resource.content}
                                                    defaultSelected={defaultPermission.content}
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
