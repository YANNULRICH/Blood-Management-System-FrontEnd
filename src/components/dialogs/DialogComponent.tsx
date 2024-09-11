import React from 'react';
import Button from "../bootstrap/Button";
import IntlMessages from "../IntlMessages";
import Modal, {ModalBody, ModalFooter, ModalHeader, IModalProps, ModalTitle} from "../bootstrap/Modal";

export interface DialogComponentProps extends Omit<IModalProps, 'setIsOpen' | 'titleId' | 'isOpen'> {
    id?: string,
    show: boolean,
    title: React.ReactNode,
    footer?: React.ReactNode,
    children: React.ReactNode,
    submitBtn?: {
        others?: Record<string, any>;
        onClick: (event?: React.FormEvent<HTMLButtonElement>) => any;
    },
    onClose: (hasChanged: boolean, newData?: any) => void,
    isIconText?: boolean,
}

/**
 * Used for dialog and form
 * @param title
 * @param show
 * @param onClose
 * @param children
 * @param footer
 * @param submitBtn
 * @param props
 * @constructor
 */
const DialogComponent = ({ id, title, show, onClose, children, footer, submitBtn, isIconText, ...props }: DialogComponentProps) => {
    return (
        <Modal
            isOpen={show}
            setIsOpen={() => onClose(false)}
            isCentered
            isScrollable
            {...props}>
            <ModalHeader isIconText={isIconText ? true : false} setIsOpen={() => onClose(false)}>
                <ModalTitle id={`title-${id}`} tag='h5'>{title}</ModalTitle>
            </ModalHeader>
            <ModalBody>{children}</ModalBody>
            {footer && <ModalFooter>{footer}</ModalFooter>}
            {submitBtn && (
                <ModalFooter>
                    <Button
                        color='info'
                        isOutline
                        className='border-0'
                        onClick={() => onClose(false)}>
                        <IntlMessages id='button.cancel' />
                    </Button>
                    <Button
                        color='primary'
                        icon='bx-pull-left bx-save'
                        onClick={submitBtn.onClick}
                        {...(submitBtn.others || {})}
                    >
                        <IntlMessages id='button.submit' />
                    </Button>
                </ModalFooter>
            )}
        </Modal>
    );
};

export default DialogComponent;
