import {createReducer, PayloadAction} from "@reduxjs/toolkit";
import * as actions from "./actions";
import {LanguageDict} from "../../../commons/types";
import {SettingsType} from "../../redux.types";
import StorageHelper, {StorageKeys} from "../../../commons/helpers/StorageHelper";
import {getDefaultLanguage} from "../../../commons/helpers/funcHelper";

export const INITIAL_STATE: SettingsType = {
    language: getDefaultLanguage(),
};

const reducer = createReducer(INITIAL_STATE, (builder) => {
    builder
        .addCase(actions.setLanguage, (state, action: PayloadAction<LanguageDict>) => {
            StorageHelper.setItem(StorageKeys.LANGUAGE, action.payload);
            state.language = action.payload;
        })
});

export default reducer;
