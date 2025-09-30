import { useEffect, useMemo, useState } from "react";
import { createProduct, patchProduct } from "../../services/inventoryService";

export default function ProductForm({
  open,
  mode,            
  product,        
  onClose,         
  onSaved,         
}) {
  const isEdit = mode === "edit";
  const title = isEdit ? "Edit product" : "Create product";

  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    if (isEdit && product) {
      setValues({
        name: product.name ?? "",
        description: product.description ?? "",
        price: product.price ?? "",
        quantity: product.quantity ?? "",
      });
    } else {
      setValues({ name: "", description: "", price: "", quantity: "" });
    }
    setError("");
  }, [open, isEdit, product]);

  const canSave = useMemo(() => {
    const p = Number(values.price);
    const q = Number(values.quantity);
    return values.name.trim().length > 0 && !Number.isNaN(p) && !Number.isNaN(q);
  }, [values]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(v => ({ ...v, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSave || saving) return;

    setSaving(true);
    setError("");
    try {
      let result;
      if (isEdit && product?.id) {
        result = await patchProduct(product.id, values);
      } else {
        result = await createProduct(values);
      }
      onSaved?.(result);
      onClose?.();
    } catch (err) {
      setError(typeof err === "string" ? err : err?.message || "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => !saving && onClose?.()}
      />
      {/* panel */}
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
          <div className="flex items-center justify-between px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={() => !saving && onClose?.()}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                name="name"
                value={values.name}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={values.description}
                onChange={handleChange}
                rows={3}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  value={values.price}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                <input
                  name="quantity"
                  type="number"
                  step="1"
                  value={values.quantity}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="text-sm text-rose-600">{error}</div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                className="px-4 py-2 rounded-md border border-gray-300 text-sm"
                onClick={() => !saving && onClose?.()}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-cyan-600 text-white text-sm disabled:opacity-60"
                disabled={!canSave || saving}
              >
                {saving ? "Saving..." : (isEdit ? "Save changes" : "Create")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
