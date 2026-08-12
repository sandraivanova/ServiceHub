export enum PriceUnit {
    HOUR = 'HOUR',
    PROJECT = 'PROJECT',
    SQUARE_METER = 'SQUARE_METER',
    DAY = 'DAY',
    WEEK = 'WEEK',
    MONTH = 'MONTH',
    PIECE = 'PIECE',
    LINEAR_METER = 'LINEAR_METER',
    SESSION = 'SESSION',
    PER_KM = 'PER_KM',
}

export enum ServiceCategory {
    ELECTRICIAN = 'ELECTRICIAN',
    PLUMBER = 'PLUMBER',
    CLEANING = 'CLEANING',
    PAINTING = 'PAINTING',
    CARPENTRY = 'CARPENTRY',
    CONSTRUCTION = 'CONSTRUCTION',
    HVAC = 'HVAC',
    APPLIANCE_REPAIR = 'APPLIANCE_REPAIR',
    GARDENING = 'GARDENING',
    TAILORING = 'TAILORING',
    TRANSPORT = 'TRANSPORT',
    LOCKSMITH = 'LOCKSMITH',
    EDUCATION = 'EDUCATION',
    IT_SERVICES = 'IT_SERVICES',
    OTHER = 'OTHER',
}

export enum Location {
    BEROVO = 'BEROVO',
    BITOLA = 'BITOLA',
    BOGDANCI = 'BOGDANCI',
    DELCEVO = 'DELCEVO',
    DEMIR_HISAR = 'DEMIR_HISAR',
    DEMIR_KAPIJA = 'DEMIR_KAPIJA',
    DEBAR = 'DEBAR',
    DOJRAN = 'DOJRAN',
    GEVGELIJA = 'GEVGELIJA',
    GOSTIVAR = 'GOSTIVAR',
    KAVADARCI = 'KAVADARCI',
    KICEVO = 'KICEVO',
    KOCANI = 'KOCANI',
    KRATOVO = 'KRATOVO',
    KRIVA_PALANKA = 'KRIVA_PALANKA',
    KRUSEVO = 'KRUSEVO',
    KUMANOVO = 'KUMANOVO',
    MAKEDONSKA_KAMENICA = 'MAKEDONSKA_KAMENICA',
    MAKEDONSKI_BROD = 'MAKEDONSKI_BROD',
    OHRID = 'OHRID',
    OTHER = 'OTHER',
    PEHCEVO = 'PEHCEVO',
    PRILEP = 'PRILEP',
    PROBISTIP = 'PROBISTIP',
    RADOVIS = 'RADOVIS',
    RESEN = 'RESEN',
    SKOPJE = 'SKOPJE',
    STIP = 'STIP',
    STRUMICA = 'STRUMICA',
    STRUGA = 'STRUGA',
    TETOVO = 'TETOVO',
    VALANDOVO = 'VALANDOVO',
    VELES = 'VELES',
    VINICA = 'VINICA'
}


import {DbModel} from "./db.model";

export interface IGivingService extends DbModel {
    providerId: number;
    title: string;
    price: number;
    priceUnit: PriceUnit;
    category: ServiceCategory;
    location: string;
    description: string;
    yearsOfExperience?: number;
    imageUrl?: string;
    phone: string;
    availability?: string;
}