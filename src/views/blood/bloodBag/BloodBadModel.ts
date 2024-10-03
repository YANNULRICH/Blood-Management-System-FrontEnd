import dayjs from 'dayjs';
import BloodTypeModel from "../bloodType/BloodTypeModel";
import BloodBankModel from "../bloodBank/BloodBankModel";

export default class BloodBadModel {
    public id: string;
    public code: string;
    public bloodType: BloodTypeModel;
    public bloodBank: BloodBankModel;
    public quantity: string;
    public createdAt: dayjs.Dayjs;
    public updatedAt: dayjs.Dayjs;

    constructor(data: any) {
        this.id = data.id;
        this.code = data.code;
        this.bloodType = data.bloodType;
        this.bloodBank = data.bloodBank;
        this.quantity = data.quantity;
        this.createdAt = dayjs(data.createdAt);
        this.updatedAt = dayjs(data.updatedAt);
    }
}
