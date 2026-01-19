---
name: shunsaku-design-btob
description: 瞬作のBtoB向けデザインスキル。業務システム、管理画面、ダッシュボードなど、効率性と信頼感を重視したUIデザインを作成する。情報密度、一貫性、学習コスト最小化を重視。
---

# 瞬作デザイン（BtoB向け）

## 概要

**BtoB（業務向け）アプリ** のデザインを作成するスキルです。
効率性、信頼感、情報密度を重視したUIデザインを設計します。

## 対象アプリ

- 管理画面、ダッシュボード
- SaaS、業務システム
- 社内ツール
- データ分析ツール
- CRM、ERP

## 設計哲学

> **"Don't make me think."**
> — Steve Krug

業務ユーザーは「使いこなす」ことを期待される。学習コストを下げ、効率的に作業できることが最優先。

---

## コンセプト確認（必須・最初に行う）

**デザイン提案の前に、必ずアプリのコンセプトを確認する。**

### 確認すべき情報

1. **仮説**: このシステムで検証したいこと / 解決したい業務課題
2. **ターゲットユーザー**: 誰が使うか（役職、スキルレベル）
3. **成功基準**: 業務がどう改善されれば成功か
4. **効率ゴール**: どの業務をどれだけ効率化したいか

### 確認方法

```
1. VERIFICATION_CARD.md を読む（あれば）
2. DESIGN_SPEC.yaml を読む（あれば）
3. handoff contract を確認する（shunsakuから呼ばれた場合）
4. 不明な場合はユーザーに質問する
```

### コンセプトに沿った提案とは

**すべての提案が「業務課題の解決」または「仮説達成」にどう貢献するか説明できること。**

| 提案タイプ | 例 | 問題点 |
|-----------|-----|--------|
| ❌ 表面的 | 「カードにシャドウを追加しましょう」 | 業務改善と無関係 |
| ❌ 汎用的 | 「ダッシュボードを追加」 | 課題を理解せず提案 |
| ✅ コンセプト沿い | 「承認待ち件数を一目で把握できるよう、ヘッダーにバッジ表示」 | 課題解決に直結 |
| ✅ コンセプト沿い | 「入力ミス削減のため、バリデーションをリアルタイム化」 | 効率化に直結 |

### 提案時のテンプレート

```markdown
## 提案: [提案内容]

**業務課題との関連:**
- 課題「[課題]」の解決に貢献する理由: [説明]
- または効率ゴール「[ゴール]」に近づく理由: [説明]

**具体的な変更:**
- [変更内容]

**期待効果:**
- [定量的な効果があれば記載]
```

---

## 問診フロー（最大3問）

### 質問1: ユーザーの業務コンテキスト

「このアプリを使うユーザーの業務状況は？」

| 状況 | 説明 | デザイン方針 |
|------|------|-------------|
| **毎日長時間使う** | 基幹業務ツール | 目の疲れ軽減、高情報密度 |
| **時々確認する** | レポート、ダッシュボード | 一目で把握、視覚的 |
| **初めて使う人が多い** | オンボーディング重視 | 直感的、ガイド付き |
| **専門知識がある** | 業界特化ツール | 専門用語OK、効率重視 |

### 質問2: 情報の優先度

「最も重要な情報は何ですか？」

| 情報タイプ | 例 | 表示方法 |
|-----------|----|---------|
| **数値・KPI** | 売上、進捗率 | 大きな数字、グラフ |
| **リスト・一覧** | 顧客、タスク | テーブル、カード |
| **ステータス** | 承認状況、アラート | バッジ、色分け |
| **アクション** | 申請、承認、編集 | 明確なボタン |

### 質問3: 主要アクション

「ユーザーが最も頻繁に行う操作は？」

例: 「データ入力」「承認処理」「レポート確認」「検索」

→ このアクションを**最も効率的に**行えるデザインにする

---

## 出力物

### デザインスペック

