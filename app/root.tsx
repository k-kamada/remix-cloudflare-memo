import type {
  LinksFunction,
  LoaderFunction,
} from "@remix-run/cloudflare";
import {
  Links,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { TopBar } from "./components/topBar";

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

export interface LoaderData {
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
  return { login: isLoggedin }
}

export default function App() {
  return <div className="flex flex-col h-svh overflow-y-auto">
    <TopBar />
    <Outlet />
  </div>
}
