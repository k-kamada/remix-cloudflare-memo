# Simple Memo App using Remix + Cloudflare Workers

## Features
- create, archive, delete memo
- works flawlessly even on narrow windows
  - for sidepane of browthers or mobile phones

## Routing
- _index.tsx: create new
- list.tsx: list of memos
- archivedList.tsx: list of archived memos
- login.tsx: login
- logout.tsx: logout(not linked from other components)

## Scripts
- `npm run dev`: Run on vite development server(DB is on memory)
- `npm run start`: Run on Miniflare(DB is simulated D1 contained in Miniflare)
