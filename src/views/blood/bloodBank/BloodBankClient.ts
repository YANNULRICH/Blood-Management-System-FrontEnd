import piramideClient from "../../../network";
import {AxiosResponse} from "axios";
import {AxiosRequestConfigExtended, CSUClientApiResponse} from "../../../network/network.types";
import {bloodBankBack} from "./url/back";
import BloodBankModel from "./BloodBankModel";

export const bloodBankClient = {
    getAll: (filterParams: object) => {
        return new Promise<AxiosResponse<CSUClientApiResponse<BloodBankModel[]>, AxiosRequestConfigExtended>>((resolve, reject) => {
            piramideClient.makeRequest<BloodBankModel[]>('get', bloodBankBack.GET_ALL, filterParams || null)
                .then((resp) => resolve({
                    ...resp,
                    data: {
                        ...resp.data,
                        results: resp.data.results.map(d => new BloodBankModel(d))
                    },
                }))
                .catch(err => reject(err));
        });
    },
    getOne: (id:string) => {
        return new Promise<AxiosResponse<CSUClientApiResponse<BloodBankModel>, AxiosRequestConfigExtended>>((resolve, reject) => {
            piramideClient.makeRequest<BloodBankModel>('get', piramideClient.joinUrlWithParamsId(bloodBankBack.GET_ONE, id))
                .then((resp) => resolve({
                    ...resp,
                    data: {
                        ...resp.data,
                        results: new BloodBankModel(resp.data)
                    },
                }))
                .catch(err => reject(err));
        });
    },
    create: (data: any) => piramideClient.makeRequest('post', bloodBankBack.CREATE, data, {shouldSkipDataParsing: true}),
    update: (id: string, data: any) => piramideClient.makeRequest('patch', piramideClient.joinUrlWithParamsId(bloodBankBack.UPDATE, id), data, {shouldSkipDataParsing: true}),
    delete: (id: string) => piramideClient.makeRequest('put', piramideClient.joinUrlWithParamsId(bloodBankBack.DELETE_, id), null),
}