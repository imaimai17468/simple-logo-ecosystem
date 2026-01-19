---
name: shunsaku-design-btoc
description: 瞬作のBtoC向けデザインスキル。消費者向けアプリの感情訴求デザインを作成する。SNS、エンタメ、EC、写真アプリなど、第一印象と感情体験を重視。
---

# 瞬作デザイン（BtoC向け）

## 概要

**BtoC（消費者向け）アプリ** のデザインを作成するスキルです。
感情訴求、第一印象、遊び心を重視したUIデザインを設計します。

## 対象アプリ

- SNS、写真共有
- エンタメ、ゲーム
- EC、ショッピング
- ライフスタイル
- 教育（個人向け）

## 設計哲学

> **"Users of all ages prefer design that makes them feel something, rather than emotionless, purely pragmatic interfaces."**
> — Google Material 3 Expressive Research

94%の第一印象はデザインで決まる。50ミリ秒で判断される。

---

## コンセプト確認（必須・最初に行う）

**デザイン提案の前に、必ずアプリのコンセプトを確認する。**

### 確認すべき情報

1. **仮説**: このアプリで検証したいこと
2. **ターゲットユーザー**: 誰のためのアプリか
3. **成功基準**: ユーザーがどうなれば成功か
4. **感情ゴール**: ユーザーにどう感じてほしいか

### 確認方法

```
1. VERIFICATION_CARD.md を読む（あれば）
2. DESIGN_SPEC.yaml を読む（あれば）
3. handoff contract を確認する（shunsakuから呼ばれた場合）
4. 不明な場合はユーザーに質問する
```

### コンセプトに沿った提案とは

**すべての提案が「仮説達成にどう貢献するか」を説明できること。**

| 提案タイプ | 例 | 問題点 |
|-----------|-----|--------|
| ❌ 表面的 | 「アニメーションを追加しましょう」 | なぜ必要か不明 |
| ❌ 汎用的 | 「グラデーション背景で華やかに」 | コンセプトと無関係 |
| ✅ コンセプト沿い | 「講評の理解を深めるため、改善ポイントを段階的に表示」 | 仮説達成に直結 |
| ✅ コンセプト沿い | 「次のアクションを促すため、CTA を目立たせる」 | 成功基準に直結 |

### 提案時のテンプレート

```markdown
## 提案: [提案内容]

**コンセプトとの関連:**
- 仮説「[仮説]」の達成に貢献する理由: [説明]
- または成功基準「[基準]」に近づく理由: [説明]

**具体的な変更:**
- [変更内容]
```

---

## 問診フロー（最大3問）

### 質問1: ユーザーに与えたい感情

「このアプリを使ったとき、ユーザーにどう感じてほしいですか？」

| 感情 | 説明 | 適用例 |
|------|------|--------|
| **ワクワク・楽しい** | 遊び心、発見の喜び | SNS、ゲーム、エンタメ |
| **温かい・親しみ** | 人間味、コミュニティ感 | コミュニケーション、教育 |
| **高級・洗練** | プレミアム、特別感 | EC、ファッション、アート |
| **爽やか・アクティブ** | 健康的、ポジティブ | フィットネス、ライフスタイル |

### 質問2: ビジュアルスタイル

「どのようなビジュアルスタイルが合いますか？」

| スタイル | 特徴 | 適用場面 |
|----------|------|----------|
| **Glassmorphism** | 半透明、ぼかし、奥行き | iOS風、モダン、洗練 |
| **Material Expressive** | 大胆な色、感情的、動的 | Android、活気、若者向け |
| **Soft Minimal** | 柔らかい角丸、余白重視 | 落ち着き、読みやすさ |
| **Bold & Vibrant** | 大きなタイポ、ビビッドな色 | インパクト重視 |

### 質問3: 主要アクション

「ユーザーに最も行ってほしいアクションは何ですか？」

例: 「写真を選ぶ」「購入する」「投稿する」「登録する」

→ このアクションを**最も目立たせる**デザインにする

---

## 出力物

### デザインスペック

```yaml
design_spec:
  context: "btoc"

  # === 感情設計 ===
  emotion: "ワクワク・楽しい"
  personality: "親しみやすく、遊び心があるが、信頼できる"

  # === カラーシステム ===
  colors:
    primary: "#EC4899"
    primary_container: "#FCE7F3"
    secondary: "#8B5CF6"
    surface: "#FFFFFF"
    surface_variant: "#F9FAFB"
    on_primary: "#FFFFFF"
    on_surface: "#1F2937"
    on_surface_variant: "#6B7280"
    error: "#EF4444"
    success: "#10B981"

  # === タイポグラフィ ===
  typography:
    headline_large: "32px / bold / -0.5px tracking"
    headline_medium: "24px / bold / -0.25px tracking"
    body_large: "16px / regular / 1.5 line-height"
    body_medium: "14px / regular / 1.5 line-height"
    label_large: "14px / medium"

  # === 形状 ===
  shapes:
    radius_sm: "8px"
    radius_md: "12px"
    radius_lg: "16px"
    radius_xl: "24px"
    radius_full: "9999px"

  # === スペーシング ===
  spacing:
    xs: "4px"
    sm: "8px"
    md: "16px"
    lg: "24px"
    xl: "32px"

  # === アニメーション ===
  motion:
    duration_fast: "150ms"
    duration_normal: "300ms"
    easing: "cubic-bezier(0.4, 0, 0.2, 1)"
```

