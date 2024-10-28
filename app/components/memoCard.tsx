import { Form } from "@remix-run/react"
import type { Memo } from "~/models/memo"
import Linkify from "linkify-react"

// used for displaying purpose only (not for creating / editing)
export const MemoCard = (props: {
  memo: Memo,
  isFocused: boolean
  setCurrentMemoId: React.Dispatch<React.SetStateAction<string | null>>
}) => {
  const { memo, isFocused, setCurrentMemoId } = props
  const borderColor = isFocused ? "border-sky-400" : "border-black"

  const copyMemoToClipboard = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    const text = [memo.title, memo.body].join("\n").trim()
    await navigator.clipboard.writeText(text)
  }

  return (
    <button
      id={memo.id}
      className={`bg-white border-2 ${borderColor} rounded-md p-2 text-inherit text-left cursor-default`}
      onClick={() => setCurrentMemoId(memo.id)}
      type="button"
    >
      <ManipulateBar
        memoId={memo.id}
        createdAt={memo.createdAt}
        isArchived={memo.isArchived}
        copyToClipboard={copyMemoToClipboard}
      />
      <hr />
      <p className="py-1">{memo.title}</p>
      {memo.body.length !== 0
        ? <div>
          <hr />
          <Linkify as="p" className="py-1 whitespace-pre-wrap">
            {memo.body}
          </Linkify>
        </div>
        : null
      }
    </button>
  )
}

const ManipulateBar = (props: {
  memoId: string,
  createdAt: Date,
  isArchived: boolean,
  copyToClipboard: (e: React.MouseEvent<HTMLButtonElement>) => void,
}) => {
  const { memoId, isArchived, createdAt, copyToClipboard } = props

  // TODO: use modern DateTime library
  const generateDateTimeString = (date: Date): string => {
    return `${date.toLocaleDateString("ja-JP")} ${date.toLocaleTimeString("ja-JP")}`
  }

  return (
    <div className="flex justify-between">
      {/* leftside items */}
      <div className="flex justify-start gap-2 items-center">
        {!isArchived
          ? (<div>
            <Form // for "Memos" tab
              action={`/api/archive/${memoId}`}
              method="post"
              className="flex justify-end"
            >
              <SvgSmallIconButton path="red_trashbox.svg" />
            </Form></div>)
          : null
        }
        <p>{generateDateTimeString(createdAt)}</p>
      </div>
      <SvgSmallIconButton path="blue_copy.svg" onClick={copyToClipboard} />
    </div>
  )
}

const SvgSmallIconButton = (props: { path: string, alt?: string, onClick?: React.MouseEventHandler<Element> }) => {
  return (
    <div className="h-5 w-5" >
      <button type="submit" onClick={props.onClick} className="w-full h-full">
        <img src={props.path} alt={props.alt ?? "icon"} />
      </button>
    </div>
  )
}
