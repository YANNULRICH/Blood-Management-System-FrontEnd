import {createReducer} from "@reduxjs/toolkit";
import * as actions from "./actions";
import { FilterPatientsType } from '../../redux.types';

export const INITIAL_STATE: FilterPatientsType = actions.getInitState();

const reducer = createReducer(INITIAL_STATE, (builder) => {
	builder
		.addCase(actions.setFilterPatientsSearch, (state, action) => {
			state.search = action.payload;
		})
});

export default reducer;
