---
name: shunsaku-share
description: プロトタイプを他の人に共有するスキル。「共有したい」「触ってもらいたい」「フィードバックもらいたい」「見せたい」などの文脈で使用。Cloudflare Tunnel / ngrok でローカル開発サーバーを一時公開し、URLを共有する。Web (Next.js) / Flutter 両対応。
allowed-tools: Read, Bash, Write
---

# shunsaku-share: プロトタイプ共有スキル

プロトタイプを**他の人にすぐ触ってもらう**ためのスキル。

## 起動条件

- 「他の人に見せたい」「共有したい」「触ってもらいたい」「フィードバックもらいたい」
- `/shunsaku-share` で明示的に起動

## 基本姿勢

- **最速で共有**: セットアップ最小限
- **一時的な共有**: 本番デプロイではない
- **フィードバック重視**: 共有後の収集方法も提案

---

## プラットフォーム別対応

| プラットフォーム | 推奨方法 | 所要時間 |
|-----------------|---------|---------|
| **Next.js / Web** | Cloudflare Tunnel | 1分 |
| **Flutter Web** | Cloudflare Tunnel | 1分 |
| **Flutter Mobile** | 同一ネットワーク + QR | 即時 |
| **Flutter Mobile (外部)** | ngrok | 2分 |

---

## Web共有: Cloudflare Tunnel

### 前提条件

```bash
# cloudflared がインストールされているか確認
cloudflared --version

# なければインストール（macOS）
brew install cloudflared
```

### 共有フロー

```markdown
1. 開発サーバーが起動していることを確認
   - Next.js: `npm run dev` (通常 localhost:3000)
   - Flutter Web: `flutter run -d chrome --web-port=3000`

2. 別ターミナルでトンネル作成
   ```bash
   cloudflared tunnel --url http://localhost:3000
   ```

3. 表示されたURLを共有
   ```
   https://xxxx-xxxx-xxxx.trycloudflare.com
   ```

4. 共有終了時は Ctrl+C でトンネル終了
```

### ユーザーへの案内

```markdown
トンネルを作成しました！

共有URL: https://xxxx-xxxx-xxxx.trycloudflare.com

このURLを共有相手に送ってください。
- 有効期限: このターミナルを閉じるまで
- 注意: 開発サーバーも起動したままにしてください
```

---

## Flutter Mobile共有

### 同一ネットワーク（最速）

```markdown
1. 開発マシンのIPアドレスを確認
   ```bash
   # macOS
   ipconfig getifaddr en0
   ```

2. Flutter実行
   ```bash
   flutter run --release
   ```

3. 共有相手に伝える
   - 同じWi-Fiに接続
   - デバイスを直接渡す or 画面共有
```

### ngrok（外部ネットワーク）

```bash
# インストール
brew install ngrok

# アカウント設定（初回のみ）
ngrok config add-authtoken YOUR_TOKEN

# トンネル作成（Flutter Webの場合）
ngrok http 3000
```

---

## QRコード生成

共有URLをQRコードで渡すと便利：

```bash
# qrencode インストール
brew install qrencode

# ターミナルにQR表示
qrencode -t ANSI "https://xxxx.trycloudflare.com"

# または画像ファイルとして保存
qrencode -o share-url.png "https://xxxx.trycloudflare.com"
```

---

## フィードバック収集のヒント

### 共有時に伝えること

```markdown
## お願い

プロトタイプを触ってみてください！

**見てほしいポイント:**
- [具体的な機能や画面]

**教えてほしいこと:**
- 使いにくかったところ
- 「こうなってほしい」と思ったこと
- 良かったところ

**注意:**
- 開発中なので、データは保存されません
- エラーが出ても大丈夫です（教えてください）
```

### フィードバックの受け取り方

- **Slack/Discord**: リアルタイムで反応を見る
- **画面録画をお願い**: 操作の様子がわかる
- **通話しながら触ってもらう**: 反応を直接聞ける

---

## セキュリティ注意点

```markdown
⚠️ 注意事項

- 共有URLは推測困難だが、URLを知っていれば誰でもアクセス可能
- 機密データを含む画面は共有しない
- 共有が終わったらトンネルを必ず終了する
- 本番環境の認証情報などを表示しない
```

---

## トラブルシューティング

### cloudflared が接続できない

```bash
# ポートが正しいか確認
lsof -i :3000

# 開発サーバーが起動しているか確認
curl http://localhost:3000
```

### URLにアクセスできない（相手側）

```markdown
確認事項:
- URLをコピペミスしていないか
- 開発サーバーが起動しているか
- トンネルが生きているか（ターミナル確認）
```

### Flutter Webが遅い

```bash
# release モードでビルド
flutter run -d chrome --release --web-port=3000
```

---

## 他スキルとの連携

```
┌─────────────────────────────────────┐
│           shunsaku-share            │
│         （プロトタイプ共有）          │
└───────────────┬─────────────────────┘
                │
    ┌───────────┼───────────┐
    │           │           │
    ▼           ▼           ▼
┌─────────┐ ┌─────────┐ ┌─────────────┐
│ impl-   │ │ impl-   │ │ kaizen      │
│ web     │ │ flutter │ │ (改善)      │
└─────────┘ └─────────┘ └─────────────┘
```

### 典型的なフロー

```
1. /shunsaku で実装
2. /shunsaku-verify-* で動作確認
3. /shunsaku-share で共有 ← このスキル
4. フィードバックを受けて /shunsaku-kaizen で改善
```

---

## 参照ドキュメント

- `references/cloudflare-tunnel.md` - Cloudflare Tunnel詳細
- `references/ngrok.md` - ngrok詳細
- `references/feedback-template.md` - フィードバック依頼テンプレート
