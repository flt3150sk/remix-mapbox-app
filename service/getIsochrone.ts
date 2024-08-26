const ACCESS_TOKEN =
  "pk.eyJ1IjoiZmx0MzE1MHNrIiwiYSI6ImNsejk2YjNybzAwZ3IycnEyNTFuempzajAifQ.sy7iBcFKgm5ulPhUpknx9w";

type Isochrone = {
  features: {
    properties: {
      "fill-opacity": number;
      fillColor: string;
      opacity: number;
      fill: string;
      fillOpacity: number;
      color: string;
      contour: number;
      metric: string;
    };
    geometry: {
      coordinates: number[][][];
      type: string;
    };
  }[];
  type: string;
};

export const getIsochrone = async (
  type: "walking" | "driving",
  lat: number,
  lng: number
) => {
  try {
    const response = await fetch(
      `https://api.mapbox.com/isochrone/v1/mapbox/${type}/${lng},${lat}?contours_minutes=15&polygons=true&access_token=${ACCESS_TOKEN}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch geocode");
    }

    const data = (await response.json()) as Isochrone;

    return data;
  } catch (error) {
    throw new Error("Failed to fetch geocode");
  }
};
