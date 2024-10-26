import { redirect, type ActionFunction } from "@remix-run/cloudflare";
import { Form } from "@remix-run/react";
import { RoundedDangerButton } from "~/components/roundedButton";
import { getSessionStorage } from "~/sessions";

export const action: ActionFunction = async ({ request, context }) => {
  const sessionStorage = getSessionStorage(context)
  const session = await sessionStorage.getSession(request.headers.get("Cookie"))
  return redirect("/login", {
    "headers": {
      "Set-Cookie": await sessionStorage.destroySession(session),
    }
  })
}

export default function Logout() {
  return (
    <Form method="post">
      <RoundedDangerButton type="submit">
        Logout
      </RoundedDangerButton>
    </Form>
  )
}
