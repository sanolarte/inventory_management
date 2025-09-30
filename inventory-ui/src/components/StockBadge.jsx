export default function StockBadge({ quantity }) {
  const qty = Math.max(0, Number(quantity) || 0);
  const fmt = (n) => new Intl.NumberFormat("en-US").format(n);

  const state =
    qty > 20
      ? { color: "bg-emerald-500", text: `In stock (${fmt(qty)})` }
      : qty > 0
      ? { color: "bg-amber-500", text: `${fmt(qty)} left` }
      : { color: "bg-rose-500", text: "Out of stock (0)" };

  return (
    <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
      <span className={`h-2 w-2 rounded-full ${state.color}`} />
      {state.text}
    </span>
  );
}