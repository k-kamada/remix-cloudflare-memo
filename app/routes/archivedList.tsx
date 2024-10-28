import type { ActionFunction, LoaderFunction } from "@remix-run/cloudflare"
import { Form, useLoaderData } from "@remix-run/react"
import { MemoList } from "~/components/memoList"
import { RoundedDangerButton } from "~/components/roundedButton"
import type { Memo } from "~/models/memo"
import { getMemoService } from "~/services/memoService.server"

interface LoaderData {
  memos: Memo[]
}

export const action: ActionFunction = async ({ context }) => {
  const memoService = getMemoService(context.cloudflare.env)
  const result = await memoService.deleteAllArchivedMemos()
  return { result }
}

export const loader: LoaderFunction = async ({ context }) => {
  const memoService = getMemoService(context.cloudflare.env)
  const memos = await memoService.getAllMemos(true)
  return { memos: memos } as LoaderData
}

export default function ArchivedList() {
  const data = useLoaderData<LoaderData>()
  return <div className="flex flex-col items-center">
    <MemoList memos={data.memos} />
    {data.memos.length > 0
      ? <Form method="post">
        <RoundedDangerButton type="submit">
          Wipe All
        </RoundedDangerButton>
      </Form>
      : null
    }
  </div>
}
