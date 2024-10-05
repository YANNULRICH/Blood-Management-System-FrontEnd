import dayjs from "dayjs";

export default class HospitalModel {
  public id: string;
  public address: string;
  public email: string;
  public phoneNumber: string;
  public name: string;
  public createdAt: dayjs.Dayjs;
  public updatedAt: dayjs.Dayjs;

  constructor(data: any) {
    this.id = data.id;
    this.address = data.address;
    this.name = data.name;
    this.email = data.email;
    this.phoneNumber = data.phoneNumber;
    this.createdAt = dayjs(data.createdAt);
    this.updatedAt = dayjs(data.updatedAt);
  }
}
