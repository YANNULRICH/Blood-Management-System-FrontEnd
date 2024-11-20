import {AxiosRequestConfig} from "axios";

export type CSUClientApiResponse<T> = {
    results: T,
    count: number,
    current_page: number,
    next: string | null,
    previous: string | null,
}

export type AxiosRequestConfigExtended = AxiosRequestConfig & {
    shouldSkipToken?: boolean;
    shouldSkipDataParsing?: boolean;
    skipSnakeCaseTransform?: boolean;
    skipSnakeCaseTransformRequest?: boolean;
    /**
     * Whether to remove value like undefined, '' and []
     */
    removeTrashValueRequest?: boolean;
    fileData?: Array<string>;
    skipErrorCodes?: Array<number>;
}

export interface FetchResource<ContentType, Error = any> {
    loading: boolean,
    fetched?: boolean,
    error: Error,
    content: ContentType | null,
}

export interface FetchResourceWatcher<ContentType, Error = any> extends FetchResource<ContentType, Error> {
    watcher: string
}

export type PaginatedRequestParams = {
    page?: number
    pageSize?: number
    orderBy?: string
    orderDirection?: string
    search?: string
}

/* Request */

export type LoginSuperAdminRequest = {
    password: string,
    email: string,
    secretQuestionAnswer: string,
}

export type LoginRequest = {
    password: string,
    email: string,
}

export type PasswordChangeRequest = {
    password: string,
    oldPassword: string,
}

export type EnrollmentStatsByStatusResponse = {
    enrollCount: number,
    validCount: number,
    invalidCount: number,
    potentialDuplicatesCount: number,
    offlineCount: number,
    pendingCount: number,
}

export type EnrollmentStatsResponse = {
    enrollCount: number;
    total: number,
    validCount: number,
    invalidCount: number,
    potentialDuplicatesCount: number,
    offlineCount: number,
}

export type EnrollmentStatsOverTimeResponse = {
    [key: string]: number
}
