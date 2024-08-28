import { json, LoaderFunctionArgs, redirect } from "@remix-run/cloudflare";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { getShop } from "service/getShop";

export const loader = async ({ params, context }: LoaderFunctionArgs) => {
  const id = params.slug;

  if (!id) {
    return redirect("/404");
  }

  try {
    const shop = await getShop(id, context);
    const imgUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s-r+0000ff(${shop.lng},${shop.lat})/${shop.lng},${shop.lat},13/400x400@2x?access_token=${context.cloudflare.env.ACCESS_TOKEN}`;

    return json({ shop, imgUrl });
  } catch (error) {
    return redirect("/404");
  }
};

export default function Index() {
  const { shop, imgUrl } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <div className="flex">
      <div className="flex-1 h-[calc(100vh_-_68px)]">
        <img src={imgUrl} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="p-2 w-80 border-l border space-y-2 border-gray-200 h-[calc(100vh_-_68px)] overflow-scroll">
        <dl className="flex flex-col gap-1">
          <dt className="font-bold">ID</dt>
          <dd>{shop.id}</dd>
        </dl>
        <dl className="flex flex-col gap-1">
          <dt className="font-bold">名前</dt>
          <dd>
            <a
              className="text-blue-700 underline"
              target="_blank"
              href={`https://www.google.com/maps/search/?api=1&query=${shop.lat},${shop.lng}`}
              rel="noreferrer"
            >
              {shop.name}
            </a>
          </dd>
        </dl>
        <dl className="flex flex-col gap-1">
          <dt className="font-bold">説明</dt>
          <dd>{shop.description}</dd>
        </dl>
        <button
          type="button"
          className="p-2 bg-blue-600 rounded text-white w-full mt-8"
          onClick={() => {
            navigator.geolocation.getCurrentPosition((position) => {
              navigate(
                `/route?current-lat=${position.coords.latitude}&current-lng=${position.coords.longitude}&target-lat=${shop.lat}&target-lng=${shop.lng}`
              );
            });
          }}
        >
          ルート案内
        </button>
      </div>
    </div>
  );
}
