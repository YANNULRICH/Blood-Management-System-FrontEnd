import dayjs from "dayjs";

export default class AppUserModel {
  public id: string;
  public name: string;
  public surname: string;
  public sex: string;
  public email: string;
  public phoneNumber: string;
  public hospital: AppUserModel;
  public password: string;
  public createdAt: dayjs.Dayjs;
  public updatedAt: dayjs.Dayjs;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.phoneNumber = data.phoneNumber;
    this.sex = data.sex;
    this.email = data.email;
    this.surname = data.surname;
    this.hospital = data.hospital;
    this.password = data.password;
    this.createdAt = dayjs(data.createdAt);
    this.updatedAt = dayjs(data.updatedAt);
  }
}
