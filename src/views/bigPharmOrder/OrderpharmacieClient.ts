import pharmapClient from "../../network";
import { AxiosResponse } from "axios";
import {
  AxiosRequestConfigExtended,
  CSUClientApiResponse,
} from "../../network/network.types";
import { orderBloodBack } from "./url/back";
import { joinUrlWithParamsId } from "../../commons/helpers/funcHelper";
import OrderBloodModel from "./OrderPharmacieModel";

export const orderPharmacieClient = {
  getAll: (filterParams?: object | null) => {
    return new Promise<
      AxiosResponse<
        CSUClientApiResponse<OrderBloodModel[]>,
        AxiosRequestConfigExtended
      >
    >((resolve, reject) => {
      pharmapClient
        .makeRequest<OrderBloodModel[]>(
          "get",
          orderBloodBack.GET_ALL,
          filterParams || null
        )
        .then((resp) => {
          console.log("aaaaaaaaaaaaaa", resp.data);
          resolve({
            ...resp,
            data: {
              ...resp.data,
              results: resp.data.results.map((d) => new OrderBloodModel(d)),
            },
          });
        })
        .catch((err) => reject(err));
    });
  },
  getOne: (id: string) => {
    return new Promise<
      AxiosResponse<
        CSUClientApiResponse<OrderBloodModel>,
        AxiosRequestConfigExtended
      >
    >((resolve, reject) => {
      pharmapClient
        .makeRequest<OrderBloodModel>(
          "get",
          pharmapClient.joinUrlWithParamsId(orderBloodBack.GET_ONE, id)
        )
        .then((resp) =>
          resolve({
            ...resp,
            data: {
              ...resp.data,
              results: new OrderBloodModel(resp.data),
            },
          })
        )
        .catch((err) => reject(err));
    });
  },

  create: (data: any) =>
    pharmapClient.makeRequest("post", orderBloodBack.CREATE, data, {
      shouldSkipDataParsing: true,
    }),
  getOrderByPharmId: (id: string) => {
    return new Promise((resolve, reject) => {
      pharmapClient
        .makeRequest("post", orderBloodBack.GET_ORDER_BLOOD, { id: id })
        .then((resp) => {
          resolve({
            ...resp.data,
            data: {
              ...resp.data,
              results: resp.data.results,
            },
          });
        })
        .catch((error) => reject(error));
    });
  },
  getDrugOderById: (id: string) => {
    return new Promise((resolve, reject) => {
      pharmapClient
        .makeRequest(
          "get",
          joinUrlWithParamsId(orderBloodBack.GET_DRUG_BY_ID, id)
        )
        .then((resp) => {
          resolve({
            ...resp.data,
            data: {
              ...resp.data,
              results: resp.data.results,
            },
          });
        })
        .catch((error) => reject(error));
    });
  },
  getOderHistory: (id: string) => {
    return new Promise((resolve, reject) => {
      pharmapClient
        .makeRequest(
          "get",
          joinUrlWithParamsId(orderBloodBack.GET_ODER_HISTORY_BY_ID, id)
        )
        .then((resp) => {
          resolve({
            ...resp.data,
            data: {
              ...resp.data,
              results: resp.data.results,
            },
          });
        })
        .catch((error) => reject(error));
    });
  },
  update: (id: string, data: any) =>
    pharmapClient.makeRequest(
      "patch",
      pharmapClient.joinUrlWithParamsId(orderBloodBack.UPDATE, id),
      data,
      { shouldSkipDataParsing: true }
    ),
  delete: (id: string) =>
    pharmapClient.makeRequest(
      "delete",
      pharmapClient.joinUrlWithParamsId(orderBloodBack.DELETE, id),
      null
    ),
  changeOrderStatut: (id: string) =>
    pharmapClient.makeRequest(
      "get",
      pharmapClient.joinUrlWithParamsId(orderBloodBack.CHANGE_ORDER_STATUT, id),
      null
    ),
  cancelOrder: (id: string) =>
    pharmapClient.makeRequest(
      "get",
      pharmapClient.joinUrlWithParamsId(orderBloodBack.CANCEL_ORDER, id),
      null
    ),
  generateFile: (id: string) =>
    pharmapClient.makeRequest(
      "get",
      pharmapClient.joinUrlWithParamsId(orderBloodBack.GENERATE_FILE, id)
    ),
};
