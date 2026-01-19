---
name: shunsaku-impl-flutter
description: 瞬作のFlutter実装サブスキル。shunsakuから呼び出され、ハンドオフ契約に基づいてFlutterプロトタイプを実装する。直接呼び出しは非推奨（先にshunsakuで問診を完了すること）。
---

# 瞬作 Flutter実装サブスキル

## 概要

このスキルは `shunsaku`（問診駆動・瞬作ステップ）から呼び出される実装専用サブスキルです。
ハンドオフ契約を受け取り、Flutterプロトタイプを最短で実装します。

## 技術スタック

| 項目 | 採用 | 理由 |
|------|------|------|
| 状態管理 | **Riverpod 3.x** | 型安全、テスタブル、スケーラブル |
| ルーティング | **go_router** | 宣言的ルーティング、ディープリンク対応 |
| ローカル保存 | **SharedPreferencesAsync** | 2025年推奨の新API、常に最新データ |
| プロジェクト構造 | **レイヤーファースト** | 小規模プロトタイプに適切 |

## Riverpod 3.0 注意点

> ⚠️ Riverpod 3.0 は過渡期バージョン。4.0が比較的早期にリリースされる可能性あり。

| 変更点 | 対応 |
|--------|------|
| `StateProvider` | **非推奨（legacy）** → `Notifier` を使用 |
| `AutoDisposeNotifier` | `Notifier` に統合（AutoDispose削除） |
| `.valueOrNull` | **削除** → `.value` を使用 |
| エラー処理 | 全て `ProviderException` にラップされる |
| 状態変更検知 | `identical` → `==` に変更 |

## 前提条件

- `shunsaku` のゲートA〜Eが完了していること
- ハンドオフ契約（shunsaku_handoff）が渡されていること

## 実装フロー

### 1. 環境確認

```bash
# Flutterの確認（mise使用の場合）
mise exec -- flutter --version

# または直接
flutter --version
```

**Flutter未インストールの場合**:
```bash
mise install flutter@latest && mise use flutter@latest
```

### 2. プロジェクト作成（新規の場合）

```bash
# 現在のディレクトリに作成
mise exec -- flutter create --org com.example --project-name <project_name> .

# 依存パッケージをインストール
mise exec -- flutter pub get
```

### 3. 標準パッケージ構成

```yaml
# pubspec.yaml に追加する標準パッケージ
dependencies:
  flutter_riverpod: ^3.0.0     # 状態管理（3系）
  go_router: ^14.0.0           # ルーティング
  shared_preferences: ^2.2.2   # ローカル保存（Async API使用）
  image_picker: ^1.0.7         # 写真選択（必要な場合）
```

### 4. iOS権限設定（必要な場合）

`ios/Runner/Info.plist` に追加:

```xml
<!-- カメラロールアクセス -->
<key>NSPhotoLibraryUsageDescription</key>
<string>写真を選択するために使用します</string>

<!-- カメラアクセス -->
<key>NSCameraUsageDescription</key>
<string>写真を撮影するために使用します</string>
```

### 5. 標準ディレクトリ構成

```
lib/
├── main.dart                 # エントリーポイント（ProviderScope）
├── router/                   # ルーティング
│   └── app_router.dart       # GoRouter設定
├── models/                   # データモデル
│   └── observation_log.dart  # 観測ログモデル
├── providers/                # Riverpod Providers（Notifierベース）
│   ├── log_notifier.dart     # 観測ログNotifier
│   └── selected_image_notifier.dart  # 選択画像Notifier
├── repositories/             # データ層
│   └── log_repository.dart   # ログ保存リポジトリ
├── screens/                  # 画面（ConsumerWidget使用）
│   ├── home_screen.dart      # ホーム画面
│   └── result_screen.dart    # 結果画面
└── services/                 # 外部サービス
    └── mock_service.dart     # モックサービス
```

### 6. ルーター設定（go_router）

```dart
// lib/router/app_router.dart
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../screens/home_screen.dart';
import '../screens/result_screen.dart';

final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/',
    routes: [
      GoRoute(
        path: '/',
        name: 'home',
        builder: (context, state) => const HomeScreen(),
      ),
      GoRoute(
        path: '/result',
        name: 'result',
        builder: (context, state) => const ResultScreen(),
      ),
    ],
  );
});
```

