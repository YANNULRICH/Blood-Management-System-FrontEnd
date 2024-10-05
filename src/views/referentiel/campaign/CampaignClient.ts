import piramideClient from "../../../network";
import {AxiosResponse} from "axios";
import {AxiosRequestConfigExtended, CSUClientApiResponse} from "../../../network/network.types";
import {campaignBack} from "./url/back";
import CampaignModel from "./CampaignModel";

export const CampaignClient = {
    getAll: (filterParams: object) => {
        return new Promise<AxiosResponse<CSUClientApiResponse<CampaignModel[]>, AxiosRequestConfigExtended>>((resolve, reject) => {
            piramideClient.makeRequest<CampaignModel[]>('get', campaignBack.GET_ALL, filterParams || null)
                .then((resp) => resolve({
                    ...resp,
                    data: {
                        ...resp.data,
                        results: resp.data.results.map(d => new CampaignModel(d))
                    },
                }))
                .catch(err => reject(err));
        });
    },
    getOne: (id:string) => {
        return new Promise<AxiosResponse<CSUClientApiResponse<CampaignModel>, AxiosRequestConfigExtended>>((resolve, reject) => {
            piramideClient.makeRequest<CampaignModel>('get', piramideClient.joinUrlWithParamsId(campaignBack.GET_ONE, id))
                .then((resp) => resolve({
                    ...resp,
                    data: {
                        ...resp.data,
                        results: new CampaignModel(resp.data)
                    },
                }))
                .catch(err => reject(err));
        });
    },
    create: (data: any) => piramideClient.makeRequest('post', campaignBack.CREATE, data, {shouldSkipDataParsing: true}),
    update: (id: string, data: any) => piramideClient.makeRequest('patch', piramideClient.joinUrlWithParamsId(campaignBack.UPDATE, id), data, {shouldSkipDataParsing: true}),
    delete: (id: string) => piramideClient.makeRequest('put', piramideClient.joinUrlWithParamsId(campaignBack.DELETE_, id), null),
}