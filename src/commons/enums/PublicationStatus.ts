import {Enumify} from "./Enumify";

export class PublicationStatus extends Enumify {
    static validate = new PublicationStatus("OK")
    static staging = new PublicationStatus("STAGING")
    static invalidate = new PublicationStatus("BLOCK")

    constructor(value: string) {
        super();
        this.value = value
    }
}