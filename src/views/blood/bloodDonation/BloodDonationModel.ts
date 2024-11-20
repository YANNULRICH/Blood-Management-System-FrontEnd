import dayjs from 'dayjs';
import BloodTypeModel from "../bloodType/BloodTypeModel";
import DonorModel from "../../donor/donor/DonorModel";
import BloodBankModel from "../bloodBank/BloodBankModel";

export default class BloodDonationModel {
    public id: string;
    public ExpirationDate: string;
    public donor: DonorModel;
    public bloodBank: BloodBankModel;
    public quantity: string;
    public createdAt: dayjs.Dayjs;
    public updatedAt: dayjs.Dayjs;

    constructor(data: any) {
        this.id = data.id;
        this.ExpirationDate = data.ExpirationDate;
        this.bloodBank = data.bloodBank;
        this.donor = data.donor;
        this.quantity = data.quantity;
        this.createdAt = dayjs(data.createdAt);
        this.updatedAt = dayjs(data.updatedAt);
    }
}
