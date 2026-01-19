---
name: shunsaku-verify-web
description: 瞬作のWeb自動検証スキル。Chrome DevTools MCPを使用してWebアプリの画面キャプチャ、要素確認、操作テストを自動実行する。実装完了後、デザイン変更後、バグ修正後などに呼び出される。
allowed-tools: Read, Bash, Glob
---

# 瞬作 Web自動検証スキル

## 概要

Chrome DevTools MCPを使用してWebアプリの自動検証を行うスキルです。
スクリーンショット取得、UI要素確認、操作テストを自動実行し、検証結果を報告します。

## 呼び出し元

- `shunsaku-impl-web` - 実装完了後の初回検証
- `shunsaku-design` - デザイン変更後の再検証
- `shunsaku-kaizen` - 改善セッション中の確認
- 手動 - バグ修正後、回帰検証

## 前提条件

- Webアプリがローカルで起動していること（例: localhost:3000）
- Chrome DevTools MCPが利用可能であること
- VERIFICATION_CARD.md が存在すること（検証シナリオ）

## 検証フロー

### 1. ページ確認

```
list_pages
```

利用可能なページを確認し、対象ページを特定する。

### 2. ページ選択・ナビゲーション

```
select_page(pageIdx: 0)
navigate_page(type: "url", url: "http://localhost:3000")
```

### 3. 画面キャプチャ

各画面のスクリーンショットを取得：

```
take_screenshot()
take_screenshot(fullPage: true)  // フルページ
take_screenshot(uid: "element-uid")  // 特定要素
```

**取得タイミング:**
- ホーム画面
- 主要な操作後
- 結果画面
- エラー状態（該当する場合）

### 4. UI要素確認

画面上の要素を列挙して視認性を確認：

```
take_snapshot()
take_snapshot(verbose: true)  // 詳細情報付き
```

**確認項目:**
- ボタンが認識できるか
- テキストが読めるか
- クリック可能な要素が適切か

### 5. 操作テスト

VERIFICATION_CARD.md のタスクを自動実行：

```
# クリック
click(uid: "button-uid")
click(uid: "button-uid", dblClick: true)  // ダブルクリック

# ホバー
hover(uid: "element-uid")

# テキスト入力
fill(uid: "input-uid", value: "入力テキスト")

# フォーム一括入力
fill_form(elements: [
  { uid: "name-input", value: "テスト" },
  { uid: "email-input", value: "test@example.com" }
])

# キー入力
press_key(key: "Enter")
press_key(key: "Control+A")

# ドラッグ＆ドロップ
drag(from_uid: "source", to_uid: "target")

# 待機
wait_for(text: "読み込み完了")
```

### 6. 検証シナリオ実行

VERIFICATION_CARD.md に基づいて検証を実行：

1. タスク定義を読み取る
2. 各タスクを順番に実行
3. 期待結果と比較
4. スコアカードに記録

## 出力

### 検証レポート

```markdown
# 自動検証レポート

## 実行情報
- URL: http://localhost:3000
- ブラウザ: Chrome DevTools
- 実行日時: YYYY-MM-DD HH:MM

## スクリーンショット
| 画面 | 状態 |
|------|------|
| ホーム | ✅ 正常 |
| カテゴリ選択 | ✅ 正常 |
| 結果 | ✅ 正常 |

## UI要素確認
| 要素 | 視認性 | クリック可能 |
|------|--------|-------------|
| メインボタン | ✅ | ✅ |
| テキスト | ✅ | - |

## 操作テスト
| タスク | 結果 | 備考 |
|--------|------|------|
| 写真選択 → 講評表示 | ✅ 成功 | |
| 次のアクション確認 | ✅ 成功 | |

## スコアカード結果
| 基準 | 結果 |
|------|------|
| 導線 | 成功 / 改善必要 / 失敗 |
| 視認性 | 成功 / 改善必要 / 失敗 |
| 印象 | （自動判定不可、手動確認必要） |

## 発見された問題
- （あれば記載）

## 推奨アクション
- （あれば記載）
```

## 実行手順

### ステップ1: ページ確認

```
1. list_pages を実行
2. 対象ページを確認（なければ new_page で作成）
3. select_page でページを選択
4. navigate_page でアプリURLへ移動
```

### ステップ2: 初期状態キャプチャ

```
1. take_screenshot でホーム画面をキャプチャ
2. take_snapshot で要素を確認
3. 期待する要素が存在するか検証
```

### ステップ3: 操作フロー実行

```
1. VERIFICATION_CARD.md のタスクを読み取る
2. 各タスクに対応する操作を実行
   - ボタンクリック: click(uid: "...")
   - 入力: fill(uid: "...", value: "...")
   - 待機: wait_for(text: "...")
3. 各操作後にスクリーンショットを取得
4. 期待結果と比較
```

### ステップ4: 結果集計

```
1. 全タスクの結果を集計
2. スコアカードに記入
3. 検証レポートを生成
4. 問題があれば推奨アクションを提示
```

## デザイン検証との連携

`shunsaku-design` から呼び出された場合、追加で以下を確認：

### レイアウト・導線検証
- 要素の配置が期待通りか
- クリック領域が十分か
- 導線に迷いがないか（操作ステップ数）

### ビジュアル・トーン検証
- スクリーンショットを目視確認用に保存
- 色の印象は自動判定困難 → 手動確認を促す

### 理解・認知検証
- 要素のラベルが適切か
- アイコンの意味が伝わるか（手動確認）

### A/B比較検証
- 両案のスクリーンショットを並べて保存
- 操作ステップ数を比較
- タスク完了時間を比較

## パフォーマンス検証

Chrome DevTools MCPでパフォーマンスも検証可能：

```
# トレース開始
performance_start_trace(reload: true, autoStop: true)

# トレース停止
performance_stop_trace()

# インサイト分析
performance_analyze_insight(insightSetId: "...", insightName: "LCPBreakdown")
```

**確認項目:**
- Core Web Vitals (LCP, FID, CLS)
- ネットワークリクエスト
- JavaScriptエラー

## ネットワーク・コンソール確認

```
# ネットワークリクエスト一覧
list_network_requests()
list_network_requests(resourceTypes: ["fetch", "xhr"])

# 特定リクエストの詳細
get_network_request(reqid: 123)

# コンソールメッセージ一覧
list_console_messages()
list_console_messages(types: ["error", "warn"])

# 特定メッセージの詳細
get_console_message(msgid: 456)
```

## エミュレーション

```
# ネットワーク速度制限
emulate(networkConditions: "Slow 3G")

# 位置情報
emulate(geolocation: { latitude: 35.6762, longitude: 139.6503 })

# CPU速度制限
emulate(cpuThrottlingRate: 4)
```

## トラブルシューティング

### ページが見つからない

```
1. list_pages で現在のページを確認
2. new_page(url: "http://localhost:3000") で新規作成
```

### アプリが起動していない

```bash
# 開発サーバーを起動
npm run dev
# または
yarn dev
```

### 要素が見つからない

1. `take_screenshot` で現在の画面を確認
2. `take_snapshot` で要素を再取得
3. `wait_for(text: "...")` で画面遷移完了を待つ

### ダイアログが表示される

```
handle_dialog(action: "accept")
handle_dialog(action: "dismiss")
handle_dialog(action: "accept", promptText: "入力値")
```

## 制限事項

- 色の印象、ブランド感などは自動判定不可（手動確認必要）
- ファイルアップロードは `upload_file` で対応可能
- 複雑なドラッグ操作は制限あり
