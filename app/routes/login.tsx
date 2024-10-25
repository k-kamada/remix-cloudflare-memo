import { ActionFunction, ActionFunctionArgs, LoaderFunction, redirect } from "@remix-run/cloudflare";
import { Form, useActionData } from "@remix-run/react";
import { RoundedNavigationButton } from "~/components/roundedButton";
import { getAuthenticationService } from "~/services/authenticationService.server";
import { getSessionStorage } from "~/sessions";

export const action: ActionFunction = async ({ request, context }: ActionFunctionArgs) => {
  const authService = getAuthenticationService(context)
  const formData = await request.formData()
  const username = formData.get("username")?.toString() ?? ""
  const plainPassword = formData.get("password")?.toString() ?? ""
  const result = await authService.login(username, plainPassword)
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
  return { error: "Failed to login" }
}

// export const loader: LoaderFunction = () => {
// }

export default function Login() {
  const data = useActionData<typeof action>()
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
      <div>
        <RoundedNavigationButton type="submit">
          Login
        </RoundedNavigationButton>
      </div>
      {data ? <div className="text-red-500">{data.error}</div> : null}
    </Form>
  )
}
