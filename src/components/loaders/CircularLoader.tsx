import React from 'react';
import Spinner from "../bootstrap/Spinner";

export type CircularLoaderProps = React.HTMLAttributes<HTMLSpanElement> & {

}

const CircularLoader = ({ color = 'primary', ...restProps }: CircularLoaderProps) => {
    return (
        <Spinner color='primary' {...restProps} />
    );
};

export default CircularLoader;
