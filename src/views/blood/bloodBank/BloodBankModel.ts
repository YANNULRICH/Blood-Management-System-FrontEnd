import dayjs from 'dayjs';

export default class BloodBankModel {
    public id: string;
    public code: string;
    public bloodGroup: string;
    public quantity: string;
    public createdAt: dayjs.Dayjs;
    public updatedAt: dayjs.Dayjs;

    constructor(data: any) {
        this.id = data.id;
        this.code = data.code;
        this.bloodGroup = data.bloodGroup;
        this.quantity = data.quantity;
        this.createdAt = dayjs(data.createdAt);
        this.updatedAt = dayjs(data.updatedAt);
    }
}
