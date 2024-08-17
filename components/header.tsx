import { Link } from "@remix-run/react";

export const HEADER_HEIGHT = 68;

export const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between">
      <h1 className="text-3xl">🍜 Ramen App</h1>
      <ul className="flex gap-4 items-center">
        <li>
          <Link to="https://remix.run/docs" className="flex gap-1 items-center">
            <span>🔍</span>探す
          </Link>
        </li>
        <li>
          <Link
            to="https://developers.cloudflare.com/pages/framework-guides/deploy-a-remix-site/"
            className="flex gap-1 items-center"
          >
            <span>🖊️</span>追加する
          </Link>
        </li>
      </ul>
    </header>
  );
};
