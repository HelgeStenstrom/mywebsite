export type CountryApi = {
  id: number;
  name: string;
  isUsed: boolean;
};

export type WineTypeApi = {
  id: number;
  name: string;
  isUsed: boolean;
};

export type Grape = {
  id: number;
  name: string;
  color: string;
};



export type MemberCreate = {
  given: string;
  surname: string;
}

export type Member = {
  id: number;
  given: string;
  surname: string;
}
