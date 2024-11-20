import {createAction} from "@reduxjs/toolkit";
import * as types from '../../actionTypes';
import {LanguageDict} from "../../../commons/types";

export const setLanguage = createAction(types.SET_LANGUAGE, (language: LanguageDict) => ({
    payload: language,
}));
