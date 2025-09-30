import { useContext, useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import DataTable from "../../components/DataTable";
import ProductCell from "../../components/ProductCell";
import ProductCard from "../../components/ProductCard";
import StockBadge from "../../components/StockBadge";
import IconButton from "../../components/IconButton";

import { listProducts, deleteProduct } from "../../services/inventoryService";
import Button from "../../components/Button";
import ProductForm from "./ProductForm";
import ProductDetailModal from "../../components/ProductDetailModal";

import { FaEye, FaRegEdit, FaTrashAlt, FaPlus, FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { PiPackageFill } from "react-icons/pi";

import Swal from "sweetalert2";

/* Helpers */
const formatMoney = (n, currency = "USD", locale = "en-US") =>
  new Intl.NumberFormat(locale, { style: "currency", currency }).format(Number(n) || 0);

export default function Products() {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState({ id: "name", dir: "asc" });
  const [page, setPage] = useState(1);
  const perPage = 10;

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [current, setCurrent] = useState(null);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailItem, setDetailItem] = useState(null);

  const [deletingIds, setDeletingIds] = useState(new Set());
  const lastRemovedRef = useRef(null); 

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  async function handleDelete(id) {
    setDeletingIds(prev => new Set(prev).add(id));

    let removedSnapshot = null;
    setRows(prev => {
      const idx = prev.findIndex(x => x.id === id);
      if (idx === -1) return prev;
      removedSnapshot = { idx, item: prev[idx] };
      const copy = [...prev];
      copy.splice(idx, 1);
      return copy;
    });
    lastRemovedRef.current = removedSnapshot;

    try {
      await deleteProduct(id); 
      Swal.fire({
        toast: true, position: "top-end", timer: 1500, showConfirmButton: false,
        icon: "success", title: "Product deleted"
      });
    } catch (e) {
      // rollback
      const snap = lastRemovedRef.current;
      if (snap) {
        setRows(prev => {
          const copy = [...prev];
          copy.splice(snap.idx, 0, snap.item);
          return copy;
        });
      }
      Swal.fire({ icon: "error", title: "Deletion failed", text: "Please try again." });
    } finally {
      setDeletingIds(prev => { const next = new Set(prev); next.delete(id); return next; });
      lastRemovedRef.current = null;
    }
  }


  async function confirmAndDelete(product) {
    const { isConfirmed } = await Swal.fire({
      title: "Delete product?",
      text: `This will permanently delete "${product.name}".`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#e11d48", // rose-600
      cancelButtonColor: "#6b7280",  // gray-500
      reverseButtons: true,
      focusCancel: true,
    });
    if (!isConfirmed) return;

    await handleDelete(product.id); 
  }


  const openDetail = (p) => { setDetailItem(p); setDetailOpen(true); };
  const openCreate = () => { setCurrent(null); setModalMode("create"); setModalOpen(true); };
  const openEdit = (p) => { setCurrent(p); setModalMode("edit"); setModalOpen(true); };

  const handleSaved = (saved) => {
    setRows((prev) => {
      const idx = prev.findIndex(x => x.id === saved.id);
      if (idx >= 0) { const copy = [...prev]; copy[idx] = saved; return copy; }
      return [saved, ...prev];
    });
  };

  useEffect(() => {
    let alive = true;
    setLoading(true);
    listProducts({ q: query })
      .then((res) => { if (alive) setRows(res || []); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [query]);

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const key = sort.id;
      const dir = sort.dir === "asc" ? 1 : -1;
      if (key === "price" || key === "quantity") {
        return (Number(a[key] ?? 0) - Number(b[key] ?? 0)) * dir;
      }
      const A = (a[key] ?? "").toString().toLowerCase();
      const B = (b[key] ?? "").toString().toLowerCase();
      if (A < B) return -1 * dir;
      if (A > B) return  1 * dir;
      return 0;
    });
    return copy;
  }, [rows, sort]);

  const total = sorted.length;
  const start = (page - 1) * perPage;
  const pageData = sorted.slice(start, start + perPage);

  const columns = [
    { id: "name", header: "Product", sortable: true, cell: (p) => <ProductCell p={p} /> },
    { id: "description", header: "Description", sortable: true, className: "w-[30%]", cell: (p) => <span className="text-gray-700">{p.description}</span> },
    { id: "price", header: "Price", sortable: true, className: "whitespace-nowrap", cell: (p) => <span className="tabular-nums">{formatMoney(p.price)}</span> },
    { id: "quantity", header: "Stock", sortable: true, cell: (p) => <StockBadge quantity={p.quantity} /> },
    {
      id: "actions",
      header: <span className="sr-only">Actions</span>,
      className: "w-40 text-right",               
      cell: (p) => (
        <div className="flex justify-end gap-2">  
          <IconButton variant="outline" title="View details" onClick={() => openDetail(p)}>
            <FaEye className="h-4 w-4" />
          </IconButton>
          <IconButton variant="outline" title="Edit product" onClick={() => openEdit(p)}>
            <FaRegEdit className="h-4 w-4" />
          </IconButton>
          <IconButton variant="danger" title="Delete product" onClick={() => confirmAndDelete(p)}>
            <FaTrashAlt className="h-4 w-4" />
          </IconButton>
        </div>
      ),
    },
  ];


  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
          <header className="flex items-center gap-4 p-6 border-b">
            <div className="h-10 w-10 grid place-items-center rounded-full text-cyan-700 text-4xl cursor-pointer" onClick={() => navigate("/")}>
              <PiPackageFill />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Inventory Products</h1>
              <p className="text-gray-500 text-sm">View and manage products in a data table.</p>
            </div>
            <div className="ml-auto flex items-center gap-3">
              {user?.username && <span className="hidden sm:block text-sm text-gray-500">Signed in as <strong>{user.username}</strong></span>}
              <Button variant="logout" rightIcon={<FiLogOut />} onClick={handleLogout}>Sign out</Button>
            </div>
          </header>

          <div className="p-4 md:p-6">
            <div className="flex flex-wrap justify-end gap-3">
              <Button variant="primary" onClick={openCreate} leftIcon={<FaPlus />}>New product</Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-2 md:p-6">
            {/* Mobile: cards */}
            <div className="md:hidden">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {pageData.map((p) => (
                  <ProductCard key={p.id} p={p} onView={openDetail} onEdit={openEdit} onDelete={deleteProduct} />
                ))}
              </div>

              {total > perPage && (
                <div className="flex items-center justify-between px-1 py-3 text-sm">
                  <span className="text-gray-500">
                    Page <strong>{page}</strong> of <strong>{Math.ceil(total / perPage)}</strong>
                  </span>
                  <div className="inline-flex rounded-md shadow-sm isolate">
                    <button
                      className="px-3 py-1.5 border rounded-l-md bg-white hover:bg-gray-50 disabled:opacity-50"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      <FaAngleDoubleLeft />
                    </button>
                    <button
                      className="px-3 py-1.5 border -ml-px rounded-r-md bg-white hover:bg-gray-50 disabled:opacity-50"
                      onClick={() => setPage((p) => Math.min(Math.ceil(total / perPage), p + 1))}
                      disabled={page >= Math.ceil(total / perPage)}
                    >
                      <FaAngleDoubleRight />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Desktop: table */}
            <div className="hidden md:block">
              <DataTable
                frameless
                columns={columns}
                data={pageData}
                isLoading={loading}
                emptyText="No products"
                page={page}
                perPage={perPage}
                total={total}
                onPageChange={setPage}
                sort={sort}
                onSortChange={setSort}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ProductForm
        open={modalOpen}
        mode={modalMode}
        product={current}
        onClose={() => setModalOpen(false)}
        onSaved={handleSaved}
      />
      <ProductDetailModal
        open={detailOpen}
        product={detailItem}
        onClose={() => setDetailOpen(false)}
        currency="USD"
        locale="en-US"
      />
    </div>
  );
}

