# ngrok 詳細ガイド

Flutter Mobileを外部ネットワークから触ってもらう場合に使用。

## インストール

### macOS

```bash
brew install ngrok
```

### Linux

```bash
curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | \
  sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null && \
  echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | \
  sudo tee /etc/apt/sources.list.d/ngrok.list && \
  sudo apt update && sudo apt install ngrok
```

### Windows

```powershell
choco install ngrok
```

---

## 初期設定（初回のみ）

1. [ngrok.com](https://ngrok.com/) でアカウント作成（無料）
2. Dashboard から Authtoken を取得
3. 設定:

```bash
ngrok config add-authtoken YOUR_AUTHTOKEN
```

---

## 基本的な使い方

### HTTP トンネル

```bash
# ポート 3000 を公開
ngrok http 3000

# カスタムポート
ngrok http 8080
```

### 出力例

```
Session Status                online
Account                       your-email@example.com
Version                       3.x.x
Region                        Japan (jp)
Forwarding                    https://xxxx-xx-xx-xx-xx.ngrok-free.app -> http://localhost:3000
```

---

## Flutter での使用

### Flutter Web

```bash
# Flutter Web を起動
flutter run -d chrome --web-port=3000

# 別ターミナルで ngrok
ngrok http 3000
```

### Flutter Mobile（APIサーバー共有時）

```bash
# ローカルAPIサーバーを公開
ngrok http 8080

# Flutter側で ngrok URL を使用
# 例: https://xxxx.ngrok-free.app/api/...
```

---

## 便利なオプション

### リージョン指定

```bash
# 日本リージョン（低遅延）
ngrok http 3000 --region jp

# 利用可能リージョン: us, eu, ap, au, sa, jp, in
```

### 基本認証追加

```bash
# ユーザー名: user, パスワード: pass
ngrok http 3000 --basic-auth="user:pass"
```

### カスタムドメイン（有料）

```bash
ngrok http 3000 --domain=my-prototype.ngrok.io
```

---

## 無料プランの制限

| 項目 | 制限 |
|------|------|
| 同時トンネル | 1個 |
| 接続数/分 | 40 |
| ランダムURL | 毎回変わる |
| セッション | 8時間で切断 |

**瞬作での利用には十分**

---

## Cloudflare Tunnel との比較

| 項目 | ngrok | Cloudflare Tunnel |
|------|-------|-------------------|
| アカウント | 必要 | 不要（Quick Tunnel） |
| 速度 | 速い | 速い |
| 無料枠 | 制限あり | 無制限 |
| Flutter対応 | 良好 | 良好 |

**推奨:**
- Web → Cloudflare Tunnel（アカウント不要）
- Mobile API共有 → ngrok（設定が簡単）

---

## トラブルシューティング

### "ERR_NGROK_108" - セッション制限

```bash
# 既存セッションを確認・終了
# Dashboard > Tunnels で確認

# または再度起動
ngrok http 3000
```

### 接続が遅い

```bash
# 日本リージョンを明示
ngrok http 3000 --region jp
```

### "Invalid Host Header"（Next.js等）

```bash
# Next.js の場合、next.config.js に追加
# allowedHosts: ['*']

# または ngrok 側で
ngrok http 3000 --host-header=localhost:3000
```

---

## 参考リンク

- [ngrok Documentation](https://ngrok.com/docs)
- [ngrok Dashboard](https://dashboard.ngrok.com/)
