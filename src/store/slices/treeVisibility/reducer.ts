import {createReducer, PayloadAction} from "@reduxjs/toolkit";
import * as actions from "./action";
import {LanguageDict} from "../../../commons/types";

export const INITIAL_STATE: { treeNode: any[] } = {
    treeNode: [],
};

const reducer = createReducer(INITIAL_STATE, (builder) => {
    builder
        .addCase(actions.setTree, (state, action: PayloadAction<any[]>) => {
            state.treeNode = action.payload;
        })
});

export default reducer;