```yaml
design_spec:
  context: "btob"

  # === 設計方針 ===
  priority: "効率性 > 見た目 > 遊び心"
  personality: "プロフェッショナル、信頼できる、邪魔しない"

  # === カラーシステム ===
  colors:
    primary: "#3B82F6"         # ブルー - 信頼、プロ
    primary_container: "#DBEAFE"
    secondary: "#64748B"       # スレート - 中立
    surface: "#FFFFFF"
    surface_variant: "#F8FAFC"
    on_primary: "#FFFFFF"
    on_surface: "#0F172A"
    on_surface_variant: "#64748B"
    error: "#DC2626"
    warning: "#F59E0B"
    success: "#16A34A"
    info: "#0EA5E9"

  # === タイポグラフィ ===
  typography:
    headline_large: "24px / semibold"
    headline_medium: "18px / semibold"
    headline_small: "16px / medium"
    body_large: "14px / regular / 1.5"
    body_medium: "13px / regular / 1.4"
    label_large: "13px / medium"
    label_medium: "12px / medium"
    # BtoB: 小さめで情報密度を確保

  # === 形状 ===
  shapes:
    radius_sm: "4px"
    radius_md: "6px"
    radius_lg: "8px"
    # BtoB: 控えめな角丸でプロフェッショナル感

  # === スペーシング ===
  spacing:
    xs: "4px"
    sm: "8px"
    md: "12px"
    lg: "16px"
    xl: "24px"
    # BtoB: BtoCより詰め気味

  # === 高さ・影 ===
  elevation:
    level0: "none"
    level1: "0 1px 2px rgba(0,0,0,0.05)"
    level2: "0 2px 4px rgba(0,0,0,0.1)"
    # BtoB: 影は控えめ
```

---

## コンポーネントガイドライン

### テーブル（最重要）

BtoBで最も使用頻度が高いコンポーネント。

```yaml
table:
  header:
    background: "#F8FAFC"
    text: "12px / semibold / uppercase"
    padding: "12px 16px"
  row:
    height: "48px"
    padding: "12px 16px"
    border_bottom: "1px solid #E2E8F0"
    hover: "#F1F5F9"
  cell:
    text: "14px / regular"
    truncate: true  # 長いテキストは省略
```

```dart
// Flutter実装例
DataTable(
  headingRowColor: WidgetStateProperty.all(Color(0xFFF8FAFC)),
  dataRowMinHeight: 48,
  dataRowMaxHeight: 48,
  columns: [...],
  rows: [...],
)
```

### フォーム

```yaml
form:
  field_height: "40px"
  label: "12px / medium / above"
  spacing: "16px"  # フィールド間
  validation:
    error_color: "#DC2626"
    success_color: "#16A34A"
```

```dart
TextFormField(
  decoration: InputDecoration(
    labelText: 'ラベル',
    filled: true,
    fillColor: Color(0xFFF8FAFC),
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(6),
      borderSide: BorderSide(color: Color(0xFFE2E8F0)),
    ),
    contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 10),
  ),
)
```

### ボタン

```yaml
buttons:
  primary:
    height: "36px"
    padding: "0 16px"
    radius: "6px"
    text: "14px / medium"
  secondary:
    height: "36px"
    background: "transparent"
    border: "1px solid #E2E8F0"
  danger:
    background: "#DC2626"
  # BtoB: BtoCより小さめ
```

### サイドバー

```yaml
sidebar:
  width: "240px"
  background: "#0F172A"  # ダーク
  item:
    height: "40px"
    padding: "0 16px"
    active: "#1E3A5F"
    hover: "#1E293B"
  text: "#94A3B8"
  text_active: "#FFFFFF"
```

### ダッシュボードカード

```yaml
dashboard_card:
  padding: "20px"
  radius: "8px"
  background: "#FFFFFF"
  border: "1px solid #E2E8F0"
  title: "12px / medium / uppercase / #64748B"
  value: "32px / bold / #0F172A"
  trend:
    up: "#16A34A"
    down: "#DC2626"
```

---

## レイアウトパターン

### ダッシュボード

```
┌────────────────────────────────────────────┐
│ Header (56px)                              │
├──────────┬─────────────────────────────────┤
│          │ KPI Cards (row)                 │
│ Sidebar  ├─────────────────────────────────┤
│ (240px)  │ Chart     │ Table              │
│          │           │                     │
│          ├───────────┴─────────────────────┤
│          │ Recent Activity                 │
└──────────┴─────────────────────────────────┘
```

### マスター詳細（Master-Detail）

```
┌────────────────────────────────────────────┐
│ Header                                     │
├──────────┬─────────────────────────────────┤
│ Sidebar  │ List (1/3)  │ Detail (2/3)     │
│          │             │                   │
│          │ ─────────── │                   │
│          │ ─────────── │                   │
│          │ ─────────── │                   │
└──────────┴─────────────┴───────────────────┘
```

