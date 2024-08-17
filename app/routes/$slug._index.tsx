import { json, LoaderFunctionArgs, redirect } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { getShop } from "service/getShop";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.slug;

  if (!id) {
    return redirect("/404");
  }

  try {
    const shop = await getShop(id);
  
    return json({ shop });
  } catch (error) {
    return redirect("/404");
  }
};

export default function Index() {
  const { shop } = useLoaderData<typeof loader>();

  return (
    <div className="flex">
      <div className="flex-1 h-[calc(100vh_-_68px)]"></div>
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
      </div>
    </div>
  );
}
