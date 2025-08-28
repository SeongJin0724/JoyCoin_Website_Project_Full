import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JOYCOIN",
  description: "JoyCoin Website",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-violet-50 text-slate-800">
        <header className="sticky top-0 bg-white/80 backdrop-blur border-b">
          <div className="max-w-5xl mx-auto flex items-center justify-between p-4">
            <a href="/" className="font-semibold tracking-wide">JOYCOIN.VIP</a>
            <nav className="flex items-center gap-6 text-sm">
              <a className="hover:text-violet-600" href="/buy">구매하기</a>
              <a className="hover:text-violet-600" href="/guide/purchase">구매 가이드</a>
              <a className="px-3 py-1 rounded-full bg-violet-600 text-white hover:bg-violet-700" href="/auth/login">Login</a>
            </nav>
          </div>
        </header>
        <main className="max-w-5xl mx-auto p-4">{children}</main>
        <footer className="border-t mt-16">
          <div className="max-w-5xl mx-auto p-6 text-xs text-slate-500">Copyright 2025 © JOYCOIN</div>
        </footer>
      </body>
    </html>
  );
}
