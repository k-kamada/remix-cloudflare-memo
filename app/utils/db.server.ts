import { Memo } from "~/models/memo";

export const buildInsertMemoQuery = (): string => {
  return "insert into memos(id, title, body, createdAt, isArchived) values(?,?,?,?,?)"
}

export const buildSelectMemoQuery = (isArchived: boolean): string => {
  if (isArchived) {
    return "select * from memos where isArchived = 1 order by id desc"
  }
  return "select * from memos where isArchived = 0 order by id desc"
}

export const buildArchiveMemoQuery = (): string => {
  return "update memos set isArchived = 1 where id = ?"
}

export const buildDeleteMemoQuery = (): string => {
  return "delete from memos where id = ?"
}

export const buildDeleteAllArchivedMemoQuery = (): string => {
  return "delete from memos where isArchived = 1"
}

export const memoToDbParams = (memo: Memo) => {
  return [memo.id, memo.title, memo.body, memo.createdAt.getTime(), memo.isArchived]
}

export const createMemoFromRow = (row) => {
  return new Memo(
    row.id,
    row.title,
    row.body,
    new Date(row.createdAt),
    row.isArchived === 1
  )
}