---

## スタイル別リファレンス

### Glassmorphism

```dart
// Flutter実装例（Flutter 3.27+）
Container(
  decoration: BoxDecoration(
    color: Colors.white.withValues(alpha: 0.7),
    borderRadius: BorderRadius.circular(16),
    border: Border.all(
      color: Colors.white.withValues(alpha: 0.2),
      width: 1,
    ),
    boxShadow: [
      BoxShadow(
        color: Colors.black.withValues(alpha: 0.1),
        blurRadius: 20,
      ),
    ],
  ),
  child: ClipRRect(
    borderRadius: BorderRadius.circular(16),
    child: BackdropFilter(
      filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
      child: content,
    ),
  ),
)
```

### Material 3 Expressive

```dart
ThemeData(
  colorScheme: ColorScheme.fromSeed(
    seedColor: const Color(0xFFEC4899),
    brightness: Brightness.light,
    dynamicSchemeVariant: DynamicSchemeVariant.vibrant,
  ),
  filledButtonTheme: FilledButtonThemeData(
    style: FilledButton.styleFrom(
      minimumSize: const Size(double.infinity, 56),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
    ),
  ),
)
```

---

## 装飾パターン（BtoC特有）

### 「整いすぎ」を避ける

BtoCアプリでは「遊び心」「親しみやすさ」が重要。整いすぎたデザインは無機質に感じられる。

#### 散らばり配置

```dart
Stack(
  children: [
    Positioned(
      top: 60, left: -20,
      child: Transform.rotate(
        angle: -0.2,
        child: DecorativeElement(),
      ),
    ),
  ],
)
```

#### アイコン装飾

```dart
Icon(
  Icons.favorite_rounded,
  size: 26,
  color: Colors.rose.withValues(alpha: 0.4),
)
```

#### グラデーション背景

```dart
decoration: BoxDecoration(
  gradient: LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [
      Color(0xFFF0FDFA),
      Color(0xFFFFFFFE),
    ],
    stops: [0.0, 0.4],
  ),
),
```

### チャット形式の説明画面

静的な説明テキストの代わりに、AIキャラクターとの対話形式で情報を伝える。

---

## ジェンダーニュートラルカラー

ターゲットが特定の性別に偏らない場合：

| カラー | Hex | 印象 |
|--------|-----|------|
| **ティール** | #14B8A6 | 爽やか、中立 |
| **インディゴ** | #6366F1 | 知的、効率 |
| **エメラルド** | #10B981 | 成長、ポジティブ |
| **アンバー** | #F59E0B | 温かみ、エネルギー |

**避ける**: ピンク単色（女性向け印象）、ダークブルー単色（男性向け印象）

---

## 感情別プリセット

### ワクワク・楽しい

```yaml
colors:
  primary: "#EC4899"
  secondary: "#8B5CF6"
  tertiary: "#06B6D4"
shapes:
  radius_lg: "16px"
effects:
  background: "linear-gradient(180deg, #FCE7F3 0%, #FFFFFF 50%)"
  button_shadow: "0 4px 14px rgba(236, 72, 153, 0.3)"
```

### 高級・洗練

```yaml
colors:
  primary: "#1F2937"
  secondary: "#D4AF37"
  surface: "#FAFAF9"
shapes:
  radius_md: "4px"  # 控えめな角丸
typography:
  headline: "serif"  # セリフ体で高級感
```

### 爽やか・アクティブ

```yaml
colors:
  primary: "#10B981"
  secondary: "#06B6D4"
  surface: "#ECFDF5"
shapes:
  radius_lg: "20px"
effects:
  gradient: "linear-gradient(135deg, #10B981, #06B6D4)"
```

---

## 検証チェックリスト

```markdown
### コンセプト整合性（最重要）
- [ ] アプリの仮説を理解しているか
- [ ] 各提案が仮説達成に貢献する理由を説明できるか
- [ ] 表面的な装飾だけの提案になっていないか

### 第一印象（5秒テスト）
- [ ] 何のアプリか3秒で分かるか
- [ ] 主要アクションが目立っているか
- [ ] 全体の印象が意図した感情と一致するか

### 感情訴求
- [ ] 遊び心・親しみやすさがあるか
- [ ] 無機質・テンプレート感がないか
- [ ] ターゲット層に響くビジュアルか

### 操作性
- [ ] タップ可能な要素が明確か（44px以上）
- [ ] フィードバックが楽しいか
```

---

## 参考資料

- [Material 3 Expressive](https://m3.material.io/blog/material-3-expressive)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [The Role of Emotion in Design](https://www.nngroup.com/articles/emotion-design/)
