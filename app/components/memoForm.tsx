import { useBeforeUnload, useFetcher } from "@remix-run/react"
import { useCallback, useEffect, useState } from "react"
import { RoundedSubmitButton } from "./roundedButton"

// component for create new Memo
export const MemoForm = (props: { action: string }) => {
  const fetcher = useFetcher()
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      setTitle("")
      setBody("")
    }
  }, [fetcher])

  const isValidMemo = useCallback(() => {
    return title !== "" || body !== ""
  }, [title, body])

  // prevent force unload when memo has any characters
  useBeforeUnload(
    useCallback((e: BeforeUnloadEvent) => {
      if (isValidMemo()) {
        e.preventDefault()
      }
    }, [isValidMemo])
  )

  // for handleKeyDown
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
  }

  // save Memo by shortcut key(CTRL+Enter)
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (event.key === "Enter" && event.ctrlKey) {
      event.preventDefault()
      const formData = new FormData()
      formData.append("title", title)
      formData.append("body", body)
      fetcher.submit(formData, { method: "post" })
    }
  }

  return (
    <fetcher.Form
      method="POST"
      action={props.action}
      className="flex flex-col items-center h-full gap-2 p-4 "
      onSubmit={handleSubmit}>
      <input
        name="title"
        value={title}
        placeholder="title"
        className="w-full border-2 border-black rounded-md"
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <textarea
        name="body"
        value={body}
        placeholder="memo body"
        className="w-full h-full border-2 border-black rounded-md"
        onChange={(e) => setBody(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <RoundedSubmitButton
        type="submit"
        fetcher={fetcher}
        isValidMemo={isValidMemo()}
      >
        {fetcher.state === "submitting"
          ? "Saving..."
          : "Create New(CTRL+Enter)"}
      </RoundedSubmitButton>
    </fetcher.Form>
  )
}
