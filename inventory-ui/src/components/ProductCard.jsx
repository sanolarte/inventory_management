import StockBadge from "./StockBadge";
import Button from "./Button";
import { FaEye, FaRegEdit, FaTrashAlt } from "react-icons/fa";

/* ========== Helpers ========== */
const formatMoney = (n, currency = "USD", locale = "en-US") =>
  new Intl.NumberFormat(locale, { style: "currency", currency }).format(Number(n) || 0);

const initialsFrom = (name) =>
  (name || "?")
    .trim()
    .split(/\s+/)
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default function ProductCard({ p, onView, onEdit, onDelete }) {
  const initials = initialsFrom(p.name);
  const fallback = `https://placehold.co/96x96?text=${encodeURIComponent(initials)}`;

  return (
    <div className="rounded-xl border border-stone-200 bg-white shadow-sm p-4 flex gap-4">
      {p.imageUrl ? (
        <img
          src={p.imageUrl}
          alt={p.name}
          className="h-16 w-16 rounded-md object-cover ring-1 ring-gray-200 flex-none"
          onError={(e) => (e.currentTarget.src = fallback)}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="h-16 w-16 rounded-md grid place-items-center bg-gray-100 text-gray-700 ring-1 ring-gray-200 flex-none">
          <span className="text-sm font-semibold">{initials}</span>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="font-medium text-gray-900 truncate">{p.name}</div>
        <div className="text-xs text-gray-500 mb-1">ID: {String(p.id).padStart(3, "0")}</div>
        <p
          className="text-sm text-gray-700"
          style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
        >
          {p.description}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <span className="font-semibold">{formatMoney(p.price)}</span>
          <StockBadge quantity={p.quantity} />
        </div>

        <div className="mt-3 flex gap-2">
          <Button variant="outline" size="md" onClick={() => onView(p)} title="View">
            <FaEye />
          </Button>
          <Button variant="outline" size="md" onClick={() => onEdit(p)} title="Edit">
            <FaRegEdit />
          </Button>
          <Button variant="danger" size="md" onClick={() => onDelete(p.id)} title="Delete">
            <FaTrashAlt />
          </Button>
        </div>
      </div>
    </div>
  );
}