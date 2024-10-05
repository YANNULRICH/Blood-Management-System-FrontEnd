import React from 'react';
import {CSSTransition} from "react-transition-group";

export type CustomTransitionProps = {
    show: boolean,
    children: React.ReactNode,
}

const SingleItemTransition = ({show, ...restProps}: CustomTransitionProps) => {
    return (
        <CSSTransition
            in={show}
            timeout={200}
            classNames="custom-transition"
            unmountOnExit
            // onEnter={() => setShowButton(false)}
            // onExited={() => setShowButton(true)}
        >
            {restProps.children}
        </CSSTransition>
    );
};

export default SingleItemTransition;