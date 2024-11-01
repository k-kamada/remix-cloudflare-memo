import {
  type LoaderFunction,
  redirect,
  type ActionFunction
} from "@remix-run/cloudflare";
import { Form, useActionData } from "@remix-run/react";
import { RoundedNavigationButton } from "~/components/roundedButton";
import { getAuthenticationService } from "~/services/authenticationService.server";
import { getSessionStorage } from "~/sessions";

export const action: ActionFunction = async ({ request, context }) => {
  const authService = getAuthenticationService(context)
  const formData = await request.formData()
  const username = formData.get("username")?.toString() ?? ""
  const plainPassword = formData.get("password")?.toString() ?? ""
  const result = await authService.verifyPassword(username, plainPassword)
  if (result) {
    const sessionStorage = getSessionStorage(context)
    const session = await sessionStorage.getSession(request.headers.get("Cookie"))
    session.set("user", username)
    return redirect("/", {
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(session),
      }
    })
  }
  return { error: true, message: "Failed to login" }
}

export const loader: LoaderFunction = async ({ request, context }) => {
  const sessionStorage = getSessionStorage(context)
  const session = await sessionStorage.getSession(request.headers.get("Cookie"))
  const isLoggedin = session.has("user")
  if (isLoggedin) {
    throw redirect("/")
  }
  return { login: isLoggedin }
}

interface ActionData {
  error?: boolean
  message?: string
}

export default function Login() {
  const data = useActionData<ActionData>()
  return (
    <Form
      method="post"
      className="mt-4 bg-gray-200 w-md py-2 border-2 border-black rounded-md self-center flex flex-col gap-2 items-center">

      <input
        name="username"
        type="text"
        placeholder="username"
        className="w-3/4"
      />
      <input
        name="password"
        type="password"
        placeholder="password"
        className="w-3/4"
      />
      <RoundedNavigationButton type="submit">
        Login
      </RoundedNavigationButton>
      {data?.error ? <div className="text-red-500">{data.message}</div> : null}
    </Form>
  )
}
