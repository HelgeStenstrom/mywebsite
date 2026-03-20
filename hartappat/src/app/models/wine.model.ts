
export type WineView = {
  id: number;
  name: string;
  country: string;
  wineType: string;
  systembolaget?: number;
  volume?: number;
  createdAt?: string;
  vintage?: string;
  isUsed: boolean;
};

export type WineCreate = {
  name: string;
  countryId: number;
  wineTypeId: number;
  vintageYear?: number | null;
  isNonVintage?: boolean;
  systembolaget?: number;
  volume?: number;
};

export type WineApi = {
  id: number;
  name: string;
  country: {
    id: number;
    name: string;
  };
  wineType: {
    id: number;
    name: string;
  };
  systembolaget?: number;
  volume?: number;
  createdAt?: string;
  vintageYear: number | null;
  isNonVintage: boolean;
  isUsed: boolean;
};

export type WineGrape = {
  id: number;
  wineId: number;
  grapeId: number;
  percentage: number | null;
};

export type WineGrapeCreate = {
  grapeId: number;
  percentage?: number | null;
};

