---
name: shunsaku-impl-web
description: 瞬作のWeb実装サブスキル。shunsakuから呼び出され、ハンドオフ契約に基づいてNext.js/Reactプロトタイプを実装する。直接呼び出しは非推奨（先にshunsakuで問診を完了すること）。
---

# 瞬作 Web実装サブスキル

## 概要

このスキルは `shunsaku`（問診駆動・瞬作ステップ）から呼び出される実装専用サブスキルです。
ハンドオフ契約を受け取り、Next.js/Reactプロトタイプを最短で実装します。

## 前提条件

- `shunsaku` のゲートA〜Eが完了していること
- ハンドオフ契約（shunsaku_handoff）が渡されていること

## 技術スタック（2025年版）

### コアスタック

| 技術 | バージョン | 備考 |
|------|-----------|------|
| Next.js | 16.x | App Router、Turbopack（デフォルト） |
| React | 19.2 | Server Components優先 |
| TypeScript | 5.1+ | 必須 |
| Tailwind CSS | 4.x | 迅速なスタイリング |
| Node.js | 20.9+ | 必須（18は非サポート） |

### 状態管理の選択指針

| ユースケース | 推奨 | 理由 |
|-------------|------|------|
| コンポーネント内の状態 | useState/useReducer | React組み込みで十分 |
| リモートデータ（API） | TanStack Query | キャッシュ、再取得、楽観的更新 |
| URL状態（フィルタ等） | nuqs | URLとstateの同期 |
| 複数コンポーネント共有 | Zustand | 軽量、再レンダリング最小化 |
| テーマ等の単純な共有 | React Context | 3-4個程度の状態なら十分 |

**プロトタイプのデフォルト**: useState + TanStack Query（必要時のみZustand追加）

## 実装フロー

### 1. 環境確認

```bash
# Node.jsの確認（20.9以上必須）
node -v

# npmまたはpnpm
npm -v
# または
pnpm -v
```

**Node.js未インストールまたは古い場合**:
```bash
mise install node@lts && mise use node@lts
```

### 2. プロジェクト作成

```bash
# 現在のディレクトリに作成（対話式スキップ）
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm

# または pnpm
pnpm create next-app . --typescript --tailwind --app --src-dir --import-alias "@/*"
```

**オプション説明**:
- `--typescript`: TypeScript使用
- `--tailwind`: Tailwind CSS（素早いスタイリング）
- `--app`: App Router使用
- `--src-dir`: src/ディレクトリ使用

### 3. 標準パッケージ

```bash
# リモートデータ取得（推奨）
npm install @tanstack/react-query

# 状態管理（複数コンポーネント共有が必要な場合）
npm install zustand

# URL状態管理（フィルタ、タブ等）
npm install nuqs

# アイコン
npm install lucide-react

# フォーム（必要な場合）
npm install react-hook-form
```

### 4. 標準ディレクトリ構成

```
src/
├── app/
│   ├── layout.tsx           # ルートレイアウト
│   ├── page.tsx             # ホームページ（Server Component）
│   ├── result/
│   │   └── page.tsx         # 結果ページ
│   ├── api/                  # Route Handlers（必要な場合）
│   │   └── mock/
│   │       └── route.ts
│   └── proxy.ts             # プロキシ設定（旧middleware.ts）
├── components/
│   ├── ui/                   # UIコンポーネント
│   │   ├── Button.tsx
│   │   └── Card.tsx
│   └── features/             # 機能コンポーネント（Client Component）
│       └── FeedbackButtons.tsx
├── lib/
│   ├── log-service.ts        # 観測ログサービス
│   └── queries.ts            # TanStack Query定義
├── stores/                   # Zustandストア（必要な場合）
│   └── app-store.ts
├── types/
│   └── index.ts              # 型定義
└── hooks/
    └── useObservationLog.ts  # カスタムフック
```

### 5. Next.js 16 設定

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // React Compiler（自動メモ化）- 推奨
  reactCompiler: true,

  // Cache Components（PPR使用時）
  // cacheComponents: true,
};

