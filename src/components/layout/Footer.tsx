import StreamingLog from '../common/StreamingLog';

export default function Footer() {
  return (
    <footer className="border-t border-border-subtle mt-32">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-4">
        {/* Copyright */}
        <p className="font-mono text-xs text-text-muted text-center">
          © 2026 Yatharth Pandey. Built with React + TypeScript + Tailwind CSS.
        </p>

        {/* Streaming log: contained strip, separated from copyright by a thin border */}
        <div className="pt-4 border-t border-border-subtle/50">
          <StreamingLog />
        </div>
      </div>
    </footer>
  );
}