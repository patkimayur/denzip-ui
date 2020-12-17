export const SLOT_6AM_9AM = '6AM - 9AM';
export const SLOT_9AM_12PM = '9AM - 12PM';
export const SLOT_12PM_3PM = '12PM - 3PM';
export const SLOT_3PM_6PM = '3PM - 6PM';
export const SLOT_6PM_10PM = '6PM - 10PM';

export class HourSchedule {
    hour: number;
    minute: number;
}

export class VisitSlot {
    name: string;
    applied: boolean;

    constructor(name: string, applied: boolean) {
        this.name = name;
        this.applied = applied;
    }
}

export const DEFAULT_VISIT_SLOTS = [new VisitSlot(SLOT_6AM_9AM, false),
new VisitSlot(SLOT_9AM_12PM, false),
new VisitSlot(SLOT_12PM_3PM, false),
new VisitSlot(SLOT_3PM_6PM, false),
new VisitSlot(SLOT_6PM_10PM, false)];

export class DaySchedule {
    name: string;
    selected: boolean;
    startTime: HourSchedule;
    endTime: HourSchedule;
    visitSlots: VisitSlot[];

    // constructor(name: string, selected: boolean, startTime: HourSchedule, endTime: HourSchedule) {
    //     this.name = name;
    //     this.selected = selected;
    //     this.startTime = startTime;
    //     this.endTime = endTime;
    // }

    constructor(name: string, selected: boolean, visitSlots: VisitSlot[]) {
        this.name = name;
        this.selected = selected;
        this.visitSlots = visitSlots;
    }
}

export class UserPrefVisitSlot {
    dayScheduleList: DaySchedule[];

    constructor(dayScheduleList: DaySchedule[]) {
        this.dayScheduleList = dayScheduleList;
    }
}

export class UserRequest {
    userId: string;
    userPrefVisitSlot: UserPrefVisitSlot;

    constructor(userId: string, userPrefVisitSlot: UserPrefVisitSlot) {
        this.userId = userId;
        this.userPrefVisitSlot = userPrefVisitSlot;
    }
}
