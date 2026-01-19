---
name: shunsaku-verify-flutter
description: 瞬作のFlutter自動検証スキル。Mobile MCPを使用してiOS/Androidアプリの画面キャプチャ、要素確認、操作テストを自動実行する。実装完了後、デザイン変更後、バグ修正後などに呼び出される。
allowed-tools: Read, Bash, Glob
---

# 瞬作 Flutter自動検証スキル

## 概要

Mobile MCPを使用してFlutterアプリの自動検証を行うスキルです。
スクリーンショット取得、UI要素確認、操作テストを自動実行し、検証結果を報告します。

## 呼び出し元

- `shunsaku-impl-flutter` - 実装完了後の初回検証
- `shunsaku-design` - デザイン変更後の再検証
- `shunsaku-kaizen` - 改善セッション中の確認
- 手動 - バグ修正後、回帰検証

## 前提条件

- Flutterアプリがシミュレータ/実機で起動していること
- Mobile MCPが利用可能であること
- VERIFICATION_CARD.md が存在すること（検証シナリオ）

## 検証フロー

### 1. デバイス確認

```
mobile_list_available_devices
```

利用可能なデバイスを確認し、対象デバイスを特定する。

### 2. 画面キャプチャ

各画面のスクリーンショットを取得：

```
mobile_take_screenshot(device: "<device_id>")
```

**取得タイミング:**
- ホーム画面
- 主要な操作後
- 結果画面
- エラー状態（該当する場合）

### 3. UI要素確認

画面上の要素を列挙して視認性を確認：

```
mobile_list_elements_on_screen(device: "<device_id>")
```

**確認項目:**
- ボタンが認識できるか
- テキストが読めるか
- タップ可能な要素が適切なサイズか

### 4. 操作テスト

VERIFICATION_CARD.md のタスクを自動実行：

```
# タップ
mobile_click_on_screen_at_coordinates(device: "<device_id>", x: X, y: Y)

# スワイプ
mobile_swipe_on_screen(device: "<device_id>", direction: "up"|"down")

# テキスト入力
mobile_type_keys(device: "<device_id>", text: "入力テキスト", submit: false)

# ホームボタン
mobile_press_button(device: "<device_id>", button: "HOME")
```

### 5. 検証シナリオ実行

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
- デバイス: iPhone 16e (Simulator)
- 実行日時: YYYY-MM-DD HH:MM

## スクリーンショット
| 画面 | 状態 |
|------|------|
| ホーム | ✅ 正常 |
| カテゴリ選択 | ✅ 正常 |
| 結果 | ✅ 正常 |

## UI要素確認
| 要素 | 視認性 | タップ可能 |
|------|--------|-----------|
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

### ステップ1: デバイス確認

```
1. mobile_list_available_devices を実行
2. 対象デバイスのIDを取得
3. アプリが起動していることを確認
```

### ステップ2: 初期状態キャプチャ

```
1. mobile_take_screenshot でホーム画面をキャプチャ
2. mobile_list_elements_on_screen で要素を確認
3. 期待する要素が存在するか検証
```

### ステップ3: 操作フロー実行

```
1. VERIFICATION_CARD.md のタスクを読み取る
2. 各タスクに対応する操作を実行
   - ボタンタップ: mobile_click_on_screen_at_coordinates
   - スクロール: mobile_swipe_on_screen
   - 入力: mobile_type_keys
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
- 要素の座標が期待通りか
- タップ領域が十分か
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

## トラブルシューティング

### デバイスが見つからない

```bash
# シミュレータを起動
open -a Simulator

# デバイス一覧を確認
flutter devices
```

### アプリが起動していない

```bash
# アプリを起動
flutter run -d <device_id>
```

### 要素が見つからない

1. `mobile_take_screenshot` で現在の画面を確認
2. `mobile_list_elements_on_screen` で要素を再取得
3. 画面遷移が完了しているか確認（待機が必要な場合あり）

### 座標がずれる

1. `mobile_get_screen_size` で画面サイズを確認
2. `mobile_list_elements_on_screen` で正確な座標を取得
3. 要素の中心座標を使用

## 制限事項

- 色の印象、ブランド感などは自動判定不可（手動確認必要）
- 複雑なジェスチャー（ピンチ、回転）は未対応
- アニメーションのタイミング検証は困難
