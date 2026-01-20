import { CustomIconEditor } from "@/features/custom-icon-editor/CustomIconEditor";

export default function CustomIconPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="font-bold text-3xl">カスタムアイコンエディター</h1>
        <p className="text-muted-foreground">
          グラデーション、テキスト、ボーダーを自由に編集してオリジナルアイコンを作成
        </p>
      </header>

      <CustomIconEditor />
    </div>
  );
}