### 7. main.dart（ProviderScope + GoRouter）

```dart
// lib/main.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'router/app_router.dart';

void main() {
  runApp(
    const ProviderScope(
      child: MyApp(),
    ),
  );
}

class MyApp extends ConsumerWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(routerProvider);

    return MaterialApp.router(
      title: 'プロトタイプ',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      routerConfig: router,
    );
  }
}
```

### 8. 観測ログモデル

```dart
// lib/models/observation_log.dart
class ObservationLog {
  final int id;
  final DateTime timestamp;
  final String action;
  final Map<String, dynamic> data;
  final bool success;

  const ObservationLog({
    required this.id,
    required this.timestamp,
    required this.action,
    required this.data,
    required this.success,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'timestamp': timestamp.toIso8601String(),
        'action': action,
        'data': data,
        'success': success,
      };

  factory ObservationLog.fromJson(Map<String, dynamic> json) => ObservationLog(
        id: json['id'] as int,
        timestamp: DateTime.parse(json['timestamp'] as String),
        action: json['action'] as String,
        data: json['data'] as Map<String, dynamic>,
        success: json['success'] as bool,
      );
}
```

### 9. ログリポジトリ（SharedPreferencesAsync使用）

```dart
// lib/repositories/log_repository.dart
import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/observation_log.dart';

final logRepositoryProvider = Provider<LogRepository>((ref) {
  return LogRepository();
});

class LogRepository {
  static const _key = 'observation_logs';

  // SharedPreferencesAsync を使用（2025年推奨）
  Future<List<ObservationLog>> getLogs() async {
    final prefs = SharedPreferencesAsync();
    final json = await prefs.getString(_key);
    if (json == null) return [];
    final List<dynamic> list = jsonDecode(json);
    return list.map((e) => ObservationLog.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<void> saveLog(ObservationLog log) async {
    final logs = await getLogs();
    logs.add(log);
    final prefs = SharedPreferencesAsync();
    await prefs.setString(
      _key,
      jsonEncode(logs.map((e) => e.toJson()).toList()),
    );
  }

  Future<int> getNextId() async {
    final logs = await getLogs();
    if (logs.isEmpty) return 1;
    return logs.map((e) => e.id).reduce((a, b) => a > b ? a : b) + 1;
  }

  Future<void> clearLogs() async {
    final prefs = SharedPreferencesAsync();
    await prefs.remove(_key);
  }
}
```

### 10. Notifier実装（StateProvider非推奨のため）

```dart
// lib/providers/selected_image_notifier.dart
import 'dart:io';
import 'package:flutter_riverpod/flutter_riverpod.dart';

// Riverpod 3.x: StateProviderの代わりにNotifierを使用
final selectedImageProvider = NotifierProvider<SelectedImageNotifier, File?>(() {
  return SelectedImageNotifier();
});

class SelectedImageNotifier extends Notifier<File?> {
  @override
  File? build() => null;

  void select(File file) {
    state = file;
  }

  void clear() {
    state = null;
  }
}
```

```dart
// lib/providers/log_notifier.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/observation_log.dart';
import '../repositories/log_repository.dart';

// ログ一覧Provider
final logsProvider = FutureProvider<List<ObservationLog>>((ref) async {
  final repository = ref.watch(logRepositoryProvider);
  return repository.getLogs();
});

// 統計Provider（logsProviderから派生）
final statsProvider = FutureProvider<Map<String, int>>((ref) async {
  final logs = await ref.watch(logsProvider.future);
  return {
    'total': logs.length,
    'success': logs.where((e) => e.success).length,
    'failure': logs.where((e) => !e.success).length,
  };
});

// ログ操作Notifier
final logNotifierProvider = AsyncNotifierProvider<LogNotifier, void>(() {
  return LogNotifier();
});

class LogNotifier extends AsyncNotifier<void> {
  @override
  Future<void> build() async {}

  Future<void> saveLog({
    required String action,
    required Map<String, dynamic> data,
    required bool success,
  }) async {
    final repository = ref.read(logRepositoryProvider);
    final nextId = await repository.getNextId();
    final log = ObservationLog(
      id: nextId,
      timestamp: DateTime.now(),
      action: action,
      data: data,
      success: success,
    );
    await repository.saveLog(log);
    ref.invalidate(logsProvider);
  }

  Future<void> clearLogs() async {
    final repository = ref.read(logRepositoryProvider);
    await repository.clearLogs();
    ref.invalidate(logsProvider);
  }
}
```

