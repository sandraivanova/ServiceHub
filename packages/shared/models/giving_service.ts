export enum PriceUnit {
    HOUR = 'hour',
    PROJECT = 'project',
    SQUARE_METER = 'square_meter',
    DAY = 'day',
}

export enum ServiceCategory {
    ELECTRICIAN = 'electrician',
    PLUMBER = 'plumber',
    CLEANING = 'cleaning',
    PAINTING = 'painting',
    CARPENTRY = 'carpentry',
    OTHER = 'other',
}

export interface IGivingService {
    id?: number;
    providerId: number;
    title: string;
    priceFrom: number;
    priceUnit: PriceUnit;
    category: ServiceCategory;
    location: string;
    description: string;
    yearsOfExperience?: number;
    rating?: number;
    bookingCount?: number;
    imageUrl?: string;
    phone: string;
    availability?: string;
}