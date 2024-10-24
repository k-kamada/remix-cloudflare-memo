import { useLoaderData } from "@remix-run/react"
import { MemoList } from "~/components/memoList"
import { memoService } from "~/services/memoService.server"

export const loader = async () => {
  const memos = await memoService.getAllMemos(true)
  return { memos: memos }
}

export default function ArchivedList() {
  const data = useLoaderData<typeof loader>()
  return <div>
    <MemoList memos={data.memos} />
  </div>
}
