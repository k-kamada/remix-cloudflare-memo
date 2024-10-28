import type { AppLoadContext } from "@remix-run/cloudflare"
import bcrypt from "bcryptjs"

interface AuthenticationService {
  verifyPassword: (username: string, plainPassword: string) => Promise<boolean>
}

const verifyPassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword)
}

// for KV of miniflare or production Worker
export class KVAuthenticationService implements AuthenticationService {
  private KV: KVNamespace

  constructor(KV: KVNamespace) {
    this.KV = KV
  }

  verifyPassword = async (username: string, plainPassword: string) => {
    const name = await this.KV.get("user")
    const hashedPassword = await this.KV.get("password")
    if (name && hashedPassword && name === username) {
      return verifyPassword(plainPassword, hashedPassword)
    }
    return Promise.resolve(false)
  }
}

// for vite development server
export class MemoryAuthenticationService implements AuthenticationService {
  private OnMemoryKV = new Map<string, string>([
    ["user", "admin"],
    ["password", "$2a$10$pJwEenLsLEFvetKPIb8gDOl9WHbkKbayNZSq4VwynZERDQxTn7Uu6"], // hashed 'admin'
  ])

  verifyPassword = async (username: string, plainPassword: string) => {
    const name = this.OnMemoryKV.get("user")
    const hashedPassword = this.OnMemoryKV.get("password")
    if (name && hashedPassword && name === username) {
      return verifyPassword(plainPassword, hashedPassword)
    }
    return Promise.resolve(false)
  }
}

let _authenticationService: AuthenticationService | undefined
export const getAuthenticationService = (context: AppLoadContext) => {
  if (_authenticationService == null) {
    if (process.env.NODE_ENV === "development") {
      _authenticationService = new MemoryAuthenticationService()
    } else {
      _authenticationService = new KVAuthenticationService(context.cloudflare.env.KV)
    }
  }
  return _authenticationService
}
