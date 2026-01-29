export default function Page() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center space-y-16 px-6 py-20 relative min-h-[calc(100vh-80px)]">
      <div className="text-center group">
        <h1 className="text-7xl md:text-[12rem] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-yellow-400 via-red-500 to-blue-500 transition-all duration-1000 group-hover:scale-105 select-none drop-shadow-2xl">
          JOYCOIN
        </h1>
      </div>

      <div className="flex flex-col md:flex-row gap-6 w-full max-w-2xl px-4">
        <a 
          href="/auth/login"
          className="flex-1 py-5 px-8 glass hover:bg-white/10 text-white font-black text-xl rounded-3xl transition-all transform hover:-translate-y-1 active:scale-95 border border-white/20 shadow-2xl text-center"
        >
          로그인
        </a>
        <a 
          href="/auth/signup"
          className="flex-1 py-5 px-8 glass hover:bg-white/10 text-white font-black text-xl rounded-3xl transition-all transform hover:-translate-y-1 active:scale-95 border border-white/20 shadow-2xl text-center"
        >
          회원가입
        </a>
        <a 
          href="/buy"
          className="flex-1 py-5 px-8 bg-gradient-to-br from-blue-500 to-indigo-700 hover:from-blue-400 hover:to-indigo-600 text-white font-black text-xl rounded-3xl shadow-2xl shadow-blue-500/40 transition-all transform hover:-translate-y-1 active:scale-95 text-center"
        >
          구매하기
        </a>
      </div>
      
      <div className="absolute bottom-12 opacity-30 animate-bounce">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </div>
  );
}
