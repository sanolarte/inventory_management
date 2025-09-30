import ModalBase from "../components/ModalBase";

/* Helpers */
const initialsFrom = (name = "?") =>
  name.trim().split(/\s+/).map(s => s[0]).join("").slice(0,2).toUpperCase();

const hueFrom = (str="") => {
  let h = 0; for (let i=0;i<str.length;i++) h = (h*31 + str.charCodeAt(i)) % 360;
  return h;
};
const money = (n, currency="USD", locale="en-US") =>
  new Intl.NumberFormat(locale, { style:"currency", currency }).format(Number(n)||0);

function StockBadge({ quantity }) {
  const q = Math.max(0, Number(quantity) || 0);
  const color = q > 20 ? "bg-emerald-500" : q > 0 ? "bg-amber-500" : "bg-rose-500";
  const label = q > 20 ? `In stock (${q})` : q > 0 ? `${q} left` : "Out of stock (0)";
  return (
    <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-sm">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      {label}
    </span>
  );
}

export default function ProductDetailModal({ open, onClose, product, currency="USD", locale="en-US" }) {
  if (!product) return null;

  const { name, description, price, quantity, id } = product;
  const initials = initialsFrom(name);
  const hue = hueFrom(name || "");
  const avatarStyle = {
    background: `linear-gradient(135deg, hsl(${hue} 80% 45%), hsl(${(hue+30)%360} 70% 55%))`
  };

  return (
    <ModalBase open={open} onClose={onClose} title="Product details" size="lg">
      {/* ====== DOS COLUMNAS ====== */}
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex justify-center">
          <div
            className="h-40 w-40 rounded-xl grid place-items-center text-white text-3xl font-semibold select-none ring-1 ring-white/20 shadow"
            style={avatarStyle}
            aria-label={`Avatar de ${name}`}
          >
            {initials}
          </div>
        </div>

        <div className="flex flex-col w-full">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-3xl font-semibold text-gray-900 leading-tight">{name}</h2>
              <p className="text-xs text-gray-500 mt-1">ID: {String(id).padStart(3, "0")}</p>
            </div>
            <StockBadge quantity={quantity} />
          </div>

          <p className="mt-4 text-gray-700 text-base">{description || "—"}</p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="text-xs text-gray-500">Price</div>
              <div className="text-lg font-semibold text-gray-900">{money(price, currency, locale)}</div>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="text-xs text-gray-500">Quantity</div>
              <div className="text-lg font-semibold text-gray-900">{Number(quantity) || 0}</div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              className="px-4 py-2 rounded-md bg-cyan-600 text-white text-sm hover:bg-cyan-500"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </ModalBase>
  );
}
