import piramideClient from "../../../network";
import {AxiosResponse} from "axios";
import {AxiosRequestConfigExtended, CSUClientApiResponse} from "../../../network/network.types";
import {bloodTypeBack} from "./url/back";
import BloodTypeModel from "./BloodTypeModel";

export const bloodTypeClient = {
    getAll: (filterParams?: object) => {
        return new Promise<AxiosResponse<CSUClientApiResponse<BloodTypeModel[]>, AxiosRequestConfigExtended>>((resolve, reject) => {
            piramideClient.makeRequest<BloodTypeModel[]>('get', bloodTypeBack.GET_ALL, filterParams || null)
                .then((resp) => {
                    console.log("aaaaaaaa :", resp)
                    return resolve({
                        ...resp,
                        data: {
                            ...resp.data,
                            results: resp.data.results.map(d => new BloodTypeModel(d))
                        },
                    })
                })
                .catch(err => reject(err));
        });
    },
    getOne: (id:string) => {
        return new Promise<AxiosResponse<CSUClientApiResponse<BloodTypeModel>, AxiosRequestConfigExtended>>((resolve, reject) => {
            piramideClient.makeRequest<BloodTypeModel>('get', piramideClient.joinUrlWithParamsId(bloodTypeBack.GET_ONE, id))
                .then((resp) => resolve({
                    ...resp,
                    data: {
                        ...resp.data,
                        results: new BloodTypeModel(resp.data)
                    },
                }))
                .catch(err => reject(err));
        });
    },
    create: (data: any) => piramideClient.makeRequest('post', bloodTypeBack.CREATE, data, {shouldSkipDataParsing: true}),
    update: (id: string, data: any) => piramideClient.makeRequest('patch', piramideClient.joinUrlWithParamsId(bloodTypeBack.UPDATE, id), data, {shouldSkipDataParsing: true}),
    delete: (id: string) => piramideClient.makeRequest('put', piramideClient.joinUrlWithParamsId(bloodTypeBack.DELETE_, id), null),
}