import axios, {AxiosInstance, AxiosResponse} from "axios";

import {
    LoginRequest,
    CSUClientApiResponse,
    AxiosRequestConfigExtended,
} from './network.types';
import config from '../config';
import User from '../commons/models/User';
import Role from '../commons/models/Role';
import Region from '../commons/models/Region';
import District from '../commons/models/District';
import * as BackendUrl from '../commons/urls/back';
import Department from '../commons/models/Department';
import Permission from '../commons/models/Permission';
import VisibilityGroup from '../commons/models/VisibilityGroup';
import { mapDataToQueryString } from '../commons/helpers/funcHelper';
import UserList from '../commons/models/UserList';
import UserListItem from '../commons/models/UserListItem';
import Contact from '../commons/models/Contact';


export default class Client {
    public instance: AxiosInstance;
    private baseUrl: string;

    constructor(baseUrl: string, instance: AxiosInstance) {
        this.baseUrl = baseUrl;
        this.instance = instance;
    }

    /**
     * The rf_epay gateway
     * @param verb
     * @param url
     * @param data
     * @param config object which might have following keys:
     *                  noFormData: {boolean} Indicate whether or not to parse data into form data. Default to false
     *                  fileData: {Array<string>} List all files object of the request data
     *                  multipart: {boolean} Indicate if the request contains files thus multi-part form
     *                  shouldSkipToken: {boolean} Indicate if we do not have to bind token to the request
     * @return {Promise<unknown>}
     */
    makeRequest = <ResourceType = any>(
        verb: 'get' | 'post' | 'put' | 'patch' | 'delete' ,
        url: string,
        data: any = null,
        config: AxiosRequestConfigExtended = {}
    ): Promise<AxiosResponse<CSUClientApiResponse<ResourceType>, AxiosRequestConfigExtended>> => {
        return new Promise((resolve, reject) => {
            let _url = url;
            if ((verb === 'get' || verb === 'delete') && data) {
                _url = mapDataToQueryString({
                    data,
                    url,
                    transformToUrl: true,
                    removeTrashValue: !!config.removeTrashValueRequest,
                    transformToSnakeCase: !!(!config.skipSnakeCaseTransformRequest)
                }).url;

                /*Object.entries(data).forEach((item) => {
                    if (Array.isArray(item[1])) {
                        item[1].forEach(val => {
                            // @ts-ignore
                            const encoded = encodeURIComponent(val);
                            const character = _url.includes('?') ? '&' : '?';
                            const key = config.skipSnakeCaseTransformRequest ? item[0] : toSnakeCase(item[0]);
                            _url = `${_url}${character}${key}=${encoded}`;
                        });
                    } else {
                        // @ts-ignore
                        const encoded = encodeURIComponent(item[1]);
                        const character = _url.includes('?') ? '&' : '?';
                        const key = config.skipSnakeCaseTransformRequest ? item[0] : toSnakeCase(item[0]);
                        _url = `${_url}${character}${key}=${encoded}`;
                    }
                });*/
            }
            const params =
                verb === 'get' || verb === 'delete'
                    ? [_url, config]
                    : [_url, data, config];
            // @ts-ignore
            this.instance[verb](...params)
                .then((result) => resolve(result))
                .catch((error) =>
                    reject(
                        error || new Error('An error occurred while fetching'),
                    ),
                );
        });
    };

    /**
     * Bind params to a given url
     * @param to
     * @param params
     * @param withFullUrl
     */
    joinUrlWithParams = (to: string, params: Array<{ param: string; value: any }>, withFullUrl = false) => {
        let url = withFullUrl ? `${config.piramideClient}${to}` : to;
        params.forEach(param => {
            url = url.replace(`{${param.param}}`, `${encodeURIComponent(param.value)}`);
        });

        return url;
    };

    /**
     * Shortcut of joinUrlWithParams for Id
     * @param to
     * @param id
     * @param withFullUrl
     */
    joinUrlWithParamsId = (to: string, id: string | number, withFullUrl = false) => this.joinUrlWithParams(to, [{ param: 'id', value: id }], withFullUrl);

