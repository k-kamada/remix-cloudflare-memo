import { redirect, type ActionFunction, type ActionFunctionArgs } from "@remix-run/cloudflare"
import { memoService } from "~/services/memoService.server"

export const action: ActionFunction = async ({ params }: ActionFunctionArgs) => {
  if (params.id) {
    await memoService.deleteMemo(params.id)
  }
  return redirect("/archivedList")
}
