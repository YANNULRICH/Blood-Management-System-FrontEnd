import dayjs from 'dayjs';

export default class CampaignModel {
    public id: string;
    public name: string;
    public startDate: string;
    public endDate: string;
    public email: string;
    public createdAt: dayjs.Dayjs;
    public updatedAt: dayjs.Dayjs;

    constructor(data: any) {
        this.id = data.id;
        this.name = data.name;
        this.email = data.email;
        this.startDate = data.startDate;
        this.endDate = data.endDate;
        this.createdAt = dayjs(data.createdAt);
        this.updatedAt = dayjs(data.updatedAt);
    }
}
