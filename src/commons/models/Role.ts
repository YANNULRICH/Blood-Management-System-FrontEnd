export default class Role {
	public id: number;
	public name: string;
	public permissions: number[];

	constructor(data: any) {
		this.id = data.id;
		this.name = data.name;
		this.permissions = data.permissions;
	}
}
