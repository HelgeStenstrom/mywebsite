export type WineDto = {
    id: number;
    name: string;
    country: CountryDto;
    wineType: WineTypeDto;
    systembolaget?: number;
    volume?: number;
};

export type WineCreateDto = {
    id: number;
    name: string;
    countryId: number;
    wineTypeId: number;
    systembolaget?: number;
    volume?: number;
};

export type WineTypeDto = {
    id: number;
    name: string;
    isUsed: boolean;
};

export type CountryDto = {
    id: number;
    name: string;
    isUsed: boolean;
};
