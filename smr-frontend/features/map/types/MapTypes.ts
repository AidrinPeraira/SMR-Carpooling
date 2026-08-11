export type MapPoint = [number, number];

export type SearchSuggestion = {
  id: string;
  title: string;
  address: string;
  point?: MapPoint;
};

export type Place = {
  id: string;
  title: string;
  address: string;
  lat: number;
  lng: number;
};

export type Route = {
  origin: MapPoint;
  destination: MapPoint;
  totalLengthKm: number;
  totalTimeMin: number;
  route: MapPoint[];
};
