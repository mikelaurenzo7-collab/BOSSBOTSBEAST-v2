export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-8xl font-bold tracking-tighter bg-gradient-to-r from-red-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
          BEAST<span className="text-yellow-400">OS</span>
        </h1>
        <p className="mt-6 text-2xl text-zinc-400">Your Sovereign AI Empire Awaits</p>
        <button className="mt-12 px-10 py-6 bg-white text-black text-xl font-bold rounded-2xl hover:scale-105 transition-all">
          AWAKEN FIRST BEAST
        </button>
      </div>
    </main>
  );
}