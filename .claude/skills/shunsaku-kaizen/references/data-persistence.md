# データ永続化パターン（瞬作向け）

瞬作では**最もシンプルな方法**を最初に選ぶ。永続化が本当に必要かをまず確認する。

## 選定基準（シンプルな順）

| 方式 | 用途 | セットアップ | アプリ終了時 |
|------|------|-------------|-------------|
| **InMemory** | プロトタイプ検証 | 不要 | 消える |
| **SharedPreferences** | 設定、フラグ、少量データ | 不要 | 残る |
| **Hive** | 構造化データ、リスト | ほぼ不要 | 残る |
| **SQLite（Drift）** | 複雑なクエリ | 少し必要 | 残る |

**瞬作の原則: まずInMemoryで検証し、永続化は後から追加**

**使わないもの（瞬作の範囲外）:**
- Firebase / Supabase（アカウント・設定が必要）
- REST API（バックエンド構築が必要）

---

## InMemory（最優先）

**用途:** 仮説検証、プロトタイプ、デモ

```dart
// Riverpod StateNotifier で十分
class ReviewHistoryItem {
  final String id;
  final File image;
  final PhotoCategory category;
  final PhotoReview review;
  final DateTime createdAt;

  ReviewHistoryItem({...});
}

final reviewHistoryProvider =
    NotifierProvider<ReviewHistoryNotifier, List<ReviewHistoryItem>>(() {
  return ReviewHistoryNotifier();
});

class ReviewHistoryNotifier extends Notifier<List<ReviewHistoryItem>> {
  @override
  List<ReviewHistoryItem> build() => [];

  void add(ReviewHistoryItem item) {
    state = [item, ...state];
  }
}
```

**メリット:**
- セットアップ不要
- 依存追加不要
- 最速で実装可能

**デメリット:**
- アプリ終了で消える

**→ プロトタイプ検証には十分。永続化は仮説検証後に追加。**

---

## SharedPreferences

**用途:** 設定値、フラグ、少量の単純データ

```yaml
dependencies:
  shared_preferences: ^2.2.0
```

```dart
import 'package:shared_preferences/shared_preferences.dart';

// 保存
final prefs = await SharedPreferences.getInstance();
await prefs.setString('lastReviewId', reviewId);
await prefs.setStringList('reviewIds', ['id1', 'id2', 'id3']);

// 読み込み
final lastId = prefs.getString('lastReviewId');
final ids = prefs.getStringList('reviewIds') ?? [];
```

**適するケース:**
- 最後に見た講評のID
- 設定値（通知ON/OFF）
- 簡単なフラグ

**適さないケース:**
- 講評の全データ（大きすぎる）
- 複雑な構造のデータ

---

## Hive（推奨）

**用途:** 構造化データ、リスト、履歴

```yaml
dependencies:
  hive: ^2.2.3
  hive_flutter: ^1.1.0

dev_dependencies:
  hive_generator: ^2.0.1
  build_runner: ^2.4.0
```

### 初期化

```dart
// main.dart
import 'package:hive_flutter/hive_flutter.dart';

void main() async {
  await Hive.initFlutter();

  // アダプター登録（コード生成後）
  Hive.registerAdapter(PhotoReviewHistoryAdapter());

  // Boxを開く
  await Hive.openBox<PhotoReviewHistory>('reviewHistory');

  runApp(MyApp());
}
```

### モデル定義

```dart
import 'package:hive/hive.dart';

part 'photo_review_history.g.dart';

@HiveType(typeId: 0)
class PhotoReviewHistory extends HiveObject {
  @HiveField(0)
  final String id;

  @HiveField(1)
  final String imagePath;

  @HiveField(2)
  final String category;

  @HiveField(3)
  final String summary;

  @HiveField(4)
  final List<String> goodPoints;

  @HiveField(5)
  final List<String> improvementPoints;

  @HiveField(6)
  final String nextAction;

  @HiveField(7)
  final DateTime createdAt;

  PhotoReviewHistory({
    required this.id,
    required this.imagePath,
    required this.category,
    required this.summary,
    required this.goodPoints,
    required this.improvementPoints,
    required this.nextAction,
    required this.createdAt,
  });
}
```

