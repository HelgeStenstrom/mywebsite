export type WineTastingCreate = {
  title: string;
  notes?: string;
  tastingDate: string;
};

export type WineTastingApi = {
  id: number;
  title: string;
  notes?: string;
  tastingDate: string;
  hosts?: WineTastingHost[];
  wines?: WineTastingWine[];
}

export type WineTastingSummary = {
  id: number;
  title: string;
  notes?: string;
  tastingDate: string;
  hosts?: WineTastingHost[];
};


export type WineTasting = {
  id: number;
  title: string;
  notes?: string;
  tastingDate: string;
  hosts?: WineTastingHost[];
  wines?: WineTastingWine[];
};

export type WineTastingHost = {
  memberId: number;
  name?: string;
};


export type WineTastingWine = {
  id: number;
  wineId: number;
  position: number | null;
  purchasePrice?: number | null;
  averageScore?: number | null;
  scoreStdDev?: number | null;
};

export type WineTastingWineCreate = {
  wineId: number;
  position: number | null;
  purchasePrice?: number | null;
  averageScore?: number | null;
};

export type WineTastingWineUpdate = {
  wineId?: number;
  position?: number  | null;
  purchasePrice?: number | null;
  averageScore?: number | null;
};
