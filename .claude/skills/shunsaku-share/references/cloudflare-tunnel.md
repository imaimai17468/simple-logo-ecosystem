# Cloudflare Tunnel 詳細ガイド

## インストール

### macOS

```bash
brew install cloudflared
```

### Linux

```bash
# Debian/Ubuntu
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb -o cloudflared.deb
sudo dpkg -i cloudflared.deb

# または
wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -O cloudflared
chmod +x cloudflared
sudo mv cloudflared /usr/local/bin/
```

### Windows

```powershell
# winget
winget install Cloudflare.cloudflared

# または Scoop
scoop install cloudflared
```

---

## 基本的な使い方

### Quick Tunnel（アカウント不要）

```bash
# 最もシンプル - アカウント登録不要
cloudflared tunnel --url http://localhost:3000
```

出力例：
```
2024-01-15T10:00:00Z INF Thank you for trying Cloudflare Tunnel
2024-01-15T10:00:00Z INF Your quick Tunnel has been created!
2024-01-15T10:00:00Z INF +-----------------------------------------------------------+
2024-01-15T10:00:00Z INF |  https://random-words-here.trycloudflare.com              |
2024-01-15T10:00:00Z INF +-----------------------------------------------------------+
```

### ポート指定

```bash
# Next.js (デフォルト 3000)
cloudflared tunnel --url http://localhost:3000

# Vite (デフォルト 5173)
cloudflared tunnel --url http://localhost:5173

# Flutter Web (任意ポート)
cloudflared tunnel --url http://localhost:8080
```

---

## 便利なオプション

### ログレベル調整

```bash
# 静かに
cloudflared tunnel --url http://localhost:3000 --loglevel warn

# 詳細に
cloudflared tunnel --url http://localhost:3000 --loglevel debug
```

### メトリクス無効化

```bash
cloudflared tunnel --url http://localhost:3000 --metrics ""
```

---

## Named Tunnel（アカウント必要）

固定URLが必要な場合のみ。瞬作では通常Quick Tunnelで十分。

```bash
# ログイン
cloudflared tunnel login

# トンネル作成
cloudflared tunnel create my-prototype

# 実行
cloudflared tunnel run my-prototype
```

---

## トラブルシューティング

### "connection refused" エラー

```bash
# 開発サーバーが起動しているか確認
curl -I http://localhost:3000

# ポート番号が正しいか確認
lsof -i :3000
```

### URLにアクセスできない

```markdown
1. cloudflared のターミナルが生きているか確認
2. 開発サーバーが起動しているか確認
3. ファイアウォール設定を確認
```

### 接続が不安定

```bash
# 再起動
# Ctrl+C で停止後、再度実行
cloudflared tunnel --url http://localhost:3000
```

---

## セキュリティ

### Quick Tunnelの特性

- URLはランダム生成（推測困難）
- URLを知っていれば誰でもアクセス可能
- Cloudflare側でログが取られる可能性あり
- 機密情報の取り扱いに注意

### 推奨事項

```markdown
- 開発/テストデータのみ使用
- 本番の認証情報を表示しない
- 共有終了後は必ずトンネル終了
- 長時間放置しない
```

---

## 参考リンク

- [Cloudflare Tunnel Documentation](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/)
- [Quick Tunnels](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/do-more-with-tunnels/trycloudflare/)
