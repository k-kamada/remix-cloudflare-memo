import type { FetcherWithComponents } from "@remix-run/react";
import type { ReactNode } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

interface SubmitButtonProps {
  fetcher: FetcherWithComponents<unknown>
  isValidMemo: boolean
}

export const RoundedSubmitButton = (props: ButtonProps & SubmitButtonProps) => {
  const { fetcher, isValidMemo, ...buttonProps } = props
  const submitButtonClassName = () => {
    if (isValidMemo) {
      if (fetcher.state === "idle") return "bg-blue-500 text-white cursor-pointer"
      return "bg-blue-200 text-white cursor-wait" // fetcher.state is "submitting" or "loading"
    }
    return "bg-blue-200 text-white" // MemoForm is not valid
  }
  return (
    <button
      {...buttonProps}
      className={`py-2 px-4 mt-2 rounded-lg ${submitButtonClassName()}`}
      onClick={(e) => fetcher.submit(e.currentTarget.form, { method: "post" })}
      disabled={!isValidMemo}
    >
      {buttonProps.children}
    </button>
  )
}

export const RoundedDangerButton = (props: ButtonProps) => {
  return (
    <button {...props} className="py-1 px-2 rounded-lg bg-red-500 text-white">
      {props.children}
    </button>
  )
}

export const RoundedNavigationButton = (props: ButtonProps) => {
  return (
    <button {...props} className="py-1 px-2 rounded-lg bg-blue-500 text-white">
      {props.children}
    </button>
  )
}