### 11. 画面での使用例（ConsumerWidget + go_router）

```dart
// lib/screens/home_screen.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';
import '../providers/log_notifier.dart';
import '../providers/selected_image_notifier.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final statsAsync = ref.watch(statsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('ホーム'),
        actions: [
          IconButton(
            icon: const Icon(Icons.delete_outline),
            onPressed: () async {
              await ref.read(logNotifierProvider.notifier).clearLogs();
            },
          ),
        ],
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // 統計表示
            statsAsync.when(
              data: (stats) => Column(
                children: [
                  Text('合計: ${stats['total']}'),
                  Text('成功: ${stats['success']} / 失敗: ${stats['failure']}'),
                ],
              ),
              loading: () => const CircularProgressIndicator(),
              error: (e, _) => Text('エラー: $e'),
            ),
            const SizedBox(height: 32),
            // 写真選択ボタン
            ElevatedButton.icon(
              onPressed: () async {
                final picker = ImagePicker();
                final image = await picker.pickImage(source: ImageSource.gallery);
                if (image != null) {
                  ref.read(selectedImageProvider.notifier).select(File(image.path));
                  if (context.mounted) {
                    context.push('/result');  // go_router でナビゲーション
                  }
                }
              },
              icon: const Icon(Icons.photo_library),
              label: const Text('写真を選択'),
            ),
          ],
        ),
      ),
    );
  }
}
```

```dart
// lib/screens/result_screen.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/log_notifier.dart';
import '../providers/selected_image_notifier.dart';

class ResultScreen extends ConsumerWidget {
  const ResultScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selectedImage = ref.watch(selectedImageProvider);

    if (selectedImage == null) {
      return const Scaffold(
        body: Center(child: Text('画像が選択されていません')),
      );
    }

    return Scaffold(
      appBar: AppBar(title: const Text('結果')),
      body: Column(
        children: [
          Expanded(
            child: Image.file(selectedImage, fit: BoxFit.contain),
          ),
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                ElevatedButton.icon(
                  onPressed: () async {
                    await ref.read(logNotifierProvider.notifier).saveLog(
                      action: 'feedback',
                      data: {'photoName': selectedImage.path.split('/').last},
                      success: true,
                    );
                    ref.read(selectedImageProvider.notifier).clear();
                    if (context.mounted) {
                      context.go('/');  // ホームに戻る
                    }
                  },
                  icon: const Icon(Icons.thumb_up),
                  label: const Text('いいね'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.green.shade100,
                  ),
                ),
                ElevatedButton.icon(
                  onPressed: () async {
                    await ref.read(logNotifierProvider.notifier).saveLog(
                      action: 'feedback',
                      data: {'photoName': selectedImage.path.split('/').last},
                      success: false,
                    );
                    ref.read(selectedImageProvider.notifier).clear();
                    if (context.mounted) {
                      context.go('/');
                    }
                  },
                  icon: const Icon(Icons.thumb_down),
                  label: const Text('よくないね'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.red.shade100,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
```

### 12. ビルド・実行

```bash
# 静的解析
mise exec -- flutter analyze

# iOSシミュレータで実行
mise exec -- flutter run -d <device_id>

# デバイス一覧確認
mise exec -- flutter devices
```

## 出力

実装完了時に以下を提供:

1. **動くプロトタイプ** - 縦切り1本のフローが動作
2. **観測ログ機能** - Riverpod + SharedPreferencesAsync でログ記録
3. **ドキュメント** - README + 設計docs

### README.md

