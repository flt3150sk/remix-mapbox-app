const ACCESS_TOKEN =
  "pk.eyJ1IjoiZmx0MzE1MHNrIiwiYSI6ImNsejk2YjNybzAwZ3IycnEyNTFuempzajAifQ.sy7iBcFKgm5ulPhUpknx9w";

export type GeocodeV6 = {
  type: string;
  features: {
    type: string;
    id: string;
    geometry: {
      type: string;
      coordinates: [number, number];
    };
    properties: {
      mapbox_id: string;
      feature_type: string;
      full_address: string;
      name: string;
      name_preferred: string;
      coordinates: {
        longitude: number;
        latitude: number;
      };
      place_formatted: string;
      context: {
        region: {
          mapbox_id: string;
          name: string;
          wikidata_id: string;
          region_code: string;
          region_code_full: string;
        };
        country: {
          mapbox_id: string;
          name: string;
          wikidata_id: string;
          country_code: string;
          country_code_alpha_3: string;
        };
        place: {
          mapbox_id: string;
          name: string;
          wikidata_id: string;
        };
      };
    };
  }[];
  attribution: string;
};

export const getGeocodeV6 = async (address: string) => {
  try {
    const response = await fetch(
      `https://api.mapbox.com/search/geocode/v6/forward?q=${address}&access_token=${ACCESS_TOKEN}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch geocode");
    }

    const data = (await response.json()) as GeocodeV6;

    return data;
  } catch (error) {
    throw new Error("Failed to fetch geocode");
  }
};
