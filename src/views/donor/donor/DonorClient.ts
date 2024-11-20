import piramideClient from "../../../network";
import {AxiosResponse} from "axios";
import {AxiosRequestConfigExtended, CSUClientApiResponse} from "../../../network/network.types";
import {donor} from "./url/back";
import DonorModel from "./DonorModel";

export const donorClient = {
    getAll: (filterParams: object) => {
        return new Promise<AxiosResponse<CSUClientApiResponse<DonorModel[]>, AxiosRequestConfigExtended>>((resolve, reject) => {
            piramideClient.makeRequest<DonorModel[]>('get', donor.GET_ALL, filterParams || null)
                .then((resp) => resolve({
                    ...resp,
                    data: {
                        ...resp.data,
                        results: resp.data.results.map(d => new DonorModel(d))
                    },
                }))
                .catch(err => reject(err));
        });
    },
    getOne: (id:string) => {
        return new Promise<AxiosResponse<CSUClientApiResponse<DonorModel>, AxiosRequestConfigExtended>>((resolve, reject) => {
            piramideClient.makeRequest<DonorModel>('get', piramideClient.joinUrlWithParamsId(donor.GET_ONE, id))
                .then((resp) => resolve({
                    ...resp,
                    data: {
                        ...resp.data,
                        results: new DonorModel(resp.data)
                    },
                }))
                .catch(err => reject(err));
        });
    },
    create: (data: any) => piramideClient.makeRequest('post', donor.CREATE, data, {shouldSkipDataParsing: true}),
    update: (id: string, data: any) => piramideClient.makeRequest('patch', piramideClient.joinUrlWithParamsId(donor.UPDATE, id), data, {shouldSkipDataParsing: true}),
    delete: (id: string) => piramideClient.makeRequest('put', piramideClient.joinUrlWithParamsId(donor.DELETE_, id), null),
}