### フォーム中心

```
┌────────────────────────────────────────────┐
│ Header                                     │
├────────────────────────────────────────────┤
│              Form (max-width: 600px)       │
│              ┌─────────────────────┐       │
│              │ Section 1           │       │
│              │ [field] [field]     │       │
│              ├─────────────────────┤       │
│              │ Section 2           │       │
│              │ [field]             │       │
│              ├─────────────────────┤       │
│              │ [Cancel] [Submit]   │       │
│              └─────────────────────┘       │
└────────────────────────────────────────────┘
```

---

## ステータス表現

### バッジ

```yaml
badge:
  success: { bg: "#DCFCE7", text: "#166534" }
  warning: { bg: "#FEF3C7", text: "#92400E" }
  error: { bg: "#FEE2E2", text: "#991B1B" }
  info: { bg: "#DBEAFE", text: "#1E40AF" }
  neutral: { bg: "#F1F5F9", text: "#475569" }
  # 背景は薄く、テキストは濃く（読みやすさ重視）
```

### 進捗バー

```yaml
progress:
  height: "6px"
  background: "#E2E8F0"
  fill: "#3B82F6"
  radius: "3px"
```

---

## アクセシビリティ（重要度高）

BtoBでは長時間使用されるため、アクセシビリティが特に重要。

```markdown
### 必須要件
- [ ] コントラスト比 4.5:1 以上
- [ ] フォーカス状態が明確
- [ ] キーボード操作が可能
- [ ] エラーメッセージが明確

### 推奨
- [ ] ダークモード対応
- [ ] フォントサイズ変更可能
- [ ] 高コントラストモード
```

---

## BtoB特有の考慮事項

### 情報密度

```yaml
# BtoC vs BtoB
btoc:
  card_padding: "24px"
  row_height: "64px"
  font_size: "16px"

btob:
  card_padding: "16px"
  row_height: "48px"
  font_size: "14px"
```

### 装飾の抑制

- グラデーション → ほぼ使わない
- アニメーション → フィードバック目的のみ
- 装飾アイコン → 機能的なアイコンのみ
- イラスト → 空状態やエラー時のみ

### 一貫性

- 同じ操作は同じ場所、同じ見た目
- ボタンの配置ルール（右寄せ、Primary右）
- 色の意味を統一（赤=削除/エラー、緑=成功）

---

## プリセット

### ダッシュボード

```yaml
colors:
  primary: "#3B82F6"
  surface: "#F8FAFC"
  sidebar: "#0F172A"
typography:
  headline: "24px / semibold"
  body: "14px / regular"
components:
  card_radius: "8px"
  table_row_height: "48px"
```

### 管理画面

```yaml
colors:
  primary: "#6366F1"
  surface: "#FFFFFF"
  border: "#E2E8F0"
typography:
  headline: "18px / semibold"
  body: "13px / regular"
components:
  form_field_height: "40px"
  button_height: "36px"
```

### データ分析

```yaml
colors:
  primary: "#0EA5E9"
  chart_palette:
    - "#3B82F6"
    - "#10B981"
    - "#F59E0B"
    - "#EF4444"
    - "#8B5CF6"
components:
  chart_height: "300px"
  legend_position: "bottom"
```

---

## 検証チェックリスト

```markdown
### コンセプト整合性（最重要）
- [ ] 業務課題・仮説を理解しているか
- [ ] 各提案が課題解決に貢献する理由を説明できるか
- [ ] 見た目だけの提案になっていないか

### 効率性
- [ ] 主要タスクが3クリック以内で完了するか
- [ ] 頻繁に使う機能がすぐアクセスできるか
- [ ] 入力フィールドにフォーカスが当たっているか

### 情報設計
- [ ] 重要な情報が一目で分かるか
- [ ] テーブルの列が適切か
- [ ] ステータスが色で識別できるか

### 信頼性
- [ ] エラー時に何が起きたか分かるか
- [ ] 保存/送信前に確認があるか
- [ ] 操作を取り消せるか
```

---

## 参考資料

- [IBM Carbon Design System](https://carbondesignsystem.com/)
- [Atlassian Design System](https://atlassian.design/)
- [Ant Design](https://ant.design/)
- [Refactoring UI](https://www.refactoringui.com/)
