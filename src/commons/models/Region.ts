import dayjs from 'dayjs';

export default class Region {
	public id: string;
	public code: string;
	public slug: string;
	public name: string;
	public en: string;
	public country: string;
	public createdAt: dayjs.Dayjs;
	public updatedAt: dayjs.Dayjs;

	constructor(data: any) {
		this.id = data.id;
		this.code = data.code;
		this.slug = data.slug;
		this.name = data.name;
		this.en = data.en;
		this.country = data.country;
		this.createdAt = dayjs(data.createdAt);
		this.updatedAt = dayjs(data.updatedAt);
	}
}
