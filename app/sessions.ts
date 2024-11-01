import type {
  AppLoadContext,
  Cookie,
  SessionData,
  SessionStorage
} from "@remix-run/cloudflare";
import {
  createCookie,
  createMemorySessionStorage,
  createWorkersKVSessionStorage,
} from "@remix-run/cloudflare";

const createSessionCookie = (context: AppLoadContext) => {
  return createCookie("__session", {
    secrets: [context.cloudflare.env.SESSION_SECRET],
    sameSite: true,
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 24 * 7
  })
}

const createKVSessionStorage = (kv: KVNamespace, cookie: Cookie) => {
  return createWorkersKVSessionStorage({
    kv,
    cookie: cookie,
  });
}

let _sessionStorage: SessionStorage<SessionData, SessionData> | undefined
export const getSessionStorage = (context: AppLoadContext) => {
  if (_sessionStorage == null) {
    const cookie = createSessionCookie(context)
    if (context.cloudflare.env.ENVIRONMENT === "production") {
      console.log("production")
      _sessionStorage = createKVSessionStorage(context.cloudflare.env.KV, cookie)
    } else {
      console.log("development")
      _sessionStorage = createMemorySessionStorage({ cookie: cookie })
    }
  }
  return _sessionStorage
}
