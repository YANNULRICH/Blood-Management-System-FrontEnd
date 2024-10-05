import dayjs from 'dayjs';
import Region from "./Region";

export default class Department {
	public id: string;
	public code: string;
	public slug: string;
	public name: string;
	public region: Region;
	public createdAt: dayjs.Dayjs;
	public updatedAt: dayjs.Dayjs;

	constructor(data: any) {
		this.id = data.id;
		this.code = data.code;
		this.slug = data.slug;
		this.name = data.name;
		this.region = data.region;
		this.createdAt = dayjs(data.createdAt);
		this.updatedAt = dayjs(data.updatedAt);
	}
}
