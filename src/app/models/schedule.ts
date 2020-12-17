import { Time } from '@angular/common';

export class ScheduleTime {
    hour: number;
    minute: number;
}

export class ScheduleDay {
    name: string;
    selected: boolean;
    startTime: ScheduleTime;
    endTime: ScheduleTime;

    constructor(name: string, selected: boolean, startTime: ScheduleTime, endTime: ScheduleTime) {
        this.name = name;
        this.selected = selected;
        this.startTime = startTime;
        this.endTime = endTime;
    }
}
