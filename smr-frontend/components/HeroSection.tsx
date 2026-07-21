export function HeroSection() {
  return (
    <section className="w-full bg-surface-primary ">
      <div className="max-w-3xl md:w-1/2 pt-4 m-auto flex flex-col p-8 justify-center items-center gap-4">
        <h1 className="text-fg-primary text-center text-4xl font-bold">
          Your Journey, <span className="text-accent">Shared </span>and
          Sustainable
        </h1>
        <p className="text-center text-sm font-bold text-fg-secondary sm:text-xs">
          Connect with verified drivers and travelers going your way. Reduce
          your carbon footprint while saving on costs.
        </p>
      </div>
    </section>
  );
}
