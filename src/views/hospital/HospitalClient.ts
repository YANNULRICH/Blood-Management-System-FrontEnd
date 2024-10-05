import piramideClient from "../../network";
import { AxiosResponse } from "axios";
import {
  AxiosRequestConfigExtended,
  CSUClientApiResponse,
} from "../../network/network.types";
import { hospitalBack } from "./url/back";
import HospitalModel from "./HospitalModel";

export const hospitalClient = {
  getAll: (filterParams?: object) => {
    return new Promise<
      AxiosResponse<
        CSUClientApiResponse<HospitalModel[]>,
        AxiosRequestConfigExtended
      >
    >((resolve, reject) => {
      piramideClient
        .makeRequest<HospitalModel[]>(
          "get",
          hospitalBack.GET_ALL,
          filterParams || null
        )
        .then((resp) => {
          console.log("aaaaaaaa :", resp);
          return resolve({
            ...resp,
            data: {
              ...resp.data,
              results: resp.data.results.map((d) => new HospitalModel(d)),
            },
          });
        })
        .catch((err) => reject(err));
    });
  },
  getOne: (id: string) => {
    return new Promise<
      AxiosResponse<
        CSUClientApiResponse<HospitalModel>,
        AxiosRequestConfigExtended
      >
    >((resolve, reject) => {
      piramideClient
        .makeRequest<HospitalModel>(
          "get",
          piramideClient.joinUrlWithParamsId(hospitalBack.GET_ONE, id)
        )
        .then((resp) =>
          resolve({
            ...resp,
            data: {
              ...resp.data,
              results: new HospitalModel(resp.data),
            },
          })
        )
        .catch((err) => reject(err));
    });
  },
  create: (data: any) =>
    piramideClient.makeRequest("post", hospitalBack.CREATE, data, {
      shouldSkipDataParsing: true,
    }),
  update: (id: string, data: any) =>
    piramideClient.makeRequest(
      "patch",
      piramideClient.joinUrlWithParamsId(hospitalBack.UPDATE, id),
      data,
      { shouldSkipDataParsing: true }
    ),
  delete: (id: string) =>
    piramideClient.makeRequest(
      "put",
      piramideClient.joinUrlWithParamsId(hospitalBack.DELETE_, id),
      null
    ),
};
