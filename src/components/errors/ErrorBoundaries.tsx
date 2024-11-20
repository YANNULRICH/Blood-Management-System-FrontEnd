import React, { Component, ErrorInfo } from "react";
import SomethingWentWrong500 from "./SomethingWentWrong500";

// eslint-disable-next-line @typescript-eslint/ban-types
export type ErrorBoundaryProps = {
    children: React.ReactNode
}
export type ErrorBoundaryState = {
    error?: Error;
    errorInfo?: ErrorInfo;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { error: undefined, errorInfo: undefined };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Error occurred ", {
            error,
            errorInfo
        })
        // Catch errors in any components below and re-render with error message
        this.setState({
            error,
            errorInfo
        });
    }

    render() {
        if (this.state.errorInfo) {
            // Error path
            return (
                <SomethingWentWrong500
                    errorMessage={this.state.error?.toString()}
                    stacktrace={this.state.errorInfo.componentStack || this.state.error?.stack}
                />
            );
        }
        // Normally, just render children
        return this.props.children;
    }
}
