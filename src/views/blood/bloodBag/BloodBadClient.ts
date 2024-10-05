import piramideClient from "../../../network";
import {AxiosResponse} from "axios";
import {AxiosRequestConfigExtended, CSUClientApiResponse} from "../../../network/network.types";
import {bloodBadBack} from "./url/back";
import BloodBadModel from "./BloodBadModel";

export const bloodBadClient = {
    getAll: (filterParams: object) => {
        return new Promise<AxiosResponse<CSUClientApiResponse<BloodBadModel[]>, AxiosRequestConfigExtended>>((resolve, reject) => {
            piramideClient.makeRequest<BloodBadModel[]>('get', bloodBadBack.GET_ALL, filterParams || null)
                .then((resp) => resolve({
                    ...resp,
                    data: {
                        ...resp.data,
                        results: resp.data.results.map(d => new BloodBadModel(d))
                    },
                }))
                .catch(err => reject(err));
        });
    },
    getOne: (id:string) => {
        return new Promise<AxiosResponse<CSUClientApiResponse<BloodBadModel>, AxiosRequestConfigExtended>>((resolve, reject) => {
            piramideClient.makeRequest<BloodBadModel>('get', piramideClient.joinUrlWithParamsId(bloodBadBack.GET_ONE, id))
                .then((resp) => resolve({
                    ...resp,
                    data: {
                        ...resp.data,
                        results: new BloodBadModel(resp.data)
                    },
                }))
                .catch(err => reject(err));
        });
    },
    create: (data: any) => piramideClient.makeRequest('post', bloodBadBack.CREATE, data, {shouldSkipDataParsing: true}),
    update: (id: string, data: any) => piramideClient.makeRequest('patch', piramideClient.joinUrlWithParamsId(bloodBadBack.UPDATE, id), data, {shouldSkipDataParsing: true}),
    delete: (id: string) => piramideClient.makeRequest('put', piramideClient.joinUrlWithParamsId(bloodBadBack.DELETE_, id), null),
}