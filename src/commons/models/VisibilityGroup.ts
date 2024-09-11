
export default class VisibilityGroup {
	public id: string;
	public name: string;
	public code: string;
	public description: string;

	constructor(data: any) {
		this.id = data.id;
		this.name = data.name;
		this.code = data.code;
		this.description = data.description;
	}
}
