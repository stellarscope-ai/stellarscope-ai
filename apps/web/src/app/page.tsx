export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#06b6d4] bg-clip-text text-transparent">
            StellarScope AI
          </span>
        </h1>
        <p className="mt-4 text-xl font-medium text-[#f8fafc]">
          Ask. Explore. Understand.
        </p>
        <p className="mt-2 text-lg text-gray-400">
          The AI-powered on-chain intelligence agent for the Stellar ecosystem.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="/chat"
            className="rounded-lg bg-[#6366f1] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#5558e6]"
          >
            Start Exploring
          </a>
          <a
            href="https://github.com/stellarscope-ai/stellarscope-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-gray-700 px-8 py-3 text-sm font-semibold text-gray-300 transition-colors hover:border-gray-500 hover:text-white"
          >
            View on GitHub
          </a>
        </div>
      </div>

      <footer className="absolute bottom-6 text-sm text-gray-500">
        Better questions. Deeper insights.
      </footer>
    </main>
  );
}
