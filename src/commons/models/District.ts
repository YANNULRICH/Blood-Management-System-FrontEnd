import dayjs from 'dayjs';
import Department from "./Department";

export default class District {
	public id: string;
	public code: string;
	public slug: string;
	public name: string;
	public department: Department;
	public createdAt: dayjs.Dayjs;
	public updatedAt: dayjs.Dayjs;

	constructor(data: any) {
		this.id = data.id;
		this.code = data.code;
		this.slug = data.slug;
		this.name = data.name;
		this.department = data.department;
		this.createdAt = dayjs(data.createdAt);
		this.updatedAt = dayjs(data.updatedAt);
	}
}
