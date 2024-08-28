import { json, LoaderFunctionArgs, redirect } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { MapBoxRoute } from "components/map-box-route";

export type Directions = {
  routes: {
    weight_name: string;
    weight: number;
    duration: number;
    distance: number;
    legs: {
      via_waypoints: [];
      admins: {
        iso_3166_1_alpha3: string;
        iso_3166_1: string;
      }[];
      weight: number;
      duration: number;
      steps: [];
      distance: number;
      summary: string;
    }[];
    geometry: { coordinates: [number, number][] };
  }[];
  waypoints: {
    distance: number;
    name: string;
    location: [number, number];
  }[];
  code: string;
  uuid: string;
};

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const query = new URL(request.url);

  const currentLat = query.searchParams.get("current-lat");
  const currentLng = query.searchParams.get("current-lng");
  const targetLat = query.searchParams.get("target-lat");
  const targetLng = query.searchParams.get("target-lng");


  const res = await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/driving/${currentLng},${currentLat};${targetLng},${targetLat}?access_token=${context.cloudflare.env.ACCESS_TOKEN}&geometries=geojson`
  );

  const directions = (await res.json()) as Directions;

  if (!currentLat || !currentLng || !targetLat || !targetLng) {
    return redirect("/404");
  }

  return json({
    currentLat,
    currentLng,
    targetLat,
    targetLng,
    directions,
  });
};

export default function Index() {
  const { currentLat, currentLng, targetLat, targetLng, directions } =
    useLoaderData<typeof loader>();

  console.log(directions);

  return (
    <div className="flex">
      <div className="flex-1 h-[calc(100vh_-_68px)]">
        <MapBoxRoute
          currentLat={Number(currentLat)}
          currentLng={Number(currentLng)}
          targetLat={Number(targetLat)}
          targetLng={Number(targetLng)}
          directions={directions}
        />
      </div>
    </div>
  );
}
