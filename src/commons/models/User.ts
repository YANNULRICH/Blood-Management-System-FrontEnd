import dayjs from 'dayjs';
import Role from './Role';
import Permission from './Permission';
import VisibilityGroup from "./VisibilityGroup";

export default class User {
	public id: string
	public permissions: string[];
	public userPermissions: Permission[];
	public email: string;
	public roles: Role[];
	public visibilityGroups: VisibilityGroup[];
	public createdAt: dayjs.Dayjs;
	public updatedAt: dayjs.Dayjs;
	public userType: string;

	constructor(data: any) {
		this.userType = data.userTyp;
		this.id = data.id;
		this.email = data.email;
		this.permissions = (data.permissions || []);
		this.userPermissions = data.userPermissions.map((p: any) => new Permission(p));
		this.roles = (data.groups || []).map((p: any) => new Role(p));
		this.visibilityGroups = (data.visibilityGroups || []).map((p: any) => new VisibilityGroup(p));
		this.createdAt = dayjs(data.createdAt);
		this.updatedAt = dayjs(data.updatedAt);
	}

	getAllPermissionNames = (): string[] => {
		return Array.from(new Set([
			...this.permissions,
			...this.userPermissions.map(p => p.code)
		]))
	}

	// getFullGenderKey = () => {
	// 	return this.gender === 'M' ? `form.field.gender.male` : `form.field.gender.female`;
	// }
}
