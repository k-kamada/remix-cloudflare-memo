import type { Memo } from "~/models/memo"
import { MemoCard } from "./memoCard"
import React, { useEffect, useState } from "react"
import { RoundedNavigationButton } from "./roundedButton"
import type { SerializeFrom } from "@remix-run/cloudflare"

// used for displaying purpose only (not for creating / editing)
export const MemoList = (props: { memos: SerializeFrom<Memo>[] }) => {
  const [currentMemoId, setCurrentMemoId] = useState<string | null>(null)

  const scrollToMemo = (memoId: string) => {
    const memoElement = document.getElementById(`${memoId}`) // id(UUIDv7) is set inside MemoCard component
    if (memoElement) {
      memoElement.scrollIntoView({ behavior: "smooth", block: "start" })
      setCurrentMemoId(memoId)
    }
  }

  const scrollToNextMemo = () => {
    if (currentMemoId === null) return
    const currentIndex = props.memos.findIndex((memo) => memo.id === currentMemoId)
    if (currentIndex < props.memos.length - 1) {
      scrollToMemo(props.memos[currentIndex + 1].id)
    }
  }

  const scrollToPreviousMemo = () => {
    if (currentMemoId === null) return
    const currentIndex = props.memos.findIndex((memo) => memo.id === currentMemoId)
    if (currentIndex > 0) {
      scrollToMemo(props.memos[currentIndex - 1].id)
    } else {
      scrollToMemo(props.memos[0].id)
    }
  }

  // initial reset scroll
  useEffect(() => {
    if (props.memos.length > 0 && currentMemoId === null) {
      setCurrentMemoId(props.memos[0].id)
    }
  }, [props.memos, currentMemoId])

  const isFocused = (memoId: string): boolean => {
    if (currentMemoId && props.memos.length > 1) {
      return memoId === currentMemoId
    }
    return false
  }

  return <React.Fragment>
    <div className="flex flex-col gap-4 p-4">
      {props.memos.map(
        (memo) =>
          <MemoCard
            key={memo.id}
            memo={memo}
            isFocused={isFocused(memo.id)}
            setCurrentMemoId={setCurrentMemoId}
          />
      )}
    </div>
    <FixedNavigation
      scrollToNextMemo={scrollToNextMemo}
      scrollToPreviousMemo={scrollToPreviousMemo}
    />
  </React.Fragment>
}

const FixedNavigation = (props: {
  scrollToNextMemo: () => void,
  scrollToPreviousMemo: () => void,
}) => {
  return (
    <div className="fixed bottom-5 right-5 z-0">
      <div className="flex flex-col gap-2">
        <RoundedNavigationButton
          onClick={props.scrollToPreviousMemo}
        >
          UP
        </RoundedNavigationButton>
        <RoundedNavigationButton
          onClick={props.scrollToNextMemo}
        >
          Down
        </RoundedNavigationButton>
      </div>
    </div>
  )
}
