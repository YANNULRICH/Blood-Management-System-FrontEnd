import React, {useEffect} from 'react';
import {ReactNotifications} from "react-notifications-component";
import StorageHelper, {StorageKeys} from "../../commons/helpers/StorageHelper";
import NotificationManager from "./NotificationManager";

const ReactNotificationWrapper = () => {
    const handleScheduleNotifications = () => {
        let notifications = StorageHelper.getItem(StorageKeys.SCHEDULE_NOTIFICATIONS);
        if (notifications) {
            notifications = JSON.parse(notifications);
            if (Array.isArray(notifications)) {
                notifications.forEach((notification: any) => {
                   if (notification.message && ['error', 'warning', 'success', 'info'].includes(notification.type)) {
                       // @ts-ignore
                       NotificationManager[notification.type](notification.message);
                   }
                });
            }
        }

        StorageHelper.removeItem(StorageKeys.SCHEDULE_NOTIFICATIONS);
    }

    useEffect(() => {
        handleScheduleNotifications();
    }, []);

    return (
        <div>
            <ReactNotifications />
        </div>
    );
};

export default ReactNotificationWrapper;