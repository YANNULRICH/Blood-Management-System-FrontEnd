/**
 * Auth Actions
 */
import {AppThunk} from "../../redux.types";
import csuClient from "../../../network";
import {setJwtData} from "../../../commons/helpers/jwtHelper";
import StorageHelper, {StorageKeys} from "../../../commons/helpers/StorageHelper";
import {LoginRequest, LoginSuperAdminRequest} from "../../../network/network.types";
import {LOGOUT_USER, SET_AUTH_USER, SET_AUTH_USER_FAILURE, SET_AUTH_USER_SUCCESS} from '../../actionTypes';
import {AUTH} from '../../../commons/urls/front';

/**
 * Redux Action get auth information
 */
export const setAuthUser = (): AppThunk<Promise<void>> => (dispatch) => {
    dispatch({ type: SET_AUTH_USER });

    return csuClient.users.auth
        .getDetails()
        .then(async (response) => {
            dispatch({ type: SET_AUTH_USER_SUCCESS, payload: response.data.results });
            return Promise.resolve();
        })
        .catch(async () => {
            dispatch({ type: SET_AUTH_USER_FAILURE, payload: "error" });
            // return setTimeout(() => Promise.reject(), 5000);
            return Promise.reject();
        });
};

export const loginUser = (
    data: LoginRequest | LoginSuperAdminRequest
): AppThunk<Promise<void>> => (dispatch) => {
    return new Promise<void>((resolve, reject) => {

        csuClient.users.auth.login(data)
            .then(async (res) => {
                setJwtData(
                    res.data.access,
                    res.data.refresh,
                    res.data.lifetime,
                );

                // Fetch user data
                // @ts-ignore
                await dispatch(setAuthUser());
                // const location = StorageHelper.getItem(StorageKeys.LOCATION)
                // if (location) document.location.href = location

                resolve();
            })
            .catch((error) => reject(error));
    });
};

export const logoutUser = (): AppThunk<Promise<void>> => async (dispatch) => {
    // await csuClient.users.auth.logout();
    const currentLocation = window.location.href;
    StorageHelper.setItem(StorageKeys.LOCATION, currentLocation)
    StorageHelper.removeItem(StorageKeys.JWT);
    document.location.replace(AUTH.LOGIN)
    dispatch({ type: LOGOUT_USER, payload: null });
    // For later, we'll wrap the whole store to listen to this event and if received, clear the whole store
    // dispatch({ type: CLEAR_AUTH_USER_DATA, payload: null });
};
