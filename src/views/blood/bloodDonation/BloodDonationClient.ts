import piramideClient from "../../../network";
import {AxiosResponse} from "axios";
import {AxiosRequestConfigExtended, CSUClientApiResponse} from "../../../network/network.types";
import {bloodDonationBack} from "./url/back";
import BloodDonationModel from "./BloodDonationModel";

export const bloodDonationClient = {
    getAll: (filterParams: object) => {
        return new Promise<AxiosResponse<CSUClientApiResponse<BloodDonationModel[]>, AxiosRequestConfigExtended>>((resolve, reject) => {
            piramideClient.makeRequest<BloodDonationModel[]>('get', bloodDonationBack.GET_ALL, filterParams || null)
                .then((resp) => resolve({
                    ...resp,
                    data: {
                        ...resp.data,
                        results: resp.data.results.map(d => new BloodDonationModel(d))
                    },
                }))
                .catch(err => reject(err));
        });
    },
    getOne: (id:string) => {
        return new Promise<AxiosResponse<CSUClientApiResponse<BloodDonationModel>, AxiosRequestConfigExtended>>((resolve, reject) => {
            piramideClient.makeRequest<BloodDonationModel>('get', piramideClient.joinUrlWithParamsId(bloodDonationBack.GET_ONE, id))
                .then((resp) => resolve({
                    ...resp,
                    data: {
                        ...resp.data,
                        results: new BloodDonationModel(resp.data)
                    },
                }))
                .catch(err => reject(err));
        });
    },
    create: (data: any) => piramideClient.makeRequest('post', bloodDonationBack.CREATE, data, {shouldSkipDataParsing: true}),
    update: (id: string, data: any) => piramideClient.makeRequest('patch', piramideClient.joinUrlWithParamsId(bloodDonationBack.UPDATE, id), data, {shouldSkipDataParsing: true}),
    delete: (id: string) => piramideClient.makeRequest('put', piramideClient.joinUrlWithParamsId(bloodDonationBack.DELETE_, id), null),
}