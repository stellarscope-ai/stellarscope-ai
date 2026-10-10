export default function AppFooter() {
  return (
    <footer className="flex flex-col items-center justify-between gap-2 px-6 py-4 text-xs text-muted-foreground sm:flex-row h-auto">
      <p>&copy; {new Date().getFullYear()} StellarScope AI. All rights reserved.</p>

      <div className="flex items-center gap-4">
        <a href="/docs" className="hover:text-foreground transition-colors">
          Docs
        </a>
        <a href="/support" className="hover:text-foreground transition-colors">
          Support
        </a>
        <a href="/status" className="hover:text-foreground transition-colors">
          Status
        </a>
        <a
          href="https://github.com/stellarscope-ai/stellarscope-ai"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors"
        >
          GitHub
        </a>
        <span className="text-muted-foreground/60">v1.0.0</span>
      </div>
    </footer>
  );
}
