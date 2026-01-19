# デザイン原則（shunsaku-design より抽出）

## 感情とスタイルの組み合わせ

改善時も、最初に決めた感情・スタイルを維持する。

### 感情タイプ

| 感情 | キーワード | 色傾向 | 形状傾向 |
|------|-----------|--------|---------|
| ワクワク・楽しい | 明るい、ポップ | ピンク、オレンジ | 大きな角丸 |
| 安心・信頼 | 落ち着き、誠実 | ブルー、グリーン | 中程度の角丸 |
| シンプル・効率 | ミニマル、速い | モノトーン | 小さな角丸 |
| 高級・プレミアム | 洗練、特別 | ゴールド、ダーク | シャープ or 大角丸 |

### スタイル

| スタイル | 特徴 |
|---------|------|
| Soft Minimal | 大きな角丸、柔らかい影、余白多め |
| Glassmorphism | 半透明、ブラー、グラデーション |
| Material Expressive | 動的な色、expressive shapes |
| Bold & Vibrant | 強いコントラスト、大胆な色 |

---

## Soft Minimal の原則（写真講評アプリで使用）

### カラー
```yaml
primary: "#F472B6"        # 柔らかいピンク
surface: "#FFFBFE"        # 温かみのある白
on_surface: "#1C1917"     # 温かみのある黒
on_surface_variant: "#78716C"
```

### スペーシング
```yaml
page_padding: 28px        # ゆったり
section_gap: 40px
card_padding: 24px
item_gap: 16-20px
```

### 形状
```yaml
radius_sm: 12px
radius_md: 16px
radius_lg: 20px
radius_xl: 24-28px
```

### 影
```yaml
# 色付きで柔らかい影
shadow_soft: "0 4px 20px rgba(primary, 0.08)"
shadow_medium: "0 8px 30px rgba(primary, 0.12)"
```

### タイポグラフィ
```yaml
headline_large: 28px / semibold (600)
headline_medium: 22px / semibold
body_large: 16px / regular / line-height 1.7
body_medium: 14px / regular / line-height 1.6
```

---

## 改善時の注意点

### 一貫性を保つ

```dart
// ❌ 画面ごとにバラバラ
// Screen A
padding: EdgeInsets.all(16)
borderRadius: 8

// Screen B
padding: EdgeInsets.all(24)
borderRadius: 20

// ✅ DESIGN_SPEC に従って統一
// 全画面共通
padding: EdgeInsets.all(28)  // page_padding
borderRadius: 20             // radius_lg
```

### 既存パターンを踏襲

```dart
// 既存のカードスタイルがあれば同じパターンを使う
Container(
  padding: const EdgeInsets.all(24),
  decoration: BoxDecoration(
    color: Colors.white,
    borderRadius: BorderRadius.circular(20),
    boxShadow: [
      BoxShadow(
        color: colorScheme.primary.withValues(alpha: 0.08),
        blurRadius: 20,
        offset: const Offset(0, 4),
      ),
    ],
  ),
  child: /* ... */,
)
```

### 感情を壊さない

```dart
// ❌ 「ワクワク・楽しい」なのに堅い表現
Text('エラーが発生しました。再試行してください。')

// ✅ 感情に合った表現
Text('うまくいかなかったみたい。もう一度試してみてね')
```
