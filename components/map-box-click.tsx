import { useRef, useEffect } from "react";
import mapboxgl, { MapMouseEvent } from "mapbox-gl";
import { RiNavigationLine, RiSearch2Line } from "@remixicon/react";

// Note: これを入れないとマーカーがズレるため注意する
import "mapbox-gl/dist/mapbox-gl.css";
import { getGeocodeV6 } from "service/getGeocodeV6";

const ACCESS_TOKEN =
  "pk.eyJ1IjoiZmx0MzE1MHNrIiwiYSI6ImNsejk2YjNybzAwZ3IycnEyNTFuempzajAifQ.sy7iBcFKgm5ulPhUpknx9w";

mapboxgl.accessToken = ACCESS_TOKEN;

type Props = {
  handleClickMap: (lng: number, lat: number) => void;
};

export const MapBoxClick = ({ handleClickMap }: Props) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/flt3150sk/cm0gaqlwt00s201om35r9afs8",
      center: [135.2384423, 34.7148621],
      zoom: 15,
      attributionControl: false,
    });

    const handleClick = (e: MapMouseEvent) => {
      const prevPopup = document.getElementsByClassName(
        "mapboxgl-marker-anchor-center"
      );
      if (prevPopup.length) prevPopup[0].remove();

      const { lng, lat } = e.lngLat;
      handleClickMap(lng, lat);

      const popup = new mapboxgl.Popup({
        offset: 25,
      }).setHTML("ここに店舗を登録しますか？");

      new mapboxgl.Marker()
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(mapRef.current!);
    };

    // Mapにクリックイベントを追加
    mapRef.current.on("click", handleClick);

    return () => {
      mapRef.current?.remove();
      mapRef.current?.off("click", handleClick);
    };
  }, [handleClickMap]);

  return (
    <div className="relative">
      <div
        ref={mapContainerRef}
        className="h-[calc(100vh_-_68px)] w-full overflow-hidden"
      />
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
    </div>
  );
};
