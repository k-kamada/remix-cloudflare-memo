import { v7 as uuid } from "uuid"

export class Memo {
  id: string
  title: string
  body: string
  createdAt: Date
  isArchived: boolean
  constructor(title: string, body: string) {
    this.id = uuid()
    this.title = title
    this.body = body
    this.createdAt = new Date()
    this.isArchived = false
  }
}
