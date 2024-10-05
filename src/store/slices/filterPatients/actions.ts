import {createAction} from "@reduxjs/toolkit";
import * as types from '../../actionTypes';
import { getAllQueryParams } from '../../../commons/helpers/urlHelper';
import { DataTableUrlFilters } from '../../../components/DataTable/types';

export const getInitState = () => {
	const queryParams = getAllQueryParams<DataTableUrlFilters>();
	return {
		search: queryParams.search
	}
}

export const setFilterPatientsSearch = createAction(types.FILTER_PATIENTS_SEARCH, (search: string | undefined) => ({
	payload: search,
}));
