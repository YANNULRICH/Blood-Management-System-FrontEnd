
export default class UserList {
	public id: string;
	public firstName: string;
	public lastName: string;
	public gender: 'M' | 'F';
	public phoneNumber: string;
	public registerNumber: string;
	public email: string;
	public isActive: boolean;

	constructor(data: any) {
		this.id = data.id;
		this.firstName = data.firstName;
		this.lastName = data.lastName;
		this.gender = data.gender;
		this.phoneNumber = data.phoneNumber || '';
		this.registerNumber = data.registerNumber || '';
		this.email = data.email;
		this.isActive = data.isActive;
	}

	getFullName = () => {
		return `${this.firstName} ${this.lastName}`
	}

	getFullGenderKey = () => {
		return this.gender === 'M' ? `form.field.gender.male` : `form.field.gender.female`;
	}
}
