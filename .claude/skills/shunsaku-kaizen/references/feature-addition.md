# 新機能追加チェックリスト（瞬作向け）

既存プロトタイプに機能を追加する際のガイド。

## 追加前の確認

```markdown
### 仮説との整合性
- [ ] この機能は元の仮説検証に必要か？
- [ ] 追加することで検証が複雑にならないか？
- [ ] 最小限の実装で検証できるか？
```

**瞬作の原則:** 仮説検証に不要な機能は追加しない

---

## 機能追加フロー

```
[1] 仮説確認
    │ この機能で何を検証する？
    ▼
[2] 既存コード確認
    │ どこに追加する？影響範囲は？
    ▼
[3] 最小設計
    │ モデル、画面、導線
    ▼
[4] 実装
    │ 1機能ずつ、確認しながら
    ▼
[5] 検証
    │ 動作確認、仮説に対する評価
    ▼
[6] ドキュメント更新
```

---

## 1. 既存コード確認

### 影響範囲の特定

```bash
# ファイル構成確認
tree lib/

# 関連ファイル検索
grep -r "キーワード" lib/
```

### 確認項目

```markdown
- [ ] 既存のモデルに追加が必要か、新規モデルか
- [ ] 既存の画面に統合か、新規画面か
- [ ] 既存の Provider に追加か、新規 Provider か
- [ ] ルーティングの変更が必要か
```

---

## 2. 最小設計

### モデル設計

```markdown
### 新規モデルの場合
- モデル名:
- フィールド:
  -
  -
- 永続化: SharedPreferences / Hive / なし

### 既存モデル拡張の場合
- 対象モデル:
- 追加フィールド:
- 既存コードへの影響:
```

### 画面設計

```markdown
### 新規画面の場合
- 画面名:
- 表示内容:
- アクション:
- 遷移元:
- 遷移先:

### 既存画面への追加の場合
- 対象画面:
- 追加する要素:
- 配置場所:
```

### 導線設計

```markdown
どこから新機能にアクセスするか？

- [ ] ホーム画面にボタン追加
- [ ] AppBar にアイコン追加
- [ ] 既存フローの途中に組み込み
- [ ] ボトムナビゲーション追加
```

---

## 3. 実装パターン

### 履歴・一覧機能の場合

```
必要なもの:
├── モデル（履歴アイテム）
├── Repository（CRUD）
├── Provider（状態管理）
├── 一覧画面
├── 詳細画面（任意）
└── 導線（ボタン等）
```

```dart
// 1. モデル（Hive使用）
@HiveType(typeId: 0)
class HistoryItem extends HiveObject {
  @HiveField(0)
  final String id;
  // ...
}

// 2. Repository
class HistoryRepository {
  List<HistoryItem> getAll() { ... }
  Future<void> save(HistoryItem item) { ... }
}

// 3. Provider
final historyListProvider = Provider((ref) {
  return ref.watch(historyRepositoryProvider).getAll();
});

// 4. 一覧画面
class HistoryScreen extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final items = ref.watch(historyListProvider);
    return ListView.builder(...);
  }
}

// 5. ルーティング追加
GoRoute(
  path: '/history',
  builder: (context, state) => const HistoryScreen(),
),

// 6. 導線追加（ホーム画面など）
IconButton(
  icon: Icon(Icons.history),
  onPressed: () => context.push('/history'),
)
```

### 設定機能の場合

```
必要なもの:
├── SharedPreferences（保存）
├── Provider（状態管理）
├── 設定画面
└── 導線
```

```dart
// Provider
final notificationEnabledProvider = StateProvider<bool>((ref) {
  final prefs = ref.watch(sharedPreferencesProvider);
  return prefs.getBool('notificationEnabled') ?? true;
});

// 設定変更
ref.read(notificationEnabledProvider.notifier).state = newValue;
await prefs.setBool('notificationEnabled', newValue);
```

---

## 4. 導線追加パターン

### ホーム画面にボタン追加

```dart
// home_screen.dart
// 既存のCTAボタンの下などに追加
TextButton.icon(
  onPressed: () => context.push('/history'),
  icon: const Icon(Icons.history_rounded),
  label: const Text('過去の講評を見る'),
)
```

### AppBar にアイコン追加

```dart
AppBar(
  title: Text('タイトル'),
  actions: [
    IconButton(
      icon: const Icon(Icons.history_rounded),
      onPressed: () => context.push('/history'),
    ),
  ],
)
```

### 結果画面に追加

```dart
// result_screen.dart
// 「別の写真を講評」ボタンの近くに
OutlinedButton.icon(
  onPressed: () => context.push('/history'),
  icon: const Icon(Icons.history_rounded),
  label: const Text('過去の講評'),
)
```

---

## 5. チェックリスト

```markdown
### 実装完了チェック
- [ ] モデル定義完了
- [ ] Repository 作成完了
- [ ] Provider 定義完了
- [ ] 画面実装完了
- [ ] ルーティング追加完了
- [ ] 導線追加完了
- [ ] 既存フローへの保存処理組み込み完了

### 動作確認
- [ ] 新機能単体で動作するか
- [ ] 既存機能が壊れていないか
- [ ] データが正しく保存・読み込みされるか

### ドキュメント
- [ ] CHANGELOG.md 更新
- [ ] 必要に応じて README 更新
```

---

## 瞬作での注意点

```markdown
### やること
- 最小限の機能で検証
- 既存コードへの影響を最小化
- すぐに使える技術（Hive等）を選択

### やらないこと
- 過度な抽象化
- 完璧なエラーハンドリング
- 本番品質のUI（検証が目的）
```
