import React from 'react';
import {CSSTransition, SwitchTransition as RTGSwitchTransition} from "react-transition-group";

export type SwitchAnimProps = {
    mode: string,
    children: React.ReactNode;
}

const SwitchTransition = ({ mode, children }: SwitchAnimProps) => {
    return (
        <RTGSwitchTransition mode="out-in">
            <CSSTransition
                key={mode}
                classNames="fade"
                addEndListener={(node, done) => {
                    node.addEventListener("transitionend", done, false);
                }}
            >
                {children}
            </CSSTransition>
        </RTGSwitchTransition>
    );
};

export default SwitchTransition;
