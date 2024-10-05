import {createReducer, PayloadAction} from "@reduxjs/toolkit";
import * as actions from "./actions";
import {LanguageDict} from "../../../commons/types";

export const INITIAL_STATE: { params: any } = {
    params: null,
};

const reducer = createReducer(INITIAL_STATE, (builder) => {
    builder
        .addCase(actions.setParams, (state, action: PayloadAction<LanguageDict>) => {
            state.params = action.payload;
        })
});

export default reducer;
