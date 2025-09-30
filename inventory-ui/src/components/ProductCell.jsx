const initialsFrom = (name) =>
  (name || "?")
    .trim()
    .split(/\s+/)
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default function ProductCell({ p }) {
  const initials = initialsFrom(p.name);
  const fallback = `https://placehold.co/64x64?text=${encodeURIComponent(initials)}`;

  return (
    <div className="flex items-center gap-3">
      {p.imageUrl ? (
        <img
          src={p.imageUrl}
          alt={p.name}
          className="h-12 w-12 rounded-md object-cover ring-1 ring-gray-200"
          onError={(e) => (e.currentTarget.src = fallback)}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="h-12 w-12 rounded-md grid place-items-center bg-gray-100 text-gray-700 ring-1 ring-gray-200">
          <span className="text-sm font-semibold">{initials}</span>
        </div>
      )}
      <div className="min-w-0">
        <div className="font-medium text-gray-900 truncate">{p.name}</div>
        <div className="text-xs text-gray-500">ID: {String(p.id).padStart(3, "0")}</div>
      </div>
    </div>
  );
}