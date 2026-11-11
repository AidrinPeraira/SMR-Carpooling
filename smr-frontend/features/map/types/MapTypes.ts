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

export type RouteStep = {
  maneuver: {
    type: string;
    modifier?: string;
    instruction: string;
    location: MapPoint;
  };
  distance: number;
  duration: number;
  name: string;
};

export type NavigationRoute = Route & {
  steps: RouteStep[];
};

export type NavigationState = {
  currentSegmentIndex: number;
  totalSegments: number;
  currentStep: RouteStep | null;
  distanceToNextManeuver: number;
  currentRoute: NavigationRoute | null;
};
