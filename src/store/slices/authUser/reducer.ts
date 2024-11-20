/**
 * Auth User Reducers
 */
import {
    SET_AUTH_USER,
    SET_AUTH_USER_SUCCESS,
    SET_AUTH_USER_FAILURE,
    LOGOUT_USER,
} from '../../actionTypes';
import {AuthUserType} from "../../redux.types";

/**
 * initial state
 */
const INIT_STATE: AuthUserType = {
    data: null,
    error: null,
    loading: true,
    fetched: false,
};

const reducer = (state = INIT_STATE, action: any) => {
    switch (action.type) {
        case SET_AUTH_USER:
            return { ...state, loading: true };

        case SET_AUTH_USER_SUCCESS:
            return { error: null, loading: false, fetched: true, data: action.payload };

        case SET_AUTH_USER_FAILURE:
            return { data: null, loading: false, fetched: true, error: action.payload };

        case LOGOUT_USER:
            return { ...INIT_STATE };

        default:
            return { ...state };
    }
};

export default reducer;
