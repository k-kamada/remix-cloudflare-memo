import type { LinksFunction } from "@remix-run/cloudflare";
import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "@remix-run/react";

import tailwind from "./tailwind.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwind }
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <div className="flex flex-col h-screen overflow-y-auto">
    <TopBar />
    <Outlet />
  </div>
}

const TopBar = () => {
  return (
    <div className="bg-orange-300 w-full pt-2 flex justify-center gap-4 sticky top-0 z-3">
      <TopBarTag to="/">New</TopBarTag>
      <TopBarTag to="/list">Memos</TopBarTag>
      <TopBarTag to="/archivedList">Archived</TopBarTag>
    </div>
  )
}

const TopBarTag = (props: { to: string, children: string }) => {
  const location = useLocation()
  const isActive = (path: string): boolean => {
    return location.pathname === path
  }

  return (
    <Link
      to={props.to}
      className={`px-1 rounded-t-sm ${isActive(props.to) ? "bg-white" : "bg-orange-300"} `}
    >
      {props.children}
    </Link>
  )
}
