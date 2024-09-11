import React from "react";
import { Store } from 'react-notifications-component';
import {
	iNotification,
	NOTIFICATION_TYPE
} from "react-notifications-component/dist/src/typings";
import StorageHelper, {StorageKeys} from "../../commons/helpers/StorageHelper";

const _settings: iNotification = {
	insert: 'top',
	container: 'top-right',
	animationIn: ['animate__animated', 'animate__fadeIn'],
	animationOut: ['animate__animated', 'animate__fadeOut'],
	dismiss: {
		duration: 8000,
		pauseOnHover: true,
		onScreen: true,
		showIcon: true,
		waitForAnimation: true,
	},
};

const showNotification = (title: any, message: any, type: NOTIFICATION_TYPE = 'default') => {
	Store.addNotification({
		title,
		message: null,
		type,
		..._settings,
	});
};

const displayNotification = (message: string, type: NOTIFICATION_TYPE = 'default') => {
	const _message = (
		<span className='d-flex center-ver'>
			<span className='me-3'>
				{type === 'danger' ? (<i className='bx bx-md bx-x' />)
					: type === 'warning' ? (<i className='bx bx-md bx-error' />)
						: type === 'info' ? (<i className='bx bx-md bx-info-circle' />) : <i className='bx bx-md bx-check-circle' />}
			</span>
			<span className='pl-2 fs-6'>{message}</span>
		</span>
	);
	Store.addNotification({
		title: null,
		message: _message,
		type,
		..._settings,
	});
};

const addNotificationItem = (notificationItem: { message: string, type: NOTIFICATION_TYPE }) => {
	let notifications = StorageHelper.getItem(StorageKeys.SCHEDULE_NOTIFICATIONS);
	if (notifications) {
		notifications = JSON.parse(notifications);
		if (Array.isArray(notifications)) {
			notifications.push(notificationItem);
			StorageHelper.setItem(StorageKeys.SCHEDULE_NOTIFICATIONS, JSON.stringify(notifications));
			return;
		}
	}

	StorageHelper.setItem(StorageKeys.SCHEDULE_NOTIFICATIONS, JSON.stringify([notificationItem]));
}

export const NotificationManager = {
	error: (message: string, isScheduled: boolean = false) => {
		if (isScheduled) {
			addNotificationItem({ message, type: 'danger' });
		} else displayNotification(message, 'danger');
	},
	warning: (message: string, isScheduled: boolean = false) => {
		if (isScheduled) {
			addNotificationItem({ message, type: 'warning' });
		} else displayNotification(message, 'warning');
	},
	info: (message: string, isScheduled: boolean = false) => {
		if (isScheduled) {
			addNotificationItem({ message, type: 'info' });
		} else displayNotification(message, 'info');
	},
	success: (message: string, isScheduled: boolean = false) => {
		if (isScheduled) {
			addNotificationItem({ message, type: 'success' });
		} else displayNotification(message, 'success');
	},
}

export default NotificationManager;
