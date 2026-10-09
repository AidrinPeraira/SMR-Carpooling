import { Place, SearchSuggestion } from "@/features/map/types/MapTypes";
import { SearchBoxCore, SearchSession } from "@mapbox/search-js-core";

const MAP_BOX_API_KEY = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export class SearchProvider {
  private _searchBox: SearchBoxCore;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _searchSession: SearchSession<any, any, any, any>;

  constructor() {
    this._searchBox = new SearchBoxCore({
      accessToken: MAP_BOX_API_KEY,
    });
    this._searchSession = new SearchSession(this._searchBox);
  }

  async searchSuggestions(place: string): Promise<SearchSuggestion[]> {
    const response = await this._searchSession.suggest(place);

    return response.suggestions.map(
      (suggestion: Record<string, string>) => ({
        id: suggestion.mapbox_id,
        title: suggestion.name,
        address:
          suggestion.full_address ||
          suggestion.place_formatted ||
          suggestion.name,
      }),
    );
  }

  async getPlaceDetails(suggestion: SearchSuggestion): Promise<Place> {
    if (suggestion.point) {
      const [lng, lat] = suggestion.point;
      return {
        id: suggestion.id,
        title: suggestion.title,
        address: suggestion.address,
        lat,
        lng,
      };
    }

    const response = await this._searchSession.retrieve({
      mapbox_id: suggestion.id,
      name: suggestion.title,
      full_address: suggestion.address,
    } as Parameters<typeof this._searchSession.retrieve>[0]);

    const feature = response.features?.[0];
    if (!feature) {
      throw new Error(
        `Failed to retrieve details for place: ${suggestion.title}`,
      );
    }

    const [lng, lat] = feature.geometry.coordinates;
    return {
      id: suggestion.id,
      title: suggestion.title,
      address: suggestion.address,
      lat,
      lng,
    };
  }
}
