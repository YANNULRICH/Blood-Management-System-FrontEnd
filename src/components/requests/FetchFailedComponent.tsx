import React from 'react';
import {useIntl} from "react-intl";
import Alert from "../bootstrap/Alert";
import A11yButton from "../A11yButton";
import IntlMessages from "../IntlMessages";

export type FetchFailedComponentProps = {
    onRetryClick?: () => any;
    errorMessageComponent?: any;
}

/**
 * Display generic error and retry button when a request failed
 * @param onRetryClick
 * @param errorMessageComponent
 */
const FetchFailedComponent = ({onRetryClick, errorMessageComponent}: FetchFailedComponentProps) => {
    const intl = useIntl();

    const _onRetryClick = (e: React.FormEvent<any>) => {
        e.preventDefault();
        if (onRetryClick)
            onRetryClick();
    };

    return (
        <Alert color="danger" isOutline>
            {errorMessageComponent ? (
                <>
                    {errorMessageComponent(onRetryClick)}
                </>
            ) : (
                <>
                    {`${intl.formatMessage({id: 'errors.fetch.failed'})}. `}
                    <A11yButton<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>
                        elementType="span"
                        className="alert-link text-decoration-underline cursor-pointer"
                        onClick={_onRetryClick}>
                        <IntlMessages id="general.pleaseTryAgain" />
                    </A11yButton>
                </>
            )}
        </Alert>
    );
};

export default FetchFailedComponent;