```markdown
# [プロジェクト名]

## 概要
<!-- 何を検証するプロトタイプか -->

## 起動手順

\`\`\`bash
# 依存パッケージをインストール
mise exec -- flutter pub get

# iOSシミュレータで起動
mise exec -- flutter run

# デバイス一覧確認
mise exec -- flutter devices
\`\`\`

## 操作方法
1.
2.
3.

## 検証の進め方
1. VERIFICATION_CARD.md を確認
2. 上記の操作を実施
3. 観測ログを確認（アプリ内 or SharedPreferences）
4. DOCDD_RESULT.md に結果を記入

## 技術スタック
- Flutter 3.x
- Riverpod 3.x（状態管理）
- go_router（ルーティング）
- SharedPreferencesAsync（ログ保存）

## ディレクトリ構成
\`\`\`
lib/
├── main.dart
├── router/
├── models/
├── providers/
├── repositories/
├── screens/
└── services/
\`\`\`
```

### 設計ドキュメント（docs/）

#### docs/ARCHITECTURE.md

```markdown
# アーキテクチャ

## 全体構成

\`\`\`
┌─────────────┐
│   Screens   │  UI層（ConsumerWidget）
├─────────────┤
│  Providers  │  状態管理層（Riverpod Notifier）
├─────────────┤
│Repositories │  データ層
├─────────────┤
│  Services   │  外部サービス層
└─────────────┘
\`\`\`

## 採用パターン
- **状態管理**: Riverpod 3.x（Notifierベース）
- **ルーティング**: go_router（宣言的）
- **プロジェクト構造**: レイヤーファースト

## 主要な設計判断
| 判断 | 理由 |
|------|------|
| | |
```

#### docs/DATA_FLOW.md

```markdown
# データフロー

## 主要フロー

\`\`\`
[ユーザー操作]
    ↓
[Screen] → ref.read(xxxProvider.notifier).action()
    ↓
[Notifier] → 状態更新 / Repository呼び出し
    ↓
[Repository] → SharedPreferencesAsync
    ↓
[Notifier] → ref.invalidate() で再取得
    ↓
[Screen] → ref.watch() で自動再描画
\`\`\`

## Provider依存関係

\`\`\`
logsProvider
    ↑
statsProvider（派生）

logNotifierProvider → logRepositoryProvider
\`\`\`

## 観測ログの流れ
1. ユーザーアクション発生
2. LogNotifier.saveLog() 呼び出し
3. SharedPreferencesAsync に JSON 保存
4. logsProvider を invalidate
5. statsProvider が自動更新
```

#### docs/COMPONENTS.md

```markdown
# コンポーネント設計

## 画面一覧

| 画面 | パス | 役割 |
|------|------|------|
| HomeScreen | / | |
| ResultScreen | /result | |

## 主要コンポーネント

### Providers

| Provider | 種別 | 役割 |
|----------|------|------|
| selectedImageProvider | Notifier | 選択画像の保持 |
| logsProvider | FutureProvider | ログ一覧取得 |
| statsProvider | FutureProvider | 統計情報（派生） |
| logNotifierProvider | AsyncNotifier | ログ操作 |

### Repositories

| Repository | 役割 |
|------------|------|
| LogRepository | 観測ログの永続化 |

## 拡張ポイント
<!-- 本格開発時に変更が必要な箇所 -->
- モック → 実API
- SharedPreferences → Hive/Isar
- レイヤーファースト → フィーチャーファースト
```

## ブロッカー時の質問ルール

実装中のブロッカーは最大1〜2問に限定:

- 「API鍵がないのでモックに切り替えて良い？」
- 「画面遷移が2案あるが、検証したいのはどちら？」
- 「〇〇のパッケージがエラー、代替を使って良い？」

## チェックリスト

実装完了前に確認:

- [ ] `flutter analyze` でエラーなし
- [ ] ProviderScope でアプリをラップ
- [ ] MaterialApp.router + GoRouter を使用
- [ ] StateProvider を使わず Notifier を使用
- [ ] 縦切り1本のフローが動作する
- [ ] 観測ログがSharedPreferencesに保存される
- [ ] 起動手順が明確

---

## トラブルシューティング

### Flutterが見つからない

