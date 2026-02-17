const CardGrid = ({ cards }) => (
  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
    {cards.map((card) => (
      <article key={card.label} className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-glow light:border-slate-200 light:bg-white">
        <p className="text-sm text-slate-400">{card.label}</p>
        <h3 className="mt-2 text-2xl font-semibold">{card.value}</h3>
        <p className="mt-1 text-sm text-emerald-400">{card.change}</p>
      </article>
    ))}
  </div>
)

export default CardGrid
