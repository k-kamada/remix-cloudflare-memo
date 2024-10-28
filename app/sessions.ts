import type {
  AppLoadContext,
  SessionData,
  SessionStorage
} from "@remix-run/cloudflare";
import {
  createCookie,
  createMemorySessionStorage,
  createWorkersKVSessionStorage,
} from "@remix-run/cloudflare";

const sessionCookie = createCookie("__session", {
  secrets: ["r3m1xr0ck5"],
  sameSite: true,
  httpOnly: true,
  secure: true,
});

let _kvSessionStorage: SessionStorage<SessionData, SessionData> | undefined

const createKVSessionStorage = (kv: KVNamespace) => {
  return createWorkersKVSessionStorage({
    kv,
    cookie: sessionCookie,
  });
}

export const getSessionStorage = (context: AppLoadContext) => {
  if (_kvSessionStorage == null) {
    if (process.env.NODE_ENV === "production") {
      _kvSessionStorage = createMemorySessionStorage({ cookie: sessionCookie })
    }
    _kvSessionStorage = createKVSessionStorage(context.cloudflare.env.KV)
  }
  return _kvSessionStorage
}
