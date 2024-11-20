/**
* This file contains all types of redux and related data
*
* */
import {AnyAction, ThunkAction} from "@reduxjs/toolkit";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";

import store from "./appStore";
import rootReducer from "./reducers";
import { LanguageDict } from '../commons/types';
import User from '../commons/models/User';

export type StoreResource<Type> = {
    data: Type | null,
    error: null | any,
    loading: boolean,
    fetched: boolean,
}

export type AuthUserType = {
    data: User | null,
    error: null | any,
    loading: boolean,
    fetched: boolean,
}

export type FilterPatientsType = {
    search: string | undefined,
}

export type SettingsType = {
    language: LanguageDict,
}

export type StoreType = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, StoreType, unknown, AnyAction>;

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<StoreType> = useSelector;
