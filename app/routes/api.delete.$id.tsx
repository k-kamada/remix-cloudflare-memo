import { redirect, type ActionFunction, type ActionFunctionArgs } from "@remix-run/cloudflare"
import { getMemoService } from "~/services/memoService.server"

export const action: ActionFunction = async ({ params, context }: ActionFunctionArgs) => {
  if (params.id) {
    const memoService = getMemoService(context.cloudflare.env)
    await memoService.deleteMemo(params.id)
  }
  return redirect("/archivedList")
}
