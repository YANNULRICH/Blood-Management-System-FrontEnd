import {createAction} from "@reduxjs/toolkit";
import * as types from '../../actionTypes';

export const setRequestGlobalLoader = createAction(types.SET_REQUEST_GLOBAL_LOADER, (shouldLoad) => ({
    payload: shouldLoad,
}));