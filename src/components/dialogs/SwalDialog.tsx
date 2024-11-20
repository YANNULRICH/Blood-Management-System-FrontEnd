import React, {useEffect} from 'react';
import Swal, {SweetAlertOptions} from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import IntlMessages from "../IntlMessages";
import {globalT} from "../../lang";

const MySwal = withReactContent(Swal);

export type SwalConfirmDialogProps = {
    // This is a watcher
    launcher: string | number | boolean,
    onCancel?: () => void,
    onConfirm?: () => void,
    title?: React.ReactNode,
    message?: React.ReactNode,
    swalProperties?: (swalConfig: SweetAlertOptions) => SweetAlertOptions,
}

const SwalConfirmDialog = ({ launcher, title, onConfirm, onCancel, message, swalProperties }: SwalConfirmDialogProps) => {

    const getNumberOfBtns = () => {
        if (onCancel && onConfirm) {
            return 2;
        } else if (onCancel || onConfirm) {
            return 1;
        } else {
            return 0;
        }
    }

    const showDialog = () => {
        const numberOfButtons = getNumberOfBtns();
        const defaultSwalConfig: SweetAlertOptions = {
            title: <>{title}</>,
            html: message ? (
                <div className=''>
                    <h6>{message}</h6>
                </div>
            ) : undefined,
            icon: 'success',

            // options
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,

            // Confirm button
            showConfirmButton: numberOfButtons !== 0,
            focusConfirm: true,
            confirmButtonAriaLabel: globalT('button.yes'),
            confirmButtonText: globalT('button.yes'),

            // Cancel button
            showCancelButton: numberOfButtons > 1,
            cancelButtonAriaLabel: globalT('button.no'),
            cancelButtonText: globalT('button.no'),

            // Deny button
            showDenyButton: false,
            denyButtonAriaLabel: globalT('button.no'),
            denyButtonText: globalT('button.no'),

            // close button on the top right
            showCloseButton: true,
            closeButtonHtml: '<i class="bx bx-sm bx-x"></i>',

            buttonsStyling: false,
            customClass: {
                container: `custom-swal-container ${numberOfButtons === 1 ? 'one-btn' : ''}`,
                popup: '',
                title: '',
                closeButton: '',
                icon: '',
                image: '',
                htmlContainer: '',
                input: '',
                inputLabel: '',
                validationMessage: '',
                actions: '',
                confirmButton: 'btn btn-primary me-5',
                denyButton: 'btn btn-light-danger',
                cancelButton: 'btn btn-light-primary',
                loader: '',
                footer: '',
                timerProgressBar: '',
            },
        };

        const comingConfig = swalProperties ? swalProperties(defaultSwalConfig) : {};

        MySwal.fire({
            ...defaultSwalConfig,
            ...comingConfig,
        })
            .then((result) => {
                if (result.isConfirmed) {
                    if (onConfirm)
                        onConfirm();
                } else if (onCancel) onCancel();
                // return false;
            });
    }

    useEffect(() => {
        if (launcher)
            showDialog();
    }, [launcher]);

    return <div />;
};

export default SwalConfirmDialog;
