# 実装のコツ（shunsaku-impl より抽出）

## Flutter 改善時の基本

### 変更前に確認すること

1. **影響範囲の把握**
   - そのWidgetを使っている場所
   - 共通コンポーネントか画面固有か
   - Providerの依存関係

2. **既存パターンの確認**
   - 同様の要素がどう実装されているか
   - 命名規則
   - ファイル構成

### 最小変更の原則

```dart
// ❌ 関係ない部分も一緒に変更
// 「ボタンの色を変える」タスクで、余白やテキストも変更

// ✅ 依頼された部分だけ変更
// ボタンの色だけを変更
```

---

## よく使うパターン

### 色の変更

```dart
// Theme から取得（推奨）
color: Theme.of(context).colorScheme.primary

// 直接指定
color: const Color(0xFFF472B6)

// 透明度調整（Flutter 3.27+: withValues推奨）
color: colorScheme.primary.withValues(alpha: 0.8)

// 旧API（非推奨）
// color: colorScheme.primary.withOpacity(0.8)  // ❌ 非推奨
```

### 余白の調整

```dart
// 外側の余白
margin: const EdgeInsets.all(16)

// 内側の余白
padding: const EdgeInsets.all(16)

// 特定方向だけ
padding: const EdgeInsets.only(top: 16, bottom: 24)
padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 16)
```

### サイズの調整

```dart
// 固定サイズ
SizedBox(width: 100, height: 100)

// 親に合わせる
SizedBox(width: double.infinity)

// 最小/最大サイズ
ConstrainedBox(
  constraints: BoxConstraints(
    minHeight: 60,
    maxWidth: 400,
  ),
  child: /* ... */,
)
```

### 角丸

```dart
// Container
Container(
  decoration: BoxDecoration(
    borderRadius: BorderRadius.circular(20),
  ),
)

// ClipRRect（画像など）
ClipRRect(
  borderRadius: BorderRadius.circular(20),
  child: Image.file(file),
)

// カード
Card(
  shape: RoundedRectangleBorder(
    borderRadius: BorderRadius.circular(20),
  ),
)
```

---

## Riverpod 関連

### 状態の追加

```dart
// 新しい状態を追加する場合
// providers/ に新しいファイルを作成するか、既存ファイルに追加

@riverpod
class NewFeature extends _$NewFeature {
  @override
  SomeType build() => initialValue;

  void update(SomeType value) {
    state = value;
  }
}
```

### 状態のリセット

```dart
// 特定のProviderをリセット
ref.invalidate(someProvider);

// 複数まとめてリセット
void resetAll() {
  ref.invalidate(providerA);
  ref.invalidate(providerB);
}
```

---

## go_router 関連

### 新しい画面を追加

```dart
// router/app_router.dart に追加
GoRoute(
  path: '/new-screen',
  builder: (context, state) => const NewScreen(),
),
```

### 画面遷移

```dart
// 進む
context.push('/next');

// 戻る
context.pop();

// 置き換え（戻れない）
context.go('/home');

// パラメータ付き
context.push('/detail/${item.id}');
```

---

## デバッグ・確認

### ビルドエラー時

```bash
# クリーンビルド
flutter clean && flutter pub get

# 依存関係の再生成（Riverpod等）
dart run build_runner build --delete-conflicting-outputs
```

### 見た目の確認

```dart
// 一時的に背景色をつけて領域確認（Flutter 3.27+）
Container(
  color: Colors.red.withValues(alpha: 0.3),  // デバッグ用
  child: /* ... */,
)
```

### ホットリロードが効かない時

- StatefulWidget の状態はリセットされない
- main.dart の変更は効かない → ホットリスタート必要
- Provider の初期値変更は効かない → アプリ再起動
