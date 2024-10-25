import type { ActionFunction, ActionFunctionArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/react";
import { MemoForm } from "~/components/memoForm";
import { Memo } from "~/models/memo";
import { createMemoService } from "~/services/memoService.server";
import { v7 as uuid } from "uuid"

// create new Memo
export const action: ActionFunction = async ({ request, context }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const title = formData.get("title")?.toString() ?? "no title"
  const body = formData.get("body")?.toString() ?? ""
  const memoId = uuid()
  const memoService = createMemoService(context.cloudflare.env)
  const newMemo = memoService.createMemo(new Memo(memoId, title, body))
  return json(newMemo)
}

export default function Index() {
  return (
    <div className="h-full">
      <MemoForm action="/?index" />
    </div>
  );
}
