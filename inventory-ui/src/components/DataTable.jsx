import { useMemo } from "react";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";

function cx(...args) {
  return args.filter(Boolean).join(" ");
}


export default function DataTable({
  title,
  columns = [],
  data = [],
  isLoading = false,
  emptyText = "Sin resultados",
  page = 1,
  perPage = 10,
  total = 0,
  onPageChange,
  sort,
  onSortChange,
  toolbar, 
}) {
  const pages = Math.max(1, Math.ceil(total / perPage));

  function toggleSort(colId, sortable) {
    if (!sortable || !onSortChange) return;
    if (!sort || sort.id !== colId) return onSortChange({ id: colId, dir: "asc" });
    onSortChange({ id: colId, dir: sort.dir === "asc" ? "desc" : "asc" });
  }

  const skeletonRows = useMemo(
    () => Array.from({ length: Math.min(perPage, 5) }, (_, i) => i),
    [perPage]
  );

  return (
    <div className="rounded-xl bg-white shadow-sm">
      {/* Header */}
      {(title || toolbar) && (
        <div className="flex items-center justify-between px-4 py-3 ">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <div>{toolbar}</div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr className="divide-x divide-gray-100">
              {columns.map((c) => {
                const isSorted = sort?.id === c.id;
                return (
                  <th
                    key={c.id}
                    scope="col"
                    className={cx("px-6 py-3 text-left font-medium select-none", c.className)}
                  >
                    <button
                      type="button"
                      onClick={() => toggleSort(c.id, c.sortable)}
                      className={cx(
                        "inline-flex items-center gap-1",
                        c.sortable ? "cursor-pointer hover:text-gray-900" : "cursor-default"
                      )}
                    >
                      <span>{c.header}</span>
                      {c.sortable && (
                        <svg
                          viewBox="0 0 20 20"
                          className={cx(
                            "h-4 w-4 transition",
                            isSorted ? "opacity-100" : "opacity-30"
                          )}
                          aria-hidden
                        >
                          {sort?.dir === "desc" ? (
                            <path d="M5 7h10l-5-5-5 5zm0 6h10l-5 5-5-5z" fill="currentColor" />
                          ) : (
                            <path d="M5 7h10l-5-5-5 5z" fill="currentColor" />
                          )}
                        </svg>
                      )}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {isLoading &&
              skeletonRows.map((i) => (
                <tr key={`sk-${i}`}>
                  {columns.map((c, ci) => (
                    <td key={ci} className="px-6 py-4">
                      <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))}

            {!isLoading && data.length === 0 && (
              <tr>
                <td className="px-6 py-10 text-center text-gray-500" colSpan={columns.length}>
                  {emptyText}
                </td>
              </tr>
            )}

            {!isLoading &&
              data.map((row, ri) => (
                <tr key={row.id ?? ri} className="hover:bg-gray-50">
                  {columns.map((c, ci) => (
                    <td key={ci} className="px-6 py-4 align-middle">
                      {c.cell ? c.cell(row) : row[c.id]}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pag*/}
      {onPageChange && pages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-stone-300 text-sm">
          <span className="text-gray-500">
            Page <strong>{page}</strong> of <strong>{pages}</strong>
          </span>
          <div className="inline-flex rounded-md shadow-sm isolate">
            <button
              className="px-3 py-1.5 border border-stone-500 rounded-l-md bg-white hover:bg-stone-200 disabled:opacity-50"
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page === 1}
            >
              <FaAngleDoubleLeft />
            </button>
            <button
              className="px-3 py-1.5 border border-stone-500 -ml-px rounded-r-md bg-white hover:bg-stone-200 disabled:opacity-50"
              onClick={() => onPageChange(Math.min(pages, page + 1))}
              disabled={page === pages}
            >
              <FaAngleDoubleRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
