import { redirect, type ActionFunction, type ActionFunctionArgs } from "@remix-run/cloudflare"
import { createMemoService } from "~/services/memoService.server"

export const action: ActionFunction = async ({ params, context }: ActionFunctionArgs) => {
  if (params.id) {
    const memoService = createMemoService(context.cloudflare.env)
    await memoService.archiveMemo(params.id)
  }
  return redirect("/list")
}
