export type LocationData = {
  address: string;
  city: string;
  province: string;
};

export type GetCompanyLocationResponse = {
  location: LocationData;
  lastUpdate: string | null;
};
