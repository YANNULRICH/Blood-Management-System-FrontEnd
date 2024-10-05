import dayjs from 'dayjs';

export default class Contact {
	public id: string;
	public phoneNumber?: string;
	public email?: string;
	public address?: string;
	public createdAt: dayjs.Dayjs;
	public updatedAt: dayjs.Dayjs;

	constructor(data: any) {
		this.id = data.id;
		this.phoneNumber = data.phoneNumber || "";
		this.email = data.email || "";
		this.address = data.address || "";
		this.createdAt = dayjs(data.createdAt);
		this.updatedAt = dayjs(data.updatedAt);
	}
}
