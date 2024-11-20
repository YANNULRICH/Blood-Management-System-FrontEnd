import {createAction} from "@reduxjs/toolkit";
import * as types from '../../actionTypes';

export const setParams = createAction(types.SET_PARAMS, (params: any) => ({
    payload: params,
}));
