---
name: shunsaku-kaizen
description: 瞬作の継続的改善スキル。アプリ完成後、ユーザーとAIが画面を一緒に見ながら機能・UIをブラッシュアップする。「改善したい」「ブラッシュアップ」「使いにくい」「直したい」などの文脈で使用。Mobile MCP / Chrome DevTools MCPで画面確認しながら対話的に改善。gitで変更管理。
---

# shunsaku-kaizen: 継続的改善スキル

アプリ完成後、ユーザーとAIが**画面を一緒に見ながら**機能・UIをブラッシュアップするスキル。

## 起動条件

- 「改善したい」「ブラッシュアップ」「使いにくい」「〜を直したい」などの文脈
- `/shunsaku-kaizen` で明示的に起動

## 基本姿勢

- **ユーザー主導**: ユーザーが「ここ見て」と言ったら動く
- **対話的**: フォーマルな提案書より、会話の中で決める
- **安全**: gitで変更を管理し、いつでも戻せる
- **軽量**: 必要最小限の手順で進める

## 使用ツール

| 用途 | ツール |
|------|--------|
| Flutter/Mobile | Mobile MCP |
| Web | Chrome DevTools MCP |
| 変更管理 | git |

---

## Git活用: 安全な変更管理

### 改善セッション開始時

```bash
# 現在の状態を保存（未コミットの変更があれば）
git stash -u -m "kaizen開始前の状態"

# または、クリーンな状態なら作業ブランチを作成
git checkout -b kaizen/$(date +%Y%m%d-%H%M)
```

**ユーザーへの確認:**
```markdown
改善を始める前に、現在の状態を保存しておきますね。
何かあればすぐ戻せます。
```

### 改善の区切りごと

```bash
# 意味のある単位でコミット
git add -A
git commit -m "kaizen: ホーム画面にSNS風装飾を追加"
```

**コミットメッセージの形式:**
```
kaizen: [変更内容の要約]

- 具体的な変更点1
- 具体的な変更点2
```

### 「戻して」と言われたら

```bash
# 直前の変更を取り消し
git revert HEAD --no-edit

# または、特定のコミットまで戻る
git log --oneline  # コミット一覧を確認
git revert [commit-hash] --no-edit

# 全部やり直したい場合
git checkout main  # または元のブランチ
git branch -D kaizen/[branch-name]
```

**ユーザーへの確認:**
```markdown
戻しますね。どこまで戻しますか？
- 直前の変更だけ
- 今日の変更全部
- 特定の状態まで（見せます）
```

### セッション終了時

```bash
# mainにマージ（ユーザーが満足した場合）
git checkout main
git merge kaizen/[branch-name]

# または、stashから復元（改善を破棄する場合）
git stash pop
```

---

## フロー概要

```
[開始] git で状態保存
   ↓
[対話] ユーザーと画面を見ながら改善
   ↓
[区切り] 意味のある単位でコミット
   ↓
[繰り返し] 次の改善へ or 終了
   ↓
[終了] ドキュメント更新 → mainにマージ
```

---

## 対話フロー

### ユーザーの発言パターンと対応

#### 「この画面見て」「ホーム画面が気になる」

```markdown
AI: [スクリーンショット取得・表示]

見てみました。どのあたりが気になりますか？
```

#### 「〇〇が気になる」（具体的な指摘）

```markdown
AI: [該当部分を特定]

このあたりですね。どう変えたいですか？
```

#### 「なんか微妙」（漠然とした指摘）

```markdown
AI: どの辺が微妙ですか？
- 見た目？
- 使いやすさ？
- 何か足りない感じ？

または、実際に操作してみましょうか？
```

#### 「〇〇を作って」（新機能追加）

```markdown
AI: 了解です。どんなイメージですか？

[ユーザーと対話しながら仕様を固める]
[実装]
[確認]
```

#### 「戻して」「やっぱり前のがいい」

