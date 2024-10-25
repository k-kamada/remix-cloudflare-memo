import { Database } from "sqlite3"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { SQLiteMemoService } from "./memoService.server"
import { Memo } from "~/models/memo"
import { createMemoFromRow } from "~/utils/db.server"

describe('SQLiteMemoService', () => {
  let db: Database
  let memoService: SQLiteMemoService

  beforeEach(async () => {
    db = new Database(":memory:")
    memoService = new SQLiteMemoService(db)

    await new Promise<void>((resolve, reject) => {
      db.exec(
        `CREATE TABLE IF NOT EXISTS memos (
         id TEXT PRIMARY KEY,
         title TEXT NOT NULL,
         body TEXT NOT NULL,
         createdAt INTEGER NOT NULL,
         isArchived INTEGER NOT NULL
        )`,
        err => {
          if (err) {
            console.error(err)
            reject(err)
          } else {
            resolve()
          }
        }
      )
    })
  })

  afterEach(() => {
    db.close()
  })

  it('should create a new memo', async () => {
    const newMemo = new Memo("0192bf3f-fe03-7a46-a079-76597d8da210", "title", "body")
    await memoService.createMemo(newMemo)
    db.get("SELECT * FROM memos", (err, row) => {
      const insertedMemo = createMemoFromRow(row)
      expect(insertedMemo).toStrictEqual(newMemo)
    })
  })

  it('should get all memos sorted by uuid_v7(newest first)', async () => {
    // UUID timestamp is not consistent with createdAt, but it's not a problem
    const memos = [
      new Memo("0192bf3f-fe03-7a46-a079-76597d8da210", "title1", "body1"), // oldest
      new Memo("0192bf40-6c03-795a-b337-54bd8c9618e7", "title2", "body2"), // old
      new Memo("0192bf40-99b2-7fe9-ba34-5ef5999a501e", "title3", "body3"), // new
      new Memo("0192bf40-c0c0-7979-9598-4eff57d4dc04", "title4", "body4"), // newest
    ]
    await Promise.all(memos.map((memo) => memoService.createMemo(memo)))
    const result = await memoService.getAllMemos(false)
    expect(result).toStrictEqual(memos.reverse())
  })

  it('should get all memos filtered by isArchived flag', async () => {
    const memos = [
      new Memo("0192bf3f-fe03-7a46-a079-76597d8da210", "title1", "body1"),
      new Memo("0192bf40-6c03-795a-b337-54bd8c9618e7", "title2", "body2"),
      new Memo("0192bf40-99b2-7fe9-ba34-5ef5999a501e", "title3", "body3"),
      new Memo("0192bf40-c0c0-7979-9598-4eff57d4dc04", "title4", "body4"),
    ]
    memos[1].isArchived = true
    memos[3].isArchived = true
    await Promise.all(memos.map((memo) => memoService.createMemo(memo)))
    const archivedResult = await memoService.getAllMemos(true)
    expect(archivedResult).toStrictEqual([memos[3], memos[1]])
    const nonArchivedResult = await memoService.getAllMemos(false)
    expect(nonArchivedResult).toStrictEqual([memos[2], memos[0]])
  })

  it('should archive an existing memo', async () => {
    const newMemo = new Memo("0192bf3f-fe03-7a46-a079-76597d8da210", "title", "body")
    await memoService.createMemo(newMemo)
    await memoService.archiveMemo(newMemo.id)
    const result = await memoService.getAllMemos(true)
    expect(result).toEqual([{ ...newMemo, isArchived: true }])
  })

  it('should delete an existing memo', async () => {
    const newMemo = new Memo("0192bf3f-fe03-7a46-a079-76597d8da210", "title", "body")
    await memoService.createMemo(newMemo)
    await memoService.deleteMemo(newMemo.id)
    const result = await memoService.getAllMemos(false)
    expect(result).toEqual([])
  })
})
