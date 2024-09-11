import dayjs from 'dayjs';
import Role from './Role';
import UserList from './UserList';
import VisibilityGroup from './VisibilityGroup';
import Permission from "./Permission";

export default class UserListItem {
	public id: string
	public permissions: string[];
	public userPermissions: Permission[];
	public email: string;
	public roles: Role[];
	public isActive: boolean
	public visibilityGroups: VisibilityGroup[];
	public createdAt: dayjs.Dayjs;
	public updatedAt: dayjs.Dayjs;
	public userType: string;

	constructor(data: any) {
		this.userType = data.userTyp;
		this.id = data.id;
		this.email = data.email;
		this.isActive = data.isActive;
		this.permissions = (data.permissions || []);
		this.userPermissions = data.userPermissions.map((p: any) => new Permission(p));
		this.roles = (data.groups || []).map((p: any) => new Role(p));
		this.visibilityGroups = (data.visibilityGroups || []).map((p: any) => new VisibilityGroup(p));
		this.createdAt = dayjs(data.createdAt);
		this.updatedAt = dayjs(data.updatedAt);
	}

	public getActiveMap = () => {
		if (this.isActive) {
			return {
				color: 'success',
				transKey: 'status.active'
			}
		}

		return {
			color: 'danger',
			transKey: 'status.disabled'
		}
	}

}
