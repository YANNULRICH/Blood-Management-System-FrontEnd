import dayjs from "dayjs";

export default class OrderBloodModel {
  public id: string;
  public commandNumber: string;
  public quantity: string;
  public first_name: string;
  public users: OrderBloodModel;
  public blood_type: OrderBloodModel;
  public code: string;

  //  public updatedAt: OrderBloodModel;
  constructor(data: any) {
    this.id = data.id;
    this.commandNumber = data.commandNumber;
    this.first_name = data.first_name;
    this.quantity = data.quantity;
    this.users = data.users;
    this.blood_type = data.blood_type;
    this.code = data.code;
  }
}
