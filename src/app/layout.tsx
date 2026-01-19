import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/shared/header/Header";
import { ThemeProvider } from "@/components/shared/theme-provider/ThemeProvider";

export const metadata: Metadata = {
  title: "Simple Icon Ecosystem",
  description: "AIでアイコンとOGP画像を生成",
  openGraph: {
    title: "Simple Icon Ecosystem",
    description: "AIでアイコンとOGP画像を生成",
    images: ["/ogp-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Simple Icon Ecosystem",
    description: "AIでアイコンとOGP画像を生成",
    images: ["/ogp-image.png"],
  },
  icons: {
    icon: [{ url: "/icon-192x192.png", sizes: "192x192", type: "image/png" }],
    apple: "/icon-192x192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body
        className="antialiased"
        style={{
          fontFamily:
            '"Hiragino Kaku Gothic ProN", "ヒラギノ角ゴ ProN W3", "Hiragino Kaku Gothic Pro", "ヒラギノ角ゴ Pro W3", "メイリオ", Meiryo, "游ゴシック", YuGothic, sans-serif',
        }}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-dvh flex-col gap-16">
            <Header />
            <div className="flex w-full flex-1 justify-center pb-16">
              <div className="container max-w-7xl px-6 md:px-8">{children}</div>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
