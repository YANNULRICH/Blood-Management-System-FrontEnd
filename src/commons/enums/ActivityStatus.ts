import {Enumify} from "./Enumify";

export class ActivityStatus extends Enumify {
    static inProgress = new ActivityStatus("INPROGRESS")
    static inComing = new ActivityStatus("INCOMING")
    static done = new ActivityStatus("DONE")

    constructor(value: string) {
        super();
        this.value = value
    }
}