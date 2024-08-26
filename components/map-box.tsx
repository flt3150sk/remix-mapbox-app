import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import { Shops } from "domain/shop";
import {
  RiCarFill,
  RiNavigationLine,
  RiSearch2Line,
  RiWalkLine,
} from "@remixicon/react";

// Note: これを入れないとマーカーがズレるため注意する
import "mapbox-gl/dist/mapbox-gl.css";
import { getGeocodeV6 } from "service/getGeocodeV6";
import { getIsochrone } from "service/getIsochrone";

const ACCESS_TOKEN =
  "pk.eyJ1IjoiZmx0MzE1MHNrIiwiYSI6ImNsejk2YjNybzAwZ3IycnEyNTFuempzajAifQ.sy7iBcFKgm5ulPhUpknx9w";

mapboxgl.accessToken = ACCESS_TOKEN;

type Props = {
  shops: Shops;
};

export const MapBox = ({ shops }: Props) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const geoJson = {
    type: "FeatureCollection",
    features: shops.map((shop) => ({
      type: "Feature",
      id: shop.id,
      geometry: {
        type: "Point",
        coordinates: [shop.lng, shop.lat] as [number, number],
      },
      properties: {
        title: shop.name,
        description: shop.description,
      },
    })),
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/flt3150sk/clzxse743004n01psfpyp5fav",
      center: [135.2384423, 34.7148621],
      zoom: 15,
      attributionControl: false,
    });

    for (const feature of geoJson.features) {
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<a style="color: blue;" href="${`/${feature.id}`}">${
          feature.properties.title
        }</a><p>${feature.properties.description}</p>`
      );

      new mapboxgl.Marker()
        .setLngLat(feature.geometry.coordinates)
        .setPopup(popup)
        .addTo(mapRef.current!);
    }

    return () => mapRef.current?.remove();
  }, [geoJson.features]);

  return (
    <div className="relative">
      <div
        ref={mapContainerRef}
        className="h-[calc(100vh_-_68px)] w-full overflow-hidden"
      />
      <button
        type="button"
        className="absolute bottom-4 right-4 z-10 p-2.5 rounded-full border bg-white flex items-center justify-center rotate-90 shadow-sm"
        onClick={() => {
          navigator.geolocation.getCurrentPosition((position) => {
            mapRef.current?.flyTo({
              center: [position.coords.longitude, position.coords.latitude],
              zoom: 15,
            });
          });
        }}
      >
        <RiNavigationLine className="w-6 h-6" />
      </button>
      <div className="absolute top-4 left-4 w-[calc(100%_-_32px)] shadow-sm">
        <form
          className="relative"
          onSubmit={async (e) => {
            e.preventDefault();

            const address = (e.target as HTMLFormElement).address.value;
            const { features } = await getGeocodeV6(address);

            mapRef.current?.flyTo({
              center: features[0].geometry.coordinates,
              zoom: 15,
            });
          }}
        >
          <input
            type="search"
            name="address"
            placeholder="移動したい住所を入力してください"
            className="w-full py-2 pl-2 pr-8 border rounded"
          />
          <button>
            <RiSearch2Line className="absolute top-1/2 right-2 transform -translate-y-1/2 w-6 h-6" />
          </button>
        </form>
      </div>
      <div className="absolute top-16 left-4 flex flex-col gap-2">
        <button
          type="button"
          className="p-2.5 rounded-full border bg-white flex items-center justify-center shadow-sm"
          onClick={async () => {
            if (!mapRef.current) return;

            navigator.geolocation.getCurrentPosition(async (position) => {
              mapRef.current?.flyTo({
                center: [position.coords.longitude, position.coords.latitude],
                zoom: 15,
              });

              try {
                mapRef.current?.removeLayer("walking");
                mapRef.current?.removeSource("walking");
              } catch {
                // nothing
              }

              const res = await getIsochrone(
                "walking",
                position.coords.latitude,
                position.coords.longitude
              );

              mapRef.current?.addSource("walking", {
                type: "geojson",
                data: {
                  type: "Feature",
                  geometry: {
                    type: "Polygon",
                    coordinates: res.features[0].geometry.coordinates,
                  },
                  properties: res.features[0].properties,
                },
              });

              mapRef.current?.addLayer({
                id: "walking",
                type: "fill",
                source: "walking",
                layout: {},
                paint: {
                  "fill-color": "#0080ff",
                  "fill-opacity": 0.3,
                },
              });
            });
          }}
        >
          <RiWalkLine className="w-6 h-6" />
        </button>
        <button
          type="button"
          className="p-2.5 rounded-full border bg-white flex items-center justify-center shadow-sm"
          onClick={async () => {
            if (!mapRef.current) return;

            navigator.geolocation.getCurrentPosition(async (position) => {
              try {
                mapRef.current?.removeLayer("driving");
                mapRef.current?.removeSource("driving");
              } catch {
                // nothing
              }

              mapRef.current?.flyTo({
                center: [position.coords.longitude, position.coords.latitude],
                zoom: 15,
              });

              const res = await getIsochrone(
                "driving",
                position.coords.latitude,
                position.coords.longitude
              );

              mapRef.current?.addSource("driving", {
                type: "geojson",
                data: {
                  type: "Feature",
                  geometry: {
                    type: "Polygon",
                    coordinates: res.features[0].geometry.coordinates,
                  },
                  properties: res.features[0].properties,
                },
              });

              mapRef.current?.addLayer({
                id: "driving",
                type: "fill",
                source: "driving",
                layout: {},
                paint: {
                  "fill-color": "#ff0008",
                  "fill-opacity": 0.3,
                },
              });
            });
          }}
        >
          <RiCarFill className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