    location = {
        country: {
            getAll: () => {
                return new Promise<AxiosResponse<CSUClientApiResponse<any[]>, AxiosRequestConfigExtended>>((resolve, reject) => {
                    this.makeRequest<any[]>('get', BackendUrl.LOCATION.COUNTRY.GET_ALL)
                        .then((resp) => resolve({
                            ...resp,
                            data: {
                                ...resp.data,
                                results: resp.data.results
                            },
                        }))
                        .catch(err => reject(err));
                });
            },
        },

        region: {
            getAll: (filterParams: object) => {
                return new Promise<AxiosResponse<CSUClientApiResponse<Region[]>, AxiosRequestConfigExtended>>((resolve, reject) => {
                    this.makeRequest<Region[]>('get', BackendUrl.LOCATION.REGION.GET_ALL, filterParams || null)
                        .then((resp) => resolve({
                            ...resp,
                            data: {
                                ...resp.data,
                                results: resp.data.results.map(d => new Region(d))
                            },
                        }))
                        .catch(err => reject(err));
                });
            },
            getOne: (id:string) => {
                return new Promise<AxiosResponse<CSUClientApiResponse<Region>, AxiosRequestConfigExtended>>((resolve, reject) => {
                    this.makeRequest<Region>('get', this.joinUrlWithParamsId(BackendUrl.LOCATION.REGION.GET_ONE, id))
                        .then((resp) => resolve({
                            ...resp,
                            data: {
                                ...resp.data,
                                results: new Region(resp.data)
                            },
                        }))
                        .catch(err => reject(err));
                });
            },
            create: (data: any) => this.makeRequest('post', BackendUrl.LOCATION.REGION.CREATE, data),
            update: (id: string, data: any) => this.makeRequest('patch', this.joinUrlWithParamsId(BackendUrl.LOCATION.REGION.UPDATE, id), data),
            delete: (id: string) => this.makeRequest('put', this.joinUrlWithParamsId(BackendUrl.LOCATION.REGION.DELETE_, id), null),
        },
        departments: {
            getAll: (filterParams: object) => {
                return new Promise<AxiosResponse<CSUClientApiResponse<Department[]>, AxiosRequestConfigExtended>>((resolve, reject) => {
                    this.makeRequest<Department[]>('get', BackendUrl.LOCATION.DEPARTMENT.GET_ALL, filterParams || null)
                        .then((resp) => resolve({
                            ...resp,
                            data: {
                                ...resp.data,
                                results: resp.data.results.map(d => new Department(d))
                            },
                        }))
                        .catch(err => reject(err));
                });
            },
            getOne: (id:string) => {
                return new Promise<AxiosResponse<CSUClientApiResponse<Department>, AxiosRequestConfigExtended>>((resolve, reject) => {
                    this.makeRequest<Department>('get', this.joinUrlWithParamsId(BackendUrl.LOCATION.DEPARTMENT.GET_ONE, id))
                        .then((resp) => resolve({
                            ...resp,
                            data: {
                                ...resp.data,
                                results: new Department(resp.data)
                            },
                        }))
                        .catch(err => reject(err));
                });
            },
            create: (data: any) => this.makeRequest('post', BackendUrl.LOCATION.DEPARTMENT.CREATE, data),
            update: (id: string, data: any) => this.makeRequest('patch', this.joinUrlWithParamsId(BackendUrl.LOCATION.DEPARTMENT.UPDATE, id), data),
            delete: (id: string) => this.makeRequest('put', this.joinUrlWithParamsId(BackendUrl.LOCATION.DEPARTMENT.DELETE_, id), null),
        },

        districts: {
            getAll: (filterParams: object) => {
                return new Promise<AxiosResponse<CSUClientApiResponse<District[]>, AxiosRequestConfigExtended>>((resolve, reject) => {
                    this.makeRequest<District[]>('get', BackendUrl.LOCATION.DISTRICT.GET_ALL, filterParams || null)
                        .then((resp) => {
                            resolve({
                                ...resp,
                                data: {
                                    ...resp.data,
                                    results: resp.data.results.map(d => new District(d))
                                },
                            })
                        })
                        .catch(err => reject(err));
                });
            },
            getOne: (id:string) => {
                return new Promise<AxiosResponse<CSUClientApiResponse<District>, AxiosRequestConfigExtended>>((resolve, reject) => {
                    this.makeRequest<District>('get', this.joinUrlWithParamsId(BackendUrl.LOCATION.DISTRICT.GET_ONE, id))
                        .then((resp) => {
                            return resolve({
                                ...resp,
                                data: {
                                    ...resp.data,
                                    results: new District(resp.data)
                                },
                            })
                        })
                        .catch(err => reject(err));
                });
            },
            create: (data: any) => this.makeRequest('post', BackendUrl.LOCATION.DISTRICT.CREATE, data),
            update: (id: string, data: any) => this.makeRequest('patch', this.joinUrlWithParamsId(BackendUrl.LOCATION.DISTRICT.UPDATE, id), data),
            delete: (id: string) => this.makeRequest('put', this.joinUrlWithParamsId(BackendUrl.LOCATION.DISTRICT.DELETE_, id), null),
        },

    }

