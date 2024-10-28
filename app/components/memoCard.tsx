import { Form } from "@remix-run/react"
import type { Memo } from "~/models/memo"
import { RoundedDangerButton } from "./roundedButton"
import Linkify from "linkify-react"

// used for displaying purpose only (not for creating / editing)
export const MemoCard = (props: {
  memo: Memo,
  isFocused: boolean
  setCurrentMemoId: React.Dispatch<React.SetStateAction<string | null>>
}) => {
  const borderColor = props.isFocused ? "border-sky-400" : "border-black"
  return (
    <button
      id={props.memo.id}
      className={`bg-white border-2 ${borderColor} rounded-md p-2 text-inherit text-left`}
      onClick={() => props.setCurrentMemoId(props.memo.id)}
      type="button"
    >
      <ManipulateBar
        memoId={props.memo.id}
        createdAt={props.memo.createdAt}
        isArchived={props.memo.isArchived} />
      <hr />
      <p className="py-1">{props.memo.title}</p>
      {props.memo.body.length !== 0
        ? <div>
          <hr />
          <Linkify as="p" className="py-1 whitespace-pre-wrap">
            {props.memo.body}
          </Linkify>
        </div>
        : null
      }
    </button>
  )
}

const ManipulateBar = (props: { memoId: string, createdAt: Date, isArchived: boolean }) => {
  const { memoId, isArchived } = props

  // TODO: use modern DateTime library
  const generateDateTimeString = (date: Date): string => {
    return `${date.toLocaleDateString("ja-JP")} ${date.toLocaleTimeString("ja-JP")}`
  }

  return (
    <div className="flex justify-between">
      <p>{generateDateTimeString(props.createdAt)}</p>
      {!isArchived
        ? (<div>
          <Form // for "Memos" tab
            action={`/api/archive/${memoId}`}
            method="post"
            className="flex justify-end"
          >
            <RoundedDangerButton type="submit">
              Archive
            </RoundedDangerButton>
          </Form></div>)
        : (<div>
          <Form // for "Archived" tab
            action={`/api/delete/${memoId}`}
            method="post"
            className="flex justify-end"
          >
            <RoundedDangerButton type="submit">
              Delete
            </RoundedDangerButton>
          </Form></div>)
      }
    </div>
  )
}
