import { Memo } from "~/models/memo"
import type sqlite3 from "sqlite3"
import {
  buildArchiveMemoQuery,
  buildDeleteAllArchivedMemoQuery,
  buildDeleteMemoQuery,
  buildInsertMemoQuery,
  buildSelectMemoQuery,
  createMemoFromRow,
  memoToDbParams
} from "~/utils/db.server"
import type { D1Database } from "@cloudflare/workers-types"

interface MemoService {
  createMemo: (newMemo: Memo) => Promise<boolean>
  getAllMemos: (isArchived: boolean) => Promise<Memo[]>
  archiveMemo: (id: string) => Promise<boolean>
  deleteMemo: (id: string) => Promise<boolean>
  deleteAllArchivedMemos: () => Promise<boolean>
}

// Handle memos only on memory, for prototyping
export class MemoryMemoService implements MemoService {
  private memos: Memo[] = [
    new Memo("uuid3", "TestMemo3", "Body3\npiyopiyo\npiyopiyo"),
    new Memo("uuid2", "TestMemo2", "Body2\nfugafuga\nfugafuga"),
    new Memo("uuid1", "TestMemo1", "Body1\nhogehoge\nhogehoge"),
  ]

  // TODO: remove it
  constructor() { }

  createMemo = (newMemo: Memo) => {
    const beforeNum = this.memos.length
    this.memos.unshift(newMemo)
    if (beforeNum !== this.memos.length) {
      return Promise.resolve(true)
    }
    console.error("Failed to create memo")
    return Promise.reject(false)
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
    const idx = this.memos.findIndex(m => m.id === id)
    if (idx !== -1) {
      this.memos.splice(idx, 1)
      return Promise.resolve(true)
    }
    return Promise.resolve(false)
  }

  deleteAllArchivedMemos = () => {
    const newMemos = this.memos.filter((memo) => !memo.isArchived)
    if (newMemos.length !== this.memos.length) {
      this.memos = newMemos
      return Promise.resolve(true)
    }
    return Promise.resolve(false)
  }
}

// using SQLite3 for Dev
export class SQLiteMemoService implements MemoService {
  private db: sqlite3.Database
  constructor(db: sqlite3.Database) {
    this.db = db
  }

  createMemo = (newMemo: Memo): Promise<boolean> => {
    const query = buildInsertMemoQuery()
    return new Promise<boolean>((resolve, reject) => {
      this.db.run(query, memoToDbParams(newMemo), (err) => {
        if (err) {
          reject(err)
        } else {
          resolve(true)
        }
      })
    })
  }

  getAllMemos = (isArchived: boolean): Promise<Memo[]> => {
    const query = buildSelectMemoQuery(isArchived)
    return new Promise<Memo[]>((resolve, reject) => {
      this.db.all(query, (err, rows) => {
        if (err) {
          reject(err)
        } else {
          const memos = rows.map((row) => createMemoFromRow(row))
          resolve(memos)
        }
      })
    })
  }

  archiveMemo = (id: string): Promise<boolean> => {
    const query = buildArchiveMemoQuery()
    return new Promise<boolean>((resolve, reject) => {
      this.db.run(query, id, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve(true)
        }
      })
    })
  }

  deleteMemo = (id: string): Promise<boolean> => {
    const query = buildDeleteMemoQuery()
    return new Promise<boolean>((resolve, reject) => {
      this.db.run(query, id, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve(true)
        }
      })
    })
  }

  deleteAllArchivedMemos = (): Promise<boolean> => {
    const query = buildDeleteAllArchivedMemoQuery()
    return new Promise<boolean>((resolve, reject) => {
      this.db.run(query, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve(true)
        }
      })
    })
  }

  close = async () => {
    return new Promise<void>((resolve, reject) => {
      this.db.close(err => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }
}

// using D1 for Workers environment
export class D1MemoService implements MemoService {
  private DB: D1Database
  constructor(db: D1Database) {
    this.DB = db
  }

  createMemo = async (newMemo: Memo): Promise<boolean> => {
    const query = buildInsertMemoQuery()
    const params = memoToDbParams(newMemo)

    try {
      await this.DB.prepare(query).bind(...params).run()
      return true
    } catch (error) {
      console.error("Error creating memo", error)
      return false
    }
  }

  getAllMemos = async (isArchived: boolean): Promise<Memo[]> => {
    const query = buildSelectMemoQuery(isArchived)

    try {
      const result = await this.DB.prepare(query).all()
      return result.results.map((row) => createMemoFromRow(row))
    } catch (error) {
      console.error("Error getting memos:", error)
      return []
    }
  }

  archiveMemo = async (id: string): Promise<boolean> => {
    const query = buildArchiveMemoQuery()

    try {
      await this.DB.prepare(query).bind(id).run()
      return true
    } catch (error) {
      console.error("Error archiving memo:", error)
      return false
    }
  }

  deleteMemo = async (id: string): Promise<boolean> => {
    const query = buildDeleteMemoQuery()

    try {
      await this.DB.prepare(query).bind(id).run()
      return true
    } catch (error) {
      console.error("Error deleting memo:", error)
      return false
    }
  }

  deleteAllArchivedMemos = async (): Promise<boolean> => {
    const query = buildDeleteAllArchivedMemoQuery()

    try {
      await this.DB.prepare(query).run()
      return true
    } catch (error) {
      console.error("Error deleting memo:", error)
      return false
    }
  }
}

let _memoService: MemoService | undefined
export const getMemoService = (env: Env): MemoService => {
  if (_memoService == null) {
    if (env.ENVIRONMENT === 'development') {
      _memoService = new MemoryMemoService()
    } else {
      _memoService = new D1MemoService(env.DB)
    }
  }
  return _memoService
}