    security = {
        roles: {
            getAll: (filterParams: object) => {
                return new Promise<AxiosResponse<CSUClientApiResponse<Role[]>, AxiosRequestConfigExtended>>((resolve, reject) => {
                    this.makeRequest<Role[]>('get', BackendUrl.SECURITY.ROLES.GET_ALL, filterParams || null)
                        .then((resp) => resolve({
                            ...resp,
                            data: {
                                ...resp.data,
                                results: resp.data.results.map(d => new Role(d))
                            },
                        }))
                        .catch(err => reject(err));
                });
            },
            getOne: (id: string) => {
                return new Promise<AxiosResponse<CSUClientApiResponse<Role>, AxiosRequestConfigExtended>>((resolve, reject) => {
                    this.makeRequest<Role>('get', this.joinUrlWithParamsId(BackendUrl.SECURITY.ROLES.GET_ONE, id), null)
                        .then((resp) => resolve({
                            ...resp,
                            data: {
                                ...resp.data,
                                results: new Role(resp.data)
                            },
                        }))
                        .catch(err => reject(err));
                });
            },
            create: (data: any) => this.makeRequest('post', BackendUrl.SECURITY.ROLES.CREATE, data),
            update: (id: string, data: any) => this.makeRequest('patch', this.joinUrlWithParamsId(BackendUrl.SECURITY.ROLES.UPDATE, id), data),
            delete: (id: string) => this.makeRequest('put', this.joinUrlWithParamsId(BackendUrl.SECURITY.ROLES.DELETE_, id), null),
        },
        permissions: {
            getAll: (filterParams?: object) => {
                return new Promise<AxiosResponse<CSUClientApiResponse<Permission[]>, AxiosRequestConfigExtended>>((resolve, reject) => {
                    this.makeRequest<Permission[]>(
                        'get',
                        BackendUrl.SECURITY.PERMISSIONS.GET_ALL,
                        filterParams || null,
                        { removeTrashValueRequest: true })
                        .then((resp) => resolve({
                            ...resp,
                            data: {
                                ...resp.data,
                                results: resp.data.results.map(d => new Permission(d))
                            },
                        }))
                        .catch(err => reject(err));
                });
            },
        },

        visibilityGroups: {
            getAll: (filterParams: object) => {
                return new Promise<AxiosResponse<CSUClientApiResponse<VisibilityGroup[]>, AxiosRequestConfigExtended>>((resolve, reject) => {
                    this.makeRequest<VisibilityGroup[]>('get', BackendUrl.SECURITY.VISIBILITY_GROUPS.GET_ALL, filterParams || null)
                        .then((resp) => resolve({
                            ...resp,
                            data: {
                                ...resp.data,
                                results: resp.data.results.map(d => new VisibilityGroup(d))
                            },
                        }))
                        .catch(err => reject(err));
                });
            },
            getOne: (id: string) => {
                return new Promise<AxiosResponse<CSUClientApiResponse<VisibilityGroup>, AxiosRequestConfigExtended>>((resolve, reject) => {
                    this.makeRequest<VisibilityGroup>('get', this.joinUrlWithParamsId(BackendUrl.SECURITY.VISIBILITY_GROUPS.GET_ONE, id), null)
                        .then((resp) => resolve({
                            ...resp,
                            data: {
                                ...resp.data,
                                results: new VisibilityGroup(resp.data)
                            },
                        }))
                        .catch(err => reject(err));
                });
            },
            create: (data: any) => this.makeRequest('post', BackendUrl.SECURITY.VISIBILITY_GROUPS.CREATE, data),
            update: (id: string, data: any) => this.makeRequest('patch', this.joinUrlWithParamsId(BackendUrl.SECURITY.VISIBILITY_GROUPS.UPDATE, id), data),
            delete: (id: string) => this.makeRequest('put', this.joinUrlWithParamsId(BackendUrl.SECURITY.VISIBILITY_GROUPS.DELETE_, id), null),
        },

        users: {
            getAll: (filterParams: object) => {
                return new Promise<AxiosResponse<CSUClientApiResponse<UserList[]>, AxiosRequestConfigExtended>>((resolve, reject) => {
                    this.makeRequest<UserList[]>('get', BackendUrl.SECURITY.USERS.GET_ALL, filterParams || null)
                        .then((resp) => resolve({
                            ...resp,
                            data: {
                                ...resp.data,
                                results: resp.data.results.map(d => new UserList(d))
                            },
                        }))
                        .catch(err => reject(err));
                });
            },
            getOne: (id: string) => {
                return new Promise<AxiosResponse<CSUClientApiResponse<UserListItem>, AxiosRequestConfigExtended>>((resolve, reject) => {
                    this.makeRequest<UserListItem>('get', this.joinUrlWithParamsId(BackendUrl.SECURITY.USERS.GET_ONE, id), null)
                        .then((resp) => {
                            return resolve({
                                ...resp,
                                data: {
                                    ...resp.data,
                                    results: new UserListItem(resp.data)
                                },
                            })
                        } )
                        .catch(err => reject(err));
                });
            },
            create: (data: any) => {
                return new Promise<AxiosResponse<CSUClientApiResponse<UserListItem>, AxiosRequestConfigExtended>>((resolve, reject) => {
                    this.makeRequest<UserListItem>(
                        'post',
                        BackendUrl.SECURITY.USERS.CREATE,
                        data,
                        { removeTrashValueRequest: true })
                        .then((resp) => resolve({
                            ...resp,
                            data: {
                                ...resp.data,
                                results: new UserListItem(resp.data)
                            },
                        }))
                        .catch(err => reject(err));
                });
            },
            update: (id: string, data: any) => this.makeRequest(
                'patch',
                this.joinUrlWithParamsId(BackendUrl.SECURITY.USERS.UPDATE, id),
                data,
                { removeTrashValueRequest: true }),
            updatePassword: (id: string, data: any) => this.makeRequest('put', this.joinUrlWithParamsId(BackendUrl.SECURITY.USERS.UPDATE_PASSWORD, id), data),
            updateMyPassword: (data: any) => this.makeRequest('put', BackendUrl.SECURITY.USERS.UPDATE_MY_PASSWORD, data),
            delete: (id: string) => this.makeRequest('put', this.joinUrlWithParamsId(BackendUrl.SECURITY.USERS.DELETE_, id), null),
        },
    }

