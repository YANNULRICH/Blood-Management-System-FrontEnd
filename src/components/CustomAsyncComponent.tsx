import React from 'react';
import IntlMessages from "./IntlMessages";
import Alert from "./bootstrap/Alert";
import CircularLoader from "./loaders/CircularLoader";

export type CustomAsyncComponentProps = {
    memorySave?: boolean;
    loading: boolean;
    error: any;
    data: any;
    onRetryClick?: Function;
    errorMessageComponent?: (onRetryClick: Function) => React.ReactNode;
    component: (data: any) => React.ReactNode;
}

/**
 *
 * @param memorySave To enable form state saving
 * @param loading
 * @param data
 * @param component
 * @param onRetryClick
 * @param errorMessageComponent
 */
const CustomAsyncComponent = ({
                                  memorySave = false,
                                  loading,
                                  data,
                                  component,
                                  onRetryClick,
                                  errorMessageComponent,
                              }: CustomAsyncComponentProps) => {

    const _onRetryClick = (event: any) => {
        if (event && event.hasOwnProperty('preventDefault')) event.preventDefault();
        if (onRetryClick) onRetryClick();
    };

    if (memorySave) {
        return (
            <>
                <div className={!loading ? 'd-none' : ''}>
                    <CircularLoader className="progress-primary mr-30 mb-10" />
                </div>
                <div className={!data || loading ? 'd-none' : ''}>{component(data)}</div>
                <div className={data || loading ? 'd-none' : ''}>
                    <Alert color="danger">
                        {errorMessageComponent ? (
                            <>{errorMessageComponent(_onRetryClick)}</>
                        ) : (
                            <>
                                This is an error alert — <strong>check it out!</strong>
                                <IntlMessages id='request.error.500' /> {' '}
                                <a href="#" onClick={_onRetryClick} className="alert-link text-decoration-underline">
                                    <IntlMessages id='request.error.tryAgain' />
                                </a>
                            </>
                        )}
                    </Alert>
                </div>
            </>
        );
    }

    return (
        <>
            {loading ? (
                <CircularLoader className="progress-primary mr-30 mb-10" />
            ) : data ? (
                <>{component(data)}</>
            ) : (
                <Alert color="danger" isOutline>
                    {errorMessageComponent ? (
                        <>{errorMessageComponent(_onRetryClick)}</>
                    ) : (
                        <>
                            <IntlMessages id='request.error.500' /> {' '}
                            <a href="#" onClick={_onRetryClick} className="alert-link text-decoration-underline">
                                <IntlMessages id='request.error.tryAgain' />
                            </a>
                        </>
                    )}
                </Alert>
            )}
        </>
    );
};

export default React.memo(CustomAsyncComponent);