```markdown
AI: 戻しますね。

[git revert 実行]
[スクリーンショットで確認]

これで戻りました。
```

#### 「終わり」「今日はここまで」

```markdown
AI: お疲れさまでした！

今日の変更:
- ホーム画面にSNS風装飾を追加
- primaryカラーをティールに変更
- 「どうやって使うの？」画面を実装

ドキュメントを更新して、mainにマージしておきますね。

[DESIGN_SPEC.yaml 更新]
[CHANGELOG.md 更新]
[git merge]
```

---

## 実装のポイント

### 原則

1. **直接実装**: スキル内で完結
2. **最小変更**: 必要な部分だけ
3. **即確認**: 変更→ビルド→スクショ→フィードバック

### 実装→確認ループ

```markdown
[コード変更]

変更しました。見てみましょう。

[ビルド]
[スクリーンショット]

どうですか？
- OK → 次へ or 終了
- もう少し → 具体的にどこを？
- 戻して → git revert
```

---

## 改善提案（大きな変更時のみ）

小さな改善は対話の中で決まるので不要。
大きな変更（複数画面に影響、設計変更など）の時だけ使う。

```markdown
## 提案

いくつか方法がありますね。

**A案: [概要]**
- メリット: ...
- デメリット: ...

**B案: [概要]**
- メリット: ...
- デメリット: ...

どちらがいいですか？
```

---

## セッション終了時のドキュメント更新

### DESIGN_SPEC.yaml

```yaml
# 変更があった項目のみ更新
design_spec:
  last_updated: "2025-01-15"

  colors:
    primary: "#14B8A6"  # ティールに変更
```

### CHANGELOG.md

```markdown
## 2025-01-15

### Added
- ホーム画面にSNS風の装飾要素
- 「どうやって使うの？」チャット形式説明画面

### Changed
- primaryカラーをピンクからティールに変更
- 背景グラデーションをティール系に変更
```

---

## ツールリファレンス

### Mobile MCP

```yaml
mobile_list_available_devices: デバイス一覧
mobile_launch_app: アプリ起動
mobile_take_screenshot: スクリーンショット
mobile_list_elements_on_screen: 要素一覧
mobile_click_on_screen_at_coordinates: タップ
mobile_swipe_on_screen: スワイプ
```

### Chrome DevTools MCP

```yaml
list_pages: ページ一覧
take_screenshot: スクリーンショット
take_snapshot: 要素一覧
click: クリック
fill: 入力
```

### Git

```yaml
git stash: 一時保存
git checkout -b: ブランチ作成
git add && git commit: コミット
git revert: 変更取り消し
git merge: マージ
git log --oneline: 履歴確認
```

---

## 他スキルとの連携

### 大きなデザイン変更時

複数画面に影響する変更や、デザインの方向性を大きく変える場合は `/shunsaku-design` を参照：

```markdown
AI: これは結構大きな変更になりますね。
デザインの方向性を確認させてください。

[shunsaku-design のジェンダーニュートラルカラーや
装飾パターンを参照して提案]
```

### 関連スキル

```
┌─────────────────────────────────────┐
│           shunsaku-kaizen           │
│          （継続的改善）              │
└───────────────┬─────────────────────┘
                │
    ┌───────────┼───────────┐
    │           │           │
    ▼           ▼           ▼
┌─────────┐ ┌─────────┐ ┌─────────────┐
│ design  │ │ verify- │ │ impl-tips   │
│ (参照)  │ │ flutter │ │ (参照)      │
└─────────┘ └─────────┘ └─────────────┘
```

---

## 参照ドキュメント

- `references/improvement-patterns.md` - よくある改善パターン
- `references/design-principles.md` - デザイン原則
- `references/implementation-tips.md` - 実装のコツ
- `references/data-persistence.md` - データ永続化（InMemory優先）
- `references/feature-addition.md` - 新機能追加チェックリスト
- `/shunsaku-design` - デザイントークン、カラー選定、装飾パターン
