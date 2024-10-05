import { configureStore } from '@reduxjs/toolkit';

import rootReducer from "./reducers";

function configureAppStore() {
    const middlewareOptions = {
        serializableCheck: false
    };

    const store = configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware(middlewareOptions),
    });

    return store;
}

export default configureAppStore();