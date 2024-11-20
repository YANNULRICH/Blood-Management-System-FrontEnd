
export const HOME = '/';

export const AUTH = {
    ROUTES_ENGINE: {
       PROFILE: 'profile'
    },
    LOGIN: '/login',
    PROFILE: '/dashboard/profile',
    FORGOT_PASSWORD: '/forgot-password'
};

export const DASHBOARD = {
    ROUTES_ENGINE: {
        INDEX: 'dashboard/*',
    },
    INDEX: '/dashboard',
}

export const SECURITY = {
    ROUTES_ENGINE: {
        INDEX: 'security/*',
        ROLES: {
            INDEX: 'roles/*',
            ADD: 'add',
            UPDATE: ':id/update'
        },
        PERMISSIONS: {
            INDEX: 'permissions/*'
        },
        VISIBILITY_GROUPS: {
            INDEX: 'visibility-groups/*',
            ADD: 'add',
            DETAILS: ':id',
            UPDATE: ':id/update'
        },
        USERS: {
            INDEX: 'users/*',
            ADD: 'add',
            DETAILS: ':id',
            UPDATE: ':id/update'
        }
    },
    ROLES: {
        INDEX: '/dashboard/security/roles',
        ADD: '/dashboard/security/roles/add',
        UPDATE: '/dashboard/security/roles/:id/update'
    },
    PERMISSIONS: {
        INDEX: '/dashboard/security/permissions'
    },
    VISIBILITY_GROUPS: {
        INDEX: '/dashboard/security/visibility-groups',
        ADD: '/dashboard/security/visibility-groups/add',
        DETAILS: '/dashboard/security/visibility-groups/:id',
        UPDATE: '/dashboard/security/visibility-groups/:id/update',
    },
    USERS: {
        INDEX: '/dashboard/security/users',
        ADD: '/dashboard/security/users/add',
        DETAILS: '/dashboard/security/users/:id',
        UPDATE: '/dashboard/security/users/:id/update',
    }
}

export const ERRORS = {
    ROUTES_ENGINE: {
        INDEX: 'errors/*',
        '403': '403',
        '404': '404',
    },
    '404': '/errors/404',
    '403': '/errors/403',
}

export const AGENDA = {
    ROUTES_ENGINE: {
        INDEX: 'agenda',
    },
    INDEX: '/dashboard/agenda',
}

