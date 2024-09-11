import {combineReducers} from '@reduxjs/toolkit';

import authUser from './slices/authUser/reducer';
import settings from './slices/settings/reducer';
import requestGlobalLoader from './slices/requestGlobalLoader/reducer';
import filterPatients from './slices/filterPatients/reducer';
import params from './slices/globalParams/reducer'
import treeVisility from './slices/treeVisibility/reducer'

const rootReducer = combineReducers({
    authUser,
    settings,
    requestGlobalLoader,
    filterPatients,
    params,
    treeVisility
});

export default rootReducer;