```bash
# miseでインストール
mise install flutter@latest && mise use flutter@latest

# 確認
mise exec -- flutter --version
```

### iOSシミュレータが認識されない

**原因**: Xcodeのパスが CommandLineTools になっている

```bash
# 確認
xcode-select -p
# /Library/Developer/CommandLineTools と表示されたらNG

# 修正（sudo必要）
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer

# シミュレータ起動
open -a Simulator

# 再確認
flutter devices
```

### Podインストールエラー

```bash
cd ios && pod install --repo-update && cd ..
```

### 権限エラー（フォトライブラリ等）

`ios/Runner/Info.plist` に権限の説明文が必要:

```xml
<key>NSPhotoLibraryUsageDescription</key>
<string>目的を説明する文</string>
```

### Riverpod関連エラー

```dart
// ProviderScope忘れ
// → main.dart で ProviderScope でラップ

// ref.watch vs ref.read の使い分け
// build内 → ref.watch（リアクティブ）
// コールバック内 → ref.read（1回だけ読む）

// StateProvider使用エラー（Riverpod 3.x）
// → Notifier に置き換え
// import 'package:flutter_riverpod/legacy.dart'; // 一時的な回避策
```

### go_router関連エラー

```dart
// context.go vs context.push
// context.go('/path')   → スタックをリセット
// context.push('/path') → スタックに追加（戻れる）
// context.pop()         → 前の画面に戻る

// 画面遷移後のcontext使用
// if (context.mounted) を必ずチェック
```

---

## 実装パターン集

### パターン1: 入力 → 処理 → 評価フィードバック

今回の「写真講評」アプリのような、ユーザー入力に対してAI/モック処理を行い、結果の良し悪しをフィードバックするパターン。

**Provider構成（Notifierベース）**:
```dart
// 入力データ（StateProvider非推奨 → Notifier使用）
final selectedImageProvider = NotifierProvider<SelectedImageNotifier, File?>(() {
  return SelectedImageNotifier();
});

class SelectedImageNotifier extends Notifier<File?> {
  @override
  File? build() => null;

  void select(File file) => state = file;
  void clear() => state = null;
}

// 処理結果
final reviewProvider = FutureProvider.autoDispose<Review?>((ref) async {
  final image = ref.watch(selectedImageProvider);
  if (image == null) return null;
  return MockService.generateReview(image);
});
```

**ルーティング**:
```dart
// go_router
GoRoute(
  path: '/result',
  builder: (context, state) => const ResultScreen(),
),

// ナビゲーション
context.push('/result');  // 結果画面へ
context.go('/');          // ホームへ（スタックリセット）
```

### パターン2: 入力 → 出力（単純変換）

入力に対して単純に出力を返すパターン。評価フィードバックは最小限。

### パターン3: ウィザード形式

複数ステップを経て最終結果に至るパターン。各ステップでの離脱率を観測。

```dart
// ステップ管理（Notifierベース）
final wizardProvider = NotifierProvider<WizardNotifier, int>(() {
  return WizardNotifier();
});

class WizardNotifier extends Notifier<int> {
  @override
  int build() => 0;

  void next() => state++;
  void back() => state = state > 0 ? state - 1 : 0;
  void reset() => state = 0;
}

// ルーティング
GoRoute(
  path: '/wizard/:step',
  builder: (context, state) {
    final step = int.parse(state.pathParameters['step'] ?? '0');
    return WizardScreen(step: step);
  },
),
```

---

## 将来の拡張

プロトタイプが成功し、本格開発に移行する場合:

| 項目 | プロトタイプ | 本格開発 |
|------|-------------|---------|
| プロジェクト構造 | レイヤーファースト | フィーチャーファースト |
| モデル | 素のクラス | freezed |
| ローカルDB | SharedPreferences | Hive / Isar |
| ルーティング | go_router | go_router + go_router_builder（型安全） |

---

## 自動検証

実装完了後、自動検証スキルを呼び出して動作確認を行う:

```
/shunsaku-verify-flutter
```

**検証内容:**
- 画面キャプチャ
- UI要素確認
- 操作フローテスト

詳細は `shunsaku-verify-flutter` スキルを参照。