    users = {
        auth: {
            getDetails: () => {
                return new Promise<AxiosResponse<CSUClientApiResponse<User>, AxiosRequestConfigExtended>>((resolve, reject) => {
                    this.makeRequest<Region[]>('get', BackendUrl.USERS.AUTH.ME, null,{
                        skipErrorCodes: [500],
                    })
                        .then((resp) => {
                            resolve({
                                ...resp,
                                data: {
                                    ...resp.data,
                                    results: new User(resp.data)
                                },
                            })
                        } )
                        .catch(err => reject(err));
                })
            },
            login: (data: LoginRequest) => {
                return new Promise<AxiosResponse<{ access: string, refresh: string, lifetime: number }, AxiosRequestConfigExtended>>((resolve, reject) => {
                    this.makeRequest<{ access: string, refresh: string, lifetime: number }>(
                        'post',
                        BackendUrl.USERS.AUTH.LOGIN,
                        data,
                        {
                            skipErrorCodes: [401],
                        }
                    )// @ts-ignore
                    .then((resp) => resolve(resp))
                    .catch(err => reject(err));
                })
            },
            logout: () => this.makeRequest('post', BackendUrl.USERS.AUTH.LOGOUT, null),
            refresh: (refreshToken: string) => this.makeRequest('post', BackendUrl.USERS.AUTH.REFRESH, {refresh: refreshToken})
        },
    };

    others = {
        contacts: {
            getAll: () => {
                return new Promise<AxiosResponse<CSUClientApiResponse<Contact[]>, AxiosRequestConfigExtended>>((resolve, reject) => {
                    this.makeRequest<Contact[]>('get', BackendUrl.OTHERS.CONTACTS.GET_ALL, null)
                        .then((resp) => resolve({
                            ...resp,
                            data: {
                                ...resp.data,
                                results: resp.data.results.map(d => new Contact(d))
                            },
                        }))
                        .catch(err => reject(err));
                });
            },
            create: (data: any) => this.makeRequest('post', BackendUrl.OTHERS.CONTACTS.CREATE, data),
            update: (id: string, data: any) => this.makeRequest('patch', this.joinUrlWithParamsId(BackendUrl.OTHERS.CONTACTS.UPDATE, id), data),
            delete: (id: string) => this.makeRequest('put', this.joinUrlWithParamsId(BackendUrl.OTHERS.CONTACTS.DELETE_, id), null),
        },
    }
}
