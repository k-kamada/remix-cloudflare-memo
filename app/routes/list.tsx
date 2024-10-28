import type { LoaderFunction } from "@remix-run/cloudflare"
import { useLoaderData } from "@remix-run/react"
import { MemoList } from "~/components/memoList"
import type { Memo } from "~/models/memo"
import { getMemoService } from "~/services/memoService.server"

interface LoaderData {
  memos: Memo[]
}

export const loader: LoaderFunction = async ({ context }) => {
  const memoService = getMemoService(context.cloudflare.env)
  const memos = await memoService.getAllMemos(false)
  return { memos: memos } as LoaderData
}

export default function List() {
  const data = useLoaderData<LoaderData>()
  return <MemoList memos={data.memos} />
}
