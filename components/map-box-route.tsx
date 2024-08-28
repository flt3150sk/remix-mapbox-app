import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";

// Note: これを入れないとマーカーがズレるため注意する
import "mapbox-gl/dist/mapbox-gl.css";
import { Directions } from "~/routes/route._index";

const ACCESS_TOKEN =
  "pk.eyJ1IjoiZmx0MzE1MHNrIiwiYSI6ImNsejk2YjNybzAwZ3IycnEyNTFuempzajAifQ.sy7iBcFKgm5ulPhUpknx9w";

mapboxgl.accessToken = ACCESS_TOKEN;

type Props = {
  currentLat: number;
  currentLng: number;
  targetLat: number;
  targetLng: number;
  directions: Directions;
};

export const MapBoxRoute = ({
  currentLat,
  currentLng,
  targetLat,
  targetLng,
  directions,
}: Props) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/flt3150sk/clzxse743004n01psfpyp5fav",
      center: [currentLng, currentLat],
      zoom: 14,
      attributionControl: false,
    });

    new mapboxgl.Marker({
      color: "#2563EB",
    })
      .setLngLat([currentLng, currentLat])
      .addTo(mapRef.current!);

    new mapboxgl.Marker({
      color: "#2563EB",
    })
      .setLngLat([targetLng, targetLat])
      .addTo(mapRef.current!);

    mapRef.current?.on("load", () => {
      mapRef.current?.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: directions.routes[0].geometry.coordinates,
          },
        },
      });

      mapRef.current?.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#2563EB",
          "line-width": 8,
        },
      });
    });
  }, [
    currentLat,
    currentLng,
    directions.routes,
    directions.waypoints,
    targetLat,
    targetLng,
  ]);

  return (
    <div className="relative">
      <div
        ref={mapContainerRef}
        className="h-[calc(100vh_-_68px)] w-full overflow-hidden"
      />
      <span className="absolute top-2 left-2/4 -translate-x-2/4 bg-white py-1 px-4 rounded text-xl text-center">
        🚗 車で行くと{Math.floor(directions.routes[0].duration / 60)}
        分かかります 🚗
      </span>
    </div>
  );
};
