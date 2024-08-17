import { json, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import { getShops } from "service/getShops";

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const shops = await getShops(context);

  return json({ shops });
};

export default function Index() {
  const { shops } = useLoaderData<typeof loader>();

  return (
    <div className="flex">
      <div className="flex-1 h-[calc(100vh_-_68px)]"></div>
      <ul className="w-80 border-l border border-gray-200 divide-y-[1px] h-[calc(100vh_-_68px)] overflow-scroll">
        {shops.map((shop) => (
          <li key={shop.id} className="p-4 flex flex-col gap-1">
            <h3 className="font-bold">
              <Link to={`/${shop.id}`} className="text-blue-700 underline">
                {shop.name}
              </Link>
            </h3>
            <p className="text-gray-500 text-sm">{shop.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
