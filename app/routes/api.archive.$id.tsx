import { redirect, type ActionFunction } from "@remix-run/cloudflare"
import { getMemoService } from "~/services/memoService.server"

export const action: ActionFunction = async ({ params, context }) => {
  if (params.id) {
    const memoService = getMemoService(context.cloudflare.env)
    await memoService.archiveMemo(params.id)
  }
  return redirect("/list")
}
