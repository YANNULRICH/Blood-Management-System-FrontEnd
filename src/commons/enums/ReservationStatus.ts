import {Enumify} from "./Enumify";

export class ReservationStatus extends Enumify {
    static planned = new ReservationStatus("PLANNED")
    static reserved = new ReservationStatus("RESERVED")
    static cancel = new ReservationStatus("CANCEL")
    static finish = new ReservationStatus("FINISH")

    constructor(value: string) {
        super();
        this.value = value
    }
}