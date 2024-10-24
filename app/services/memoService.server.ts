import { Memo } from "~/models/memo";

interface MemoService {
  createMemo: (newMemo: Memo) => Promise<Memo>
  getAllMemos: (isArchived: boolean) => Promise<Memo[]>
  archiveMemo: (id: string) => Promise<boolean>
  deleteMemo: (id: string) => Promise<boolean>
}

// Handle memos only on memory
class MemoServiceForDev implements MemoService {
  private memos: Memo[] = [
    new Memo("uuid3", "TestMemo3", "Body3\npiyopiyo\npiyopiyo"),
    new Memo("uuid2", "TestMemo2", "Body2\nfugafuga\nfugafuga"),
    new Memo("uuid1", "TestMemo1", "Body1\nhogehoge\nhogehoge"),
  ]

  createMemo = (newMemo: Memo) => {
    this.memos.unshift(newMemo)
    return Promise.resolve(newMemo)
  }

  getAllMemos = (isArchived: boolean) => {
    return Promise.resolve(this.memos.filter(m => m.isArchived === isArchived))
  }

  archiveMemo = (id: string) => {
    const idx = this.memos.findIndex(m => m.id === id && !m.isArchived)
    if (idx !== -1) {
      this.memos[idx].isArchived = true
      return Promise.resolve(true)
    }
    return Promise.resolve(false)
  }

  deleteMemo = (id: string) => {
    const idx = this.memos.findIndex(m => m.id === id && m.isArchived)
    if (idx !== -1) {
      this.memos.splice(idx, 1)
      return Promise.resolve(true)
    }
    return Promise.resolve(false)
  }
}

export const memoService = new MemoServiceForDev()
