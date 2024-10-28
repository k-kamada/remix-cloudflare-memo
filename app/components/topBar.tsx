import { Link, useLoaderData, useLocation } from "@remix-run/react"
import type { LoaderData } from "~/root"

export const TopBar = () => {
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
