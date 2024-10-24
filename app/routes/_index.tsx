import type { ActionFunction, ActionFunctionArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/react";
import { MemoForm } from "~/components/memoForm";
import { Memo } from "~/models/memo";
import { memoService } from "~/services/memoService.server";

// create new Memo
export const action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const title = formData.get("title")?.toString() ?? "no title"
  const body = formData.get("body")?.toString() ?? ""
  const newMemo = memoService.createMemo(new Memo(title, body))
  return json(newMemo)
}

export default function Index() {
  return (
    <div className="h-full">
      <MemoForm action="/?index" />
    </div>
  );
}
