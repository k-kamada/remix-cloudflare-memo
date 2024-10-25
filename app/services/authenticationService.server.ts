import type { AppLoadContext } from "@remix-run/cloudflare"

interface AuthenticationService {
  login: (username: string, plainPassword: string) => Promise<boolean>
  logout: () => void
}

export class KVAuthenticationService implements AuthenticationService {
  private KV: KVNamespace

  constructor(KV: KVNamespace) {
    this.KV = KV
  }

  login = async (username: string, plainPassword: string) => {
    const name = await this.KV.get("user")
    const hashedPass = await this.KV.get("password")
    if (name && hashedPass && name === username && hashedPass === plainPassword) {
      return Promise.resolve(true)
    }
    return Promise.resolve(false)
  }

  logout = async () => {
  }
}

export class MemoryAuthenticationService implements AuthenticationService {
  private KV = new Map<string, string>([
    ["user", "admin"],
    // ["password", "$2a$10$pJwEenLsLEFvetKPIb8gDOl9WHbkKbayNZSq4VwynZERDQxTn7Uu6"], // hashed 'admin'
    ["password", "admin"], // hashed 'admin'
  ])

  login = async (username: string, plainPassword: string) => {
    const name = this.KV.get("user")
    const hashedPass = this.KV.get("password")
    if (name && hashedPass && name === username && hashedPass === plainPassword) {
      return Promise.resolve(true)
    }
    return Promise.resolve(false)
  }

  logout = async () => {
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
