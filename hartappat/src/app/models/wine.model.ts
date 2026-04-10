
export type WineView = {
  id: number;
  name: string;
  country: string;
  wineType: string;
  grapes: string[]
  systembolaget?: number;
  //volume?: number;
  //createdAt?: string;
  vintage?: string;
  isUsed: boolean;
  lastTastingId?: number;
  lastTasted?: string;
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
  grapes: WineGrape[];
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
  lastTastingId?: number | null;
  lastTasted?: string | null;
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

