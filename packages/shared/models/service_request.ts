import {DbModel} from "./db.model";
import {IUser} from "./user";
import {Location, PriceUnit, ServiceCategory, Urgency} from "./giving_service";

export interface IServiceRequest extends DbModel {
    clientId: number;
    title: string;
    price?: number;
    priceUnit?: PriceUnit;
    category: ServiceCategory;
    urgency: Urgency
    serviceMode: ServiceMode
    location: Location;
    description: string;
    yearsOfExperience?: number;
    imageUrl?: string;
    phone: string;
    timePreference?:TimePreference;
    duration?:string;
    deadline?: Date;
    //AUTO GENERATED
    client: IUser;
}

export enum ServiceMode {
    ONLINE = 'online',
    IN_PERSON = 'in_person',
    BOTH = 'both'
}

export enum TimePreference {
    MORNING = 'morning',
    AFTERNOON = 'afternoon',
    EVENING = 'evening',
    FLEXIBLE = 'flexible'
}

export const TIME_PREFERENCE_LABELS:
    Record<TimePreference, string> = {
    [TimePreference.MORNING]: 'наутро',
    [TimePreference.AFTERNOON]: 'попладне',
    [TimePreference.EVENING]: 'навечер',
    [TimePreference.FLEXIBLE]: 'флексибилно',

};

export const SERVICE_MODE_LABELS:
    Record<ServiceMode, string> = {
    [ServiceMode.ONLINE]: 'онлјан',
    [ServiceMode.IN_PERSON]: 'во живо',
    [ServiceMode.BOTH]: 'комбинирано',
};