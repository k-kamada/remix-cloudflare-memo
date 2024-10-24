export class Memo {
  id: string //uuid
  title: string
  body: string
  createdAt: Date
  isArchived: boolean
  constructor(id: string, title: string, body: string) {
    this.id = id
    this.title = title
    this.body = body
    this.createdAt = new Date()
    this.isArchived = false
  }
}
