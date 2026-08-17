import AnimatedChart from '../common/AnimatedChart';

export default function Timeline() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <span className="font-mono text-xs text-accent-amber tracking-wider uppercase">trajectory</span>
          <h2 className="text-3xl font-bold text-text-primary mt-2">Projects Shipped</h2>
          <p className="text-text-muted mt-2 max-w-xl">
            A cumulative timeline of shipped projects, from first build to present.
          </p>
        </div>
        <AnimatedChart />
      </div>
    </section>
  );
}