export default nextConfig;
```

### 6. Server Components vs Client Components

**原則**: Server Componentsをデフォルトに、`'use client'`は最小限

```typescript
// ✅ Server Component（デフォルト）- データ取得、静的UI
// src/app/page.tsx
export default async function HomePage() {
  // サーバーで直接データ取得可能
  const data = await fetchData();
  return <div>{data.title}</div>;
}

// ✅ Client Component - インタラクション必要時のみ
// src/components/features/Counter.tsx
'use client';

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

### 7. TanStack Query セットアップ

```typescript
// src/app/providers.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1分
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

```typescript
// src/app/layout.tsx
import { Providers } from './providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### 8. 観測ログの標準実装

```typescript
// src/types/index.ts
export interface ObservationLog {
  id: number;
  timestamp: string;
  action: string;
  data: Record<string, unknown>;
  success: boolean;
}
```

```typescript
// src/lib/log-service.ts
import type { ObservationLog } from '@/types';

const STORAGE_KEY = 'observation_logs';

export const logService = {
  getLogs(): ObservationLog[] {
    if (typeof window === 'undefined') return [];
    const json = localStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : [];
  },

  saveLog(log: Omit<ObservationLog, 'id' | 'timestamp'>): void {
    const logs = this.getLogs();
    const newLog: ObservationLog = {
      ...log,
      id: logs.length + 1,
      timestamp: new Date().toISOString(),
    };
    logs.push(newLog);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  },

  getStats() {
    const logs = this.getLogs();
    return {
      total: logs.length,
      success: logs.filter((l) => l.success).length,
      failure: logs.filter((l) => !l.success).length,
    };
  },

  clearLogs(): void {
    localStorage.removeItem(STORAGE_KEY);
  },
};
```

### 9. いいね/よくないねボタンの標準実装

```typescript
// src/components/features/FeedbackButtons.tsx
'use client';

import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface FeedbackButtonsProps {
  onLike: () => void;
  onDislike: () => void;
}

export function FeedbackButtons({ onLike, onDislike }: FeedbackButtonsProps) {
  return (
    <div className="flex gap-4 justify-center">
      <button
        onClick={onLike}
        className="flex items-center gap-2 px-6 py-3 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition"
      >
        <ThumbsUp size={20} />
        いいね
      </button>
      <button
        onClick={onDislike}
        className="flex items-center gap-2 px-6 py-3 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition"
      >
        <ThumbsDown size={20} />
        よくないね
      </button>
    </div>
  );
}
```

### 10. 非同期API（Next.js 16 Breaking Change）

```typescript
// ⚠️ Next.js 16では params, searchParams, cookies(), headers() が非同期
// src/app/result/page.tsx
export default async function ResultPage({
  searchParams,
}: {
  searchParams: Promise<{ data?: string }>;
}) {
  const { data } = await searchParams;  // awaitが必須
  return <div>Result: {data}</div>;
}
```

```typescript
// src/app/api/example/route.ts
import { cookies, headers } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();  // awaitが必須
  const headersList = await headers();  // awaitが必須

  return Response.json({ ok: true });
}
```

### 11. ビルド・実行

```bash
# 開発サーバー起動（Turbopackがデフォルト）
npm run dev
# http://localhost:3000 でアクセス

# Webpackを使用する場合（レガシー）
# npm run dev -- --webpack

# 本番ビルド
npm run build

# 静的エクスポート（必要な場合）
# next.config.ts に output: 'export' を追加
npm run build
```

## 出力

実装完了時に以下を提供:

1. **動くプロトタイプ** - 縦切り1本のフローが動作
2. **観測ログ機能** - localStorageに記録
3. **ドキュメント** - README + 設計docs

### README.md

