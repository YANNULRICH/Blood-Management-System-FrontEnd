import axios, {AxiosInstance, AxiosRequestConfig} from 'axios';

import {globalT} from "../lang";
import config from "./../config";
import {getJwtData, setJwtData} from "../commons/helpers/jwtHelper";
import {AxiosRequestConfigExtended} from "./network.types";
import {errorManager} from "../commons/helpers/errorHelper";
import StorageHelper, {StorageKeys} from "../commons/helpers/StorageHelper";
import NotificationManager from "../components/notifications/NotificationManager";
import {
    deepMapObject,
    objectToFormData,
    toCamelCase,
    toSnakeCase,
    utcToLocaleDate
} from "../commons/helpers/funcHelper";
import csuClient from "./index";
import {AUTH, DASHBOARD} from "../commons/urls/front";

/**
 * Create a new axios with general options and interceptors already set
 */
export const createAxiosInstance = () => {
    const _customAxios: AxiosInstance =
        axios.create({
            baseURL: config.piramideClient,
        });


    _customAxios.interceptors.request.use(
        async (axiosConfig: AxiosRequestConfig) => {
            try {
                const _axiosConfig = ({ ...axiosConfig} as AxiosRequestConfigExtended);

                // 1. Set JWT Token
                const jwtData = getJwtData();
                // console.log('jwtData :', jwtData?.tokenType);
                if (jwtData && !_axiosConfig.shouldSkipToken) {
                    // @ts-ignore
                    _axiosConfig.headers['Authorization'] = `Bearer ${jwtData.accessToken}`;
                }

                // 2. Set language
                const lang = StorageHelper.getItem(StorageKeys.LANGUAGE);
                // @ts-ignore
                _axiosConfig.headers['Accept-Language'] = lang || config.language.defaultValue;

                // Check if post or put to perform some operation
                if ((_axiosConfig.method === 'patch'
                    || _axiosConfig.method === 'post'
                    || _axiosConfig.method === 'put'
                    || _axiosConfig.method === 'delete')
                    && !_axiosConfig.shouldSkipDataParsing) {
                    // Create an object to store file data
                    const fileData: Record<string, any> = {};

                    // Check if fileData is present
                    if (_axiosConfig.fileData) {
                        // @ts-ignore
                        _axiosConfig.headers['content-type'] = 'multipart/form-data';

                        _axiosConfig.fileData.forEach(f => {
                            fileData[f] = _axiosConfig.data[f];
                            delete _axiosConfig.data[f];
                        });
                    }

                    // Parse object to snakeCase and Form data if its request gets files
                    if (_axiosConfig.fileData) {
                        const data = !_axiosConfig.skipSnakeCaseTransform
                            ? toSnakeCase(_axiosConfig.data) : _axiosConfig.data;
                        // @ts-ignore
                        _axiosConfig.data = objectToFormData(data);
                    } else if (!_axiosConfig.skipSnakeCaseTransform) {
                        _axiosConfig.data = toSnakeCase(_axiosConfig.data);
                    }

                    // Append files to data to send
                    if (_axiosConfig.fileData) {
                        Object.entries(fileData).forEach(item => {
                            const [key, value] = item;
                            if (key.includes('[]')) {
                                const _key = key.split('[]')[0];
                                _axiosConfig.data.append(`${!_axiosConfig.skipSnakeCaseTransform ? toSnakeCase(_key) : _key}[]`, value, 'file_' + _key);
                            }
                            else _axiosConfig.data.append(!_axiosConfig.skipSnakeCaseTransform ? toSnakeCase(key) : key, value);
                        });
                    }
                }
                // console.log('config :', _axiosConfig);

                // Apply changes
                return _axiosConfig;
            } catch (e) {
                return axiosConfig;
            }
        },
        error => Promise.reject(error));

    _customAxios.interceptors.response.use(
        // response => response,
        response => {
            // TODO: Find a way to merge both loop
            if (response && response.data) {
                // eslint-disable-next-line no-param-reassign
                response.data = deepMapObject(
                    // Data source
                    response.data,
                    // Detect UTC properties
                    key => typeof key === 'string' && /utc$/i.test(key),
                    // Leave key unchanged
                    key => key,
                    // Change value to locale date
                    value => utcToLocaleDate(value)
                );

                response.data =  toCamelCase(response.data);
            }

            return response;
        },
        // Intercept any error and display an appropriate message
        async (error) => {
            const originalRequest = error.config;
            // console.log('original :', originalRequest);
            // Check if we can handle error
            // By default skipAllErrors is undefined.
            // Non-handling error is for special case of manuel management
            if (!originalRequest.skipAllErrors) {
                // Check if error is defined
                if (error) {
                    // Check if response is defined since it contains error details like status code
                    if (error.response) {
                        switch (error.response.status) {
                            case 400:
                                // Verify if we have to check this error code
                                if (originalRequest.skipErrorCodes && (
                                    originalRequest.skipErrorCodes.includes(400)
                                    || originalRequest.skipErrorCodes.includes(518)
                                )) break;

                                errorManager(error.response.data);
                                break;
                            case 422:
                                // Verify if we have to check this error code
                                if (originalRequest.skipErrorCodes && (
                                    originalRequest.skipErrorCodes.includes(400)
                                    || originalRequest.skipErrorCodes.includes(518)
                                )) break;

                                errorManager(error.response.data.errors);
                                break;
                            case 401:
                            case 419:
                                if (originalRequest.skipErrorCodes && originalRequest.skipErrorCodes.includes(401))
                                    break;

                                NotificationManager.error(globalT("errors.401.feedback"));
                                break;
                            case 403:
                                if (originalRequest.skipErrorCodes && originalRequest.skipErrorCodes.includes(403))
                                    break;
                                StorageHelper.removeItem(StorageKeys.JWT)
                                // document.location = AUTH.LOGIN
                                // let jwtData = getJwtData();
                                // await csuClient.users.auth.refresh(jwtData?.tokenType as string)
                                //     .then((resp) => {
                                //         // @ts-ignore
                                //         setJwtData(resp.data.access, jwtData?.tokenType as string)
                                //         const currentLocation = window.location.href;
                                //         document.location.href = currentLocation
                                //     })
                                //     .catch((error) => {
                                //         StorageHelper.removeItem(StorageKeys.JWT)
                                //         document.location = AUTH.LOGIN
                                //     })

                                break;
                            case 404:
                                if (originalRequest.skipErrorCodes && originalRequest.skipErrorCodes.includes(404))
                                    break;

                                NotificationManager.error(globalT("errors.404.feedback"));
                                break;
                            case 500:
                                if (originalRequest.skipErrorCodes && originalRequest.skipErrorCodes.includes(500))
                                    break;

                                NotificationManager.error(globalT("errors.500.feedback"));
                                break;
                            case 504:
                                if (originalRequest.skipErrorCodes && originalRequest.skipErrorCodes.includes(504))
                                    break;

                                NotificationManager.error(globalT("errors.504.feedback"));
                                break;
                            default:
                                // Fallback to 500 error
                                NotificationManager.error(globalT("errors.500.feedback"));
                                break;
                        }
                    } else NotificationManager.error(globalT("errors.unknown.feedback"));
                } else NotificationManager.error(globalT("errors.unknown.feedback"));
            }
            return Promise.reject(error);
        });

    return _customAxios;
}

// Initialize the default axios used by the app
const customAxios = createAxiosInstance();

// Export it
export default customAxios;
