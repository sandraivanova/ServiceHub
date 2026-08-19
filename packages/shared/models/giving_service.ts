import {DbModel} from "./db.model";
import {IUser} from "./user";
import {IReview} from "./review";

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
    reviews: IReview[]

    //AUTO GENERATED
    provider: IUser;
}

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

export const PRICE_UNIT_LABELS:
    Record<PriceUnit, string> = {
    [PriceUnit.HOUR]: 'час',
    [PriceUnit.PROJECT]: 'проект',
    [PriceUnit.SQUARE_METER]: 'квадратен метар (m²)',
    [PriceUnit.DAY]: 'ден',
    [PriceUnit.WEEK]: 'недела',
    [PriceUnit.MONTH]: 'месец',
    [PriceUnit.PIECE]: 'парче',
    [PriceUnit.LINEAR_METER]: 'должен метар',
    [PriceUnit.SESSION]: 'сесија',
    [PriceUnit.PER_KM]: 'по километар',
};

export const CATEGORY_LABELS:
    Record<ServiceCategory, string> = {
    [ServiceCategory.ELECTRICIAN]: 'Електричар',
    [ServiceCategory.PLUMBER]: 'Водоводџија',
    [ServiceCategory.CLEANING]: 'Чистење',
    [ServiceCategory.PAINTING]: 'Молерисување',
    [ServiceCategory.CARPENTRY]: 'Столарија',
    [ServiceCategory.CONSTRUCTION]: 'Градежништво',
    [ServiceCategory.HVAC]: 'Клима уреди и греење',
    [ServiceCategory.APPLIANCE_REPAIR]: 'Поправка на апарати',
    [ServiceCategory.GARDENING]: 'Градинарство',
    [ServiceCategory.TAILORING]: 'Кројачки услуги',
    [ServiceCategory.TRANSPORT]: 'Преселување и транспорт',
    [ServiceCategory.LOCKSMITH]: 'Клучар',
    [ServiceCategory.EDUCATION]: 'Туторство и едукација',
    [ServiceCategory.IT_SERVICES]: 'ИТ услуги',
    [ServiceCategory.OTHER]: 'Друго',
};

export const LOCATION_LABELS:
    Record<Location, string> & { [key: string]: string } = {
    [Location.BEROVO]: 'Берово',
    [Location.BITOLA]: 'Битола',
    [Location.BOGDANCI]: 'Богданци',
    [Location.DELCEVO]: 'Делчево',
    [Location.DEMIR_HISAR]: 'Демир Хисар',
    [Location.DEMIR_KAPIJA]: 'Демир Капија',
    [Location.DEBAR]: 'Дебар',
    [Location.DOJRAN]: 'Дојран',
    [Location.GEVGELIJA]: 'Гевгелија',
    [Location.GOSTIVAR]: 'Гостивар',
    [Location.KAVADARCI]: 'Кавадарци',
    [Location.KICEVO]: 'Кичево',
    [Location.KOCANI]: 'Кочани',
    [Location.KRATOVO]: 'Кратово',
    [Location.KRIVA_PALANKA]: 'Крива Паланка',
    [Location.KRUSEVO]: 'Крушево',
    [Location.KUMANOVO]: 'Куманово',
    [Location.MAKEDONSKA_KAMENICA]: 'Македонска Каменица',
    [Location.MAKEDONSKI_BROD]: 'Македонски Брод',
    [Location.OHRID]: 'Охрид',
    [Location.OTHER]: 'Друго',
    [Location.PEHCEVO]: 'Пехчево',
    [Location.PRILEP]: 'Прилеп',
    [Location.PROBISTIP]: 'Пробиштип',
    [Location.RADOVIS]: 'Радовиш',
    [Location.RESEN]: 'Ресен',
    [Location.SKOPJE]: 'Скопје',
    [Location.STIP]: 'Штип',
    [Location.STRUMICA]: 'Струмица',
    [Location.STRUGA]: 'Струга',
    [Location.TETOVO]: 'Тетово',
    [Location.VALANDOVO]: 'Валандово',
    [Location.VELES]: 'Велес',
    [Location.VINICA]: 'Виница',
};

