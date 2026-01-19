# よくある改善パターン

## 見た目・デザイン

### 色が弱い・目立たない

```dart
// Before: 薄い色
color: colorScheme.primary.withValues(alpha: 0.5)

// After: しっかり見える色
color: colorScheme.primary
```

### 余白が狭い・窮屈

```dart
// Before
padding: const EdgeInsets.all(16)

// After: Soft Minimal なら 24-28px
padding: const EdgeInsets.all(24)
```

### 角丸が小さい・硬い印象

```dart
// Before
borderRadius: BorderRadius.circular(8)

// After: 柔らかい印象
borderRadius: BorderRadius.circular(16)  // または 20, 24
```

### 影が強すぎる・弱すぎる

```dart
// Soft Minimal 推奨の影
BoxShadow(
  color: colorScheme.primary.withValues(alpha: 0.08),  // 色付きで柔らかく
  blurRadius: 20,
  offset: const Offset(0, 4),
)
```

---

## 使いやすさ

### タップ領域が小さい

```dart
// Before: 最小サイズ指定なし
IconButton(
  icon: Icon(Icons.close),
  onPressed: () {},
)

// After: 最小44x44を確保
IconButton(
  icon: Icon(Icons.close),
  onPressed: () {},
  constraints: BoxConstraints(minWidth: 44, minHeight: 44),
)
```

### フィードバックがない

```dart
// タップ時のフィードバック追加
InkWell(
  onTap: () {},
  borderRadius: BorderRadius.circular(16),
  splashColor: colorScheme.primary.withValues(alpha: 0.1),
  child: /* ... */,
)
```

### 何をすればいいかわからない

```dart
// 説明テキストを追加
Column(
  children: [
    Text('写真を選んでください',
      style: Theme.of(context).textTheme.headlineMedium,
    ),
    const SizedBox(height: 8),
    Text('カメラロールから講評したい写真を選びます',
      style: Theme.of(context).textTheme.bodyMedium,
    ),
  ],
)
```

### ローディング状態がわからない

```dart
// シンプルなローディング表示
if (isLoading)
  Center(
    child: Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        CircularProgressIndicator(
          strokeWidth: 3,
          color: colorScheme.primary,
        ),
        const SizedBox(height: 16),
        Text('読み込み中...'),
      ],
    ),
  )
```

---

## 機能追加

### 履歴機能

```dart
// 履歴用のProvider
@riverpod
class ReviewHistory extends _$ReviewHistory {
  @override
  List<ReviewRecord> build() => [];

  void add(ReviewRecord record) {
    state = [...state, record];
  }
}

// 履歴画面への導線
TextButton(
  onPressed: () => context.push('/history'),
  child: Text('過去の講評を見る'),
)
```

### シェア機能

```dart
// share_plus パッケージを使用
import 'package:share_plus/share_plus.dart';

IconButton(
  icon: Icon(Icons.share),
  onPressed: () async {
    await Share.share('写真講評の結果をシェア！\n${review.summary}');
  },
)
```

### 設定画面

```dart
// シンプルな設定画面
class SettingsScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('設定')),
      body: ListView(
        children: [
          ListTile(
            title: Text('通知'),
            trailing: Switch(value: true, onChanged: (_) {}),
          ),
          ListTile(
            title: Text('テーマ'),
            trailing: Icon(Icons.chevron_right),
            onTap: () {},
          ),
        ],
      ),
    );
  }
}
```

---

## パフォーマンス

### 画像の最適化

```dart
// 画像のリサイズ
Image.file(
  file,
  fit: BoxFit.cover,
  cacheWidth: 800,  // キャッシュサイズを制限
)
```

### 不要な再ビルド防止

```dart
// select で必要な値だけ監視
final userName = ref.watch(userProvider.select((u) => u.name));

// const を活用
const SizedBox(height: 16)  // const をつける
```

### 遅延読み込み

```dart
// 必要になるまで読み込まない
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) {
    // 表示時に初めてビルド
    return ItemCard(item: items[index]);
  },
)
```
