import piramideClient from "../../network";
import { AxiosResponse } from "axios";
import {
  AxiosRequestConfigExtended,
  CSUClientApiResponse,
} from "../../network/network.types";
import { appUsersBack } from "./url/back";
import AppUserModel from "./AppUserModel";

export const appUserClient = {
  getAll: (filterParams?: object) => {
    return new Promise<
      AxiosResponse<
        CSUClientApiResponse<AppUserModel[]>,
        AxiosRequestConfigExtended
      >
    >((resolve, reject) => {
      piramideClient
        .makeRequest<AppUserModel[]>(
          "get",
          appUsersBack.GET_ALL,
          filterParams || null
        )
        .then((resp) => {
          console.log("aaaaaaaa :", resp);
          return resolve({
            ...resp,
            data: {
              ...resp.data,
              results: resp.data.results.map((d) => new AppUserModel(d)),
            },
          });
        })
        .catch((err) => reject(err));
    });
  },
  getOne: (id: string) => {
    return new Promise<
      AxiosResponse<
        CSUClientApiResponse<AppUserModel>,
        AxiosRequestConfigExtended
      >
    >((resolve, reject) => {
      piramideClient
        .makeRequest<AppUserModel>(
          "get",
          piramideClient.joinUrlWithParamsId(appUsersBack.GET_ONE, id)
        )
        .then((resp) =>
          resolve({
            ...resp,
            data: {
              ...resp.data,
              results: new AppUserModel(resp.data),
            },
          })
        )
        .catch((err) => reject(err));
    });
  },
  create: (data: any) =>
    piramideClient.makeRequest("post", appUsersBack.CREATE, data, {
      shouldSkipDataParsing: true,
    }),
  update: (id: string, data: any) =>
    piramideClient.makeRequest(
      "patch",
      piramideClient.joinUrlWithParamsId(appUsersBack.UPDATE, id),
      data,
      { shouldSkipDataParsing: true }
    ),
  delete: (id: string) =>
    piramideClient.makeRequest(
      "put",
      piramideClient.joinUrlWithParamsId(appUsersBack.DELETE_, id),
      null
    ),
};
