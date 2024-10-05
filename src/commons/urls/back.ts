export const USERS = {
    AUTH: {
        ME: '/users/me/',
        LOGIN: '/auth/token/',
        LOGOUT: '/auth/logout/',
        REFRESH: '/auth/refresh-token/'
    }
};

export const SECURITY = {
    ROLES: {
        GET_ALL: '/groups/',
        GET_ONE: '/groups/{id}/',
        CREATE: '/groups/',
        UPDATE: '/groups/{id}/',
        DELETE: '/groups/{id}/',
        DELETE_: '/groups/{id}/soft_delete/',
    },
    PERMISSIONS: {
        GET_ALL: '/permissions/',
        GET_ONE: '/permissions/{id}/',
        CREATE: '/permissions/',
        UPDATE: '/permissions/{id}/',
        DELETE: '/permissions/{id}/',
        DELETE_: '/permissions/{id}/soft_delete/',
    },
    VISIBILITY_GROUPS: {
        GET_ALL: '/visibility-groups/',
        GET_ONE: '/visibility-groups/{id}',
        CREATE: '/visibility-groups/',
        UPDATE: '/visibility-groups/{id}/',
        DELETE: '/visibility-groups/{id}/',
        DELETE_: '/visibility-groups/{id}/soft_delete/',
    },
    USERS: {
        GET_ALL: '/users/',
        GET_ONE: '/users/{id}/',
        CREATE: '/users/',
        UPDATE: '/users/{id}/',
        UPDATE_PASSWORD: '/users/{id}/set-password/',
        UPDATE_MY_PASSWORD: '/users/set-my-password/',
        DELETE: '/users/{id}/',
        DELETE_: '/users/{id}/soft_delete/',
    },
}

export const LOCATION = {
    COUNTRY: {
        GET_ALL: '/countries/',
    },
    REGION: {
        GET_ALL: '/regions/',
        GET_ONE: '/regions/{id}/',
        CREATE: '/regions/',
        UPDATE: '/regions/{id}/',
        DELETE: '/regions/{id}/',
        DELETE_: '/regions/{id}/soft_delete/',
    },
    DEPARTMENT: {
        GET_ALL: '/departments/',
        GET_ONE: '/departments/{id}/',
        CREATE: '/departments/',
        UPDATE: '/departments/{id}/',
        DELETE: '/departments/{id}/',
        DELETE_: '/departments/{id}/soft_delete/',
    },
    DISTRICT: {
        GET_ALL: '/districts/',
        GET_ONE: '/districts/{id}/',
        CREATE: '/districts/',
        UPDATE: '/districts/{id}/',
        DELETE: '/districts/{id}/',
        DELETE_: '/districts/{id}/soft_delete/',
    },
    FOSA: {
        GET_ALL: '/health_area/',
        GET_ONE: '/health_area/{id}/',
        CREATE: '/health_area/',
        UPDATE: '/health_area/{id}/',
        DELETE: '/health_area/{id}/',
        DELETE_: '/health_area/{id}/soft_delete/',
    },
}


export const OTHERS = {
    CONTACTS: {
        GET_ALL: '/contacts/',
        GET_ONE: '/contacts/{id}/',
        CREATE: '/contacts/',
        UPDATE: '/contacts/{id}/',
        DELETE: '/contacts/{id}/',
        DELETE_: '/contacts/{id}/soft_delete/',
    },
}
