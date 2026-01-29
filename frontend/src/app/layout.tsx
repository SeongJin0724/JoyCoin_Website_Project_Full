import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JOYCOIN",
  description: "JoyCoin Website",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col relative overflow-hidden">
        <div className="liquid-bg">
          <div className="liquid-drop"></div>
        </div>
        
        <div className="fixed top-0 left-0 right-0 z-[60] px-4 md:px-10 py-5 flex justify-between items-center pointer-events-none">
          <div className="flex items-center space-x-4 pointer-events-auto">
            <a 
              href="/" 
              className="text-2xl md:text-3xl font-black tracking-tighter text-blue-500 cursor-pointer drop-shadow-lg"
            >
              JOYCOIN
            </a>
          </div>

          <div className="flex items-center space-x-4 pointer-events-auto">
            <nav className="hidden lg:flex items-center space-x-8 text-base font-bold text-white/80 mr-4">
              <a href="/deposits" className="hover:text-blue-400 transition-colors">마이페이지</a>
              <a href="/buy" className="hover:text-blue-400 transition-colors">구매하기</a>
            </nav>
            <a 
              href="/auth/login" 
              className="bg-red-500/20 text-red-400 px-4 py-2 rounded-2xl border border-red-500/30 hover:bg-red-500/30 transition-all active:scale-95 font-bold text-sm"
            >
              로그인
            </a>
          </div>
        </div>

        <main className="flex-1 flex flex-col relative z-10 pt-20">
          {children}
        </main>

        <footer className="py-10 text-center text-slate-600 text-[10px] font-bold uppercase tracking-[0.3em] z-10">
          &copy; 2024 JOYCOIN GLOBAL FOUNDATION • SECURED BY BLOCKCHAIN
        </footer>
      </body>
    </html>
  );
}
