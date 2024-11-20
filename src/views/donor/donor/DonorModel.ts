import dayjs from 'dayjs';

export default class DonorModel {
    public id: string;
    public name: string;
    public surname: string;
    public sex: string;
    public age: string;
    public phoneNumber: string;
    public date: string;
    public email: string;
    public password: string;
    public bloodGroup: string;
    public createdAt: dayjs.Dayjs;
    public updatedAt: dayjs.Dayjs;

    constructor(data: any) {
        this.id = data.id;
        this.name = data.name;
        this.surname = data.surname;
        this.sex = data.sex;
        this.age = data.age;
        this.phoneNumber = data.phoneNumber;
        this.bloodGroup = data.bloodGroup;
        this.date = data.date;
        this.email = data.email;
        this.password = data.password;
        this.createdAt = dayjs(data.createdAt);
        this.updatedAt = dayjs(data.updatedAt);
    }
}
