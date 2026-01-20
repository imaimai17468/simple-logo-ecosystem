import Link from "next/link";
import { ModeToggle } from "@/components/shared/mode-toggle/ModeToggle";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 h-16 bg-purple-600">
      <div className="container mx-auto flex h-full items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
            <svg
              className="h-6 w-6 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <title>Sparkles</title>
              <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 22.5l-.394-1.933a2.25 2.25 0 00-1.423-1.423L12.75 19l1.933-.394a2.25 2.25 0 001.423-1.423L16.5 15.75l.394 1.933a2.25 2.25 0 001.423 1.423L20.25 19l-1.933.394a2.25 2.25 0 00-1.423 1.423z" />
            </svg>
          </div>
          <h1 className="font-bold text-2xl text-white tracking-tight">
            Simple Icon Ecosystem
          </h1>
        </Link>
        <div className="flex items-center gap-5">
          <nav className="flex items-center gap-6">
            <Link
              href="/custom-icon"
              className="text-white transition-colors hover:text-white/80"
            >
              Custom Icon
            </Link>
          </nav>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};
