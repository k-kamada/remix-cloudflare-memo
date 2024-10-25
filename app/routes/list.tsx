import type { LoaderFunctionArgs } from "@remix-run/cloudflare"
import { useLoaderData } from "@remix-run/react"
import { MemoList } from "~/components/memoList"
import { getMemoService } from "~/services/memoService.server"

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const memoService = getMemoService(context.cloudflare.env)
  const memos = await memoService.getAllMemos(false)
  return { memos: memos }
}

export default function List() {
  const data = useLoaderData<typeof loader>()
  return <div>
    <MemoList memos={data.memos} />
  </div>
}