```bash
# コード生成
flutter pub run build_runner build
```

### CRUD操作

```dart
// Repository
class ReviewHistoryRepository {
  static const _boxName = 'reviewHistory';

  Box<PhotoReviewHistory> get _box => Hive.box<PhotoReviewHistory>(_boxName);

  // 保存
  Future<void> save(PhotoReviewHistory review) async {
    await _box.put(review.id, review);
  }

  // 全件取得（新しい順）
  List<PhotoReviewHistory> getAll() {
    return _box.values.toList()
      ..sort((a, b) => b.createdAt.compareTo(a.createdAt));
  }

  // 1件取得
  PhotoReviewHistory? getById(String id) {
    return _box.get(id);
  }

  // 削除
  Future<void> delete(String id) async {
    await _box.delete(id);
  }

  // 全削除
  Future<void> clear() async {
    await _box.clear();
  }
}
```

### Riverpod連携

```dart
// Provider
final reviewHistoryRepositoryProvider = Provider((ref) {
  return ReviewHistoryRepository();
});

final reviewHistoryListProvider = Provider((ref) {
  return ref.watch(reviewHistoryRepositoryProvider).getAll();
});

// 保存時に呼び出し
Future<void> saveReview(WidgetRef ref, PhotoReview review, File image) async {
  final history = PhotoReviewHistory(
    id: DateTime.now().millisecondsSinceEpoch.toString(),
    imagePath: image.path,
    category: review.category.name,
    summary: review.summary,
    goodPoints: review.goodPoints,
    improvementPoints: review.improvementPoints.map((e) => e.text).toList(),
    nextAction: review.nextAction,
    createdAt: DateTime.now(),
  );

  await ref.read(reviewHistoryRepositoryProvider).save(history);
}
```

---

## SQLite（Drift）

**用途:** 複雑なクエリ、リレーション、大量データ

```yaml
dependencies:
  drift: ^2.14.0
  sqlite3_flutter_libs: ^0.5.0
  path_provider: ^2.1.0
  path: ^1.8.0

dev_dependencies:
  drift_dev: ^2.14.0
  build_runner: ^2.4.0
```

瞬作では通常 **Hive で十分**。SQLiteは以下の場合のみ：
- 検索・フィルタリングが複雑
- データ間のリレーションが必要
- 大量データ（1000件以上）

---

## 画像の保存

講評履歴には画像パスも保存するが、画像自体はファイルシステムに保存。

```dart
import 'package:path_provider/path_provider.dart';
import 'dart:io';

Future<String> saveImage(File image) async {
  final appDir = await getApplicationDocumentsDirectory();
  final fileName = '${DateTime.now().millisecondsSinceEpoch}.jpg';
  final savedImage = await image.copy('${appDir.path}/$fileName');
  return savedImage.path;
}
```

---

## 瞬作での推奨パターン

```
┌─────────────────────────────────────────┐
│         永続化は必要？                   │
└─────────────────────────────────────────┘
        │
        ├── NO → InMemory ★最優先
        │         （プロトタイプ検証には十分）
        │
        └── YES → 永続化が必要な理由を確認
                  │
                  ├── 設定・フラグ → SharedPreferences
                  │
                  ├── 履歴・リスト → Hive
                  │
                  └── 複雑なクエリ → Drift
```

### 履歴機能の場合

```
まずInMemoryで実装:
- 依存追加不要
- 最速で仮説検証
- アプリ終了で消えるがプロトには十分

永続化が必要になったらHiveに移行:
- Notifier の中身を Repository に置き換えるだけ
- インターフェースは同じ
```

---

## チェックリスト

```markdown
### 新機能でデータ保存が必要な場合
1. [ ] まず「InMemoryで十分か？」を確認
2. [ ] InMemoryで実装して仮説検証
3. [ ] 永続化が必要ならHiveに移行

### 永続化追加時（必要になった場合のみ）
- [ ] pubspec.yaml に依存追加
- [ ] モデルクラス定義（Hive の場合は @HiveType）
- [ ] コード生成（build_runner）
- [ ] main.dart で初期化
- [ ] Repository クラス作成
- [ ] Provider 定義
- [ ] 保存処理を既存フローに組み込み
```