```markdown
# [プロジェクト名]

## 概要
<!-- 何を検証するプロトタイプか -->

## 起動手順

\`\`\`bash
# 依存パッケージをインストール
npm install

# 開発サーバー起動
npm run dev
# http://localhost:3000 でアクセス
\`\`\`

## 操作方法
1.
2.
3.

## 検証の進め方
1. VERIFICATION_CARD.md を確認
2. 上記の操作を実施
3. 観測ログを確認（DevTools > Application > Local Storage）
4. DOCDD_RESULT.md に結果を記入

## 技術スタック
- Next.js 16.x（App Router, Turbopack）
- React 19.2（Server Components優先）
- TypeScript 5.1+
- Tailwind CSS 4.x
- TanStack Query（リモートデータ）

## ディレクトリ構成
\`\`\`
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── providers.tsx
├── components/
│   ├── ui/
│   └── features/
├── lib/
├── types/
└── hooks/
\`\`\`
```

### 設計ドキュメント（docs/）

#### docs/ARCHITECTURE.md

```markdown
# アーキテクチャ

## 全体構成

\`\`\`
┌─────────────────────────────────────┐
│            App Router               │
├─────────────────────────────────────┤
│  Server Components │ Client Components │
│  (データ取得)        │  ('use client')    │
├─────────────────────────────────────┤
│           TanStack Query            │  リモートデータ管理
├─────────────────────────────────────┤
│    localStorage (観測ログ)           │
└─────────────────────────────────────┘
\`\`\`

## 採用パターン
- **レンダリング**: Server Components優先、Client Componentsは最小限
- **状態管理**: useState + TanStack Query（必要時のみZustand）
- **スタイリング**: Tailwind CSS 4.x

## 主要な設計判断
| 判断 | 理由 |
|------|------|
| Server Components優先 | パフォーマンス、バンドルサイズ削減 |
| 'use client'最小限 | インタラクション必要箇所のみ |
```

#### docs/DATA_FLOW.md

```markdown
# データフロー

## Server Components

\`\`\`
[リクエスト]
    ↓
[Server Component] → 直接データ取得（fetch/DB）
    ↓
[HTML生成] → クライアントへ送信
\`\`\`

## Client Components

\`\`\`
[ユーザー操作]
    ↓
[Client Component] → useState / TanStack Query
    ↓
[API Route or 外部API]
    ↓
[状態更新] → 再レンダリング
\`\`\`

## 観測ログの流れ
1. ユーザーアクション発生
2. logService.saveLog() 呼び出し
3. localStorage に JSON 保存
4. statsを再計算

## TanStack Query パターン
\`\`\`typescript
// データ取得
const { data, isLoading } = useQuery({
  queryKey: ['items'],
  queryFn: () => fetchItems(),
});

// データ更新
const mutation = useMutation({
  mutationFn: updateItem,
  onSuccess: () => queryClient.invalidateQueries(['items']),
});
\`\`\`
```

#### docs/COMPONENTS.md

```markdown
# コンポーネント設計

## ページ一覧

| ページ | パス | 種別 | 役割 |
|--------|------|------|------|
| HomePage | / | Server | |
| ResultPage | /result | Server | |

## 主要コンポーネント

### Server Components
| コンポーネント | 役割 |
|----------------|------|
| | |

### Client Components ('use client')
| コンポーネント | 役割 |
|----------------|------|
| FeedbackButtons | いいね/よくないねボタン |
| | |

### UI Components
| コンポーネント | 役割 |
|----------------|------|
| Button | 汎用ボタン |
| Card | カード表示 |

## lib/
| ファイル | 役割 |
|----------|------|
| log-service.ts | 観測ログのCRUD |
| queries.ts | TanStack Query定義 |

## 拡張ポイント
<!-- 本格開発時に変更が必要な箇所 -->
- モック → 実API
- localStorage → DB
- 必要に応じてZustand追加
```

## ブロッカー時の質問ルール

実装中のブロッカーは最大1〜2問に限定:

- 「API鍵がないのでモックに切り替えて良い？」
- 「画面遷移が2案あるが、検証したいのはどちら？」

## チェックリスト

実装完了前に確認:

- [ ] `npm run build` でエラーなし
- [ ] 縦切り1本のフローが動作する
- [ ] 観測ログがlocalStorageに保存される
- [ ] 起動手順が明確
- [ ] `'use client'`は必要最小限

