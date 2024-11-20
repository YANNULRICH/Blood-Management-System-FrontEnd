import {globalT} from "../../lang";
import {isLiteralObject} from "./funcHelper";
import NotificationManager from "../../components/notifications/NotificationManager";

/**
 * Map errors and display them
 *
 *
 * NOTE: It was decided that displayed message will be the one from the backend
 * @param errors
 */
export const errorManager = (errors: any) => {
    if (typeof errors === 'string') {
        NotificationManager.error(errors);
        return;
    }

    if (isLiteralObject(errors)) {
        Object.values(errors).forEach((error) => {
            errorManager(error);
        });
        return;
    }

    if (Array.isArray(errors)) {
        // Map through errors and display them
        errors.forEach((error) => {
            errorManager(error);
            /* if (Array.isArray(error)) {
              errorManager(error);
            } else if (typeof error === 'string') {
              NotificationManager.error(error);
            } */
        });
        return;
    }

    // Display Error 400 in case of no errors present or wrong type found
    NotificationManager.error(globalT('errors.400.feedback'));
};
