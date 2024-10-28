import type { LinksFunction, LoaderFunction } from "@remix-run/cloudflare";
import {
  Link,
  Links,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
} from "@remix-run/react";

import tailwind from "./tailwind.css?url";
import { getSessionStorage } from "./sessions";

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

interface LoaderData {
  login?: boolean
}

export const loader: LoaderFunction = async ({ request, context }) => {
  const sessionStorage = getSessionStorage(context)
  const session = await sessionStorage.getSession(request.headers.get("Cookie"))
  const url = new URL(request.url)
  const isLoggedin = session.has("user")
  if (!isLoggedin && url.pathname !== "/login") {
    throw redirect("/login")
  }
  return { login: isLoggedin } as LoaderData
}

export default function App() {
  return <div className="flex flex-col h-svh overflow-y-auto">
    <TopBar />
    <Outlet />
  </div>
}

const TopBar = () => {
  const data = useLoaderData<LoaderData>()
  return (
    <div className="bg-orange-300 w-full pt-2 flex justify-center gap-4 sticky top-0 z-3">
      {data.login ? <>
        <TopBarTag to="/">New</TopBarTag>
        <TopBarTag to="/list">Memos</TopBarTag>
        <TopBarTag to="/archivedList">Archived</TopBarTag>
      </>
        : <div>Login</div>}
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
