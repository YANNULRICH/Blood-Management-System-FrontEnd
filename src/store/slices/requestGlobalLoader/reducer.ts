import {createReducer} from "@reduxjs/toolkit";
import * as actions from "./actions";

export const INITIAL_STATE = false;

const reducer = createReducer(INITIAL_STATE, (builder) => {
    builder
        .addCase(actions.setRequestGlobalLoader, (state, action) => action.payload);
});

export default reducer;