---

## トラブルシューティング

### Node.jsバージョンエラー

```bash
# miseでLTS版をインストール（20.9以上）
mise install node@lts && mise use node@lts
```

### Hydrationエラー

**原因**: サーバーとクライアントでレンダリング結果が異なる

```typescript
// 解決策: useEffectでクライアント側のみ実行
'use client';
import { useState, useEffect } from 'react';

export function Component() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <div>クライアント側のコンテンツ</div>;
}
```

### localStorage が undefined

**原因**: サーバーサイドレンダリング時にwindowがない

```typescript
// 解決策: windowの存在チェック
if (typeof window !== 'undefined') {
  localStorage.setItem('key', 'value');
}
```

### Tailwind CSSが効かない

```javascript
// tailwind.config.js の content を確認
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // ...
}
```

### params/searchParamsでエラー（Next.js 16）

```typescript
// ❌ 旧: 同期的なアクセス
export default function Page({ searchParams }: { searchParams: { id: string } }) {
  const id = searchParams.id;  // エラー
}

// ✅ 新: 非同期アクセス
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ id: string }>;
}) {
  const { id } = await searchParams;
}
```

---

## 実装パターン集

### パターン1: 入力 → 処理 → 評価フィードバック

```
/                    # ホーム（入力UI + 統計表示）
/result?data=xxx     # 結果（処理結果 + いいね/よくないね）
```

**状態管理**: URLクエリパラメータ（nuqs）またはZustand

### パターン2: フォーム入力 → API → 結果

```
/                    # フォーム入力
/api/process         # Route Handler（モック or 外部API）
/result              # 結果表示
```

### パターン3: ファイルアップロード → 処理 → 結果

```typescript
// ファイル選択の標準実装
<input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (file) {
      // FileReaderで読み込み or FormDataでAPI送信
    }
  }}
/>
```

### パターン4: リアルタイム入力 → 即時フィードバック

```typescript
// デバウンス付き入力
import { useState, useEffect } from 'react';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
```

---

## Zustand + Next.js SSR（必要な場合）

SSRでZustandを使う場合、リクエスト間で状態が共有されないようにContext wrapperを使用:

```typescript
// src/stores/app-store.ts
import { createStore } from 'zustand';

interface AppState {
  count: number;
  increment: () => void;
}

export const createAppStore = () =>
  createStore<AppState>((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
  }));

export type AppStore = ReturnType<typeof createAppStore>;
```

```typescript
// src/stores/app-store-provider.tsx
'use client';

import { createContext, useContext, useRef } from 'react';
import { useStore } from 'zustand';
import { createAppStore, type AppStore } from './app-store';

const AppStoreContext = createContext<AppStore | null>(null);

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore>(null);
  if (!storeRef.current) {
    storeRef.current = createAppStore();
  }
  return (
    <AppStoreContext.Provider value={storeRef.current}>
      {children}
    </AppStoreContext.Provider>
  );
}

export function useAppStore<T>(selector: (state: ReturnType<AppStore['getState']>) => T): T {
  const store = useContext(AppStoreContext);
  if (!store) throw new Error('Missing AppStoreProvider');
  return useStore(store, selector);
}
```

---

## デプロイ（検証用）

### Vercel（推奨）

```bash
# Vercel CLIでデプロイ
npm i -g vercel
vercel
```

### Cloudflare Pages

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  output: 'export',
};
```

```bash
# ビルド後、out/ ディレクトリをアップロード
npm run build
```

### ローカルのみ（デプロイ不要の場合）

```bash
npm run dev
# ngrokで外部公開（知り合いに試してもらう場合）
ngrok http 3000
```

---

## 自動検証

実装完了後、自動検証スキルを呼び出して動作確認を行う:

```
/shunsaku-verify-web
```

**検証内容:**
- 画面キャプチャ
- UI要素確認
- 操作フローテスト
- パフォーマンス検証（Core Web Vitals）
- コンソールエラー確認

詳細は `shunsaku-verify-web` スキルを参照。
