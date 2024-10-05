export type Metadata = {
    title: string;
    description?: string;
    skipTitleIntl?: boolean;
    titleWithoutAppName?: boolean,
}

export const defaultMetadata: Metadata = {
    title: 'metadata.default.title',
    description: 'metadata.default.desc',
    titleWithoutAppName: true
}

const metadata = {
    patient: {
        home: { title: 'metadata.patient.home.title' }
    },
    enrollment: {
        form: { title: 'metadata.patient.enrollment.title' },
        formUpdate: { title: 'metadata.patient.enrollment.update.title' },
        over: { title: 'metadata.patient.enrollment.over.title' },
        list: { title: 'metadata.patient.enrollment.list.title' },
        duplicates: { title: 'metadata.patient.enrollment.duplicates.title' },
    },
    auth: {
        login: { title: 'metadata.auth.login.title' }
    },
    errors: {
        404: { title: 'metadata.errors.404.title' }
    },
    dashboard: {
        index: { title: 'metadata.dashboard.index.title' },
        roles: { title: 'metadata.roles.title' },
        visibilityGroups: { title: 'metadata.groups.visibility.title' },
        permissions: { title: 'metadata.permissions.title' },
        users: { title: 'metadata.users.title' },
        addUser: { title: 'metadata.users.add.title' },
        updateUser: { title: 'metadata.users.update.title' },
    }
}

export default metadata
