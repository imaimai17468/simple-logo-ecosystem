import { IconGenerator } from "@/features/icon-generator/IconGenerator";

export const metadata = {
  title: "アイコン生成 | Icon Generator",
  description: "AIでアイコンとOGP画像を生成",
};

export default function IconGeneratorPage() {
  return (
    <div className="py-12">
      <h1 className="mb-8 font-bold text-3xl">アイコン生成</h1>
      <IconGenerator />
    </div>
  );
}
