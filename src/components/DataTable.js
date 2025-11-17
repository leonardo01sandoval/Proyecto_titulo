import React, { useMemo, useState } from "react";

/**
 * DataTable(props)
 * - columns: [{ key, header, render?, sortable?, align?, width? }]
 * - data: any[]
 * - pageSize?: number (default 5)
 * - searchable?: boolean (default true)
 * - searchKeys?: string[] (si no, busca en todas las claves string)
 * - rowActions?: (row) => ReactNode (botones/menus a la derecha)
 * - onRowClick?: (row) => void
 * - emptyText?: string
 * - loading?: boolean
 */
export const DataTable = ({
  columns = [],
  data = [],
  pageSize = 5,
  searchable = true,
  searchKeys,
  rowActions,
  onRowClick,
  emptyText = "Sin datos",
  loading = false,
}) => {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({ key: null, dir: "asc" }); // dir: asc|desc

  const filtered = useMemo(() => {
    if (!q.trim()) return data;
    const txt = q.toLowerCase();
    return data.filter((row) => {
      const keys = searchKeys && searchKeys.length ? searchKeys : Object.keys(row);
      return keys.some((k) => {
        const v = row[k];
        return typeof v === "string" && v.toLowerCase().includes(txt);
      });
    });
  }, [q, data, searchKeys]);

  const sorted = useMemo(() => {
    if (!sort.key) return filtered;
    const col = columns.find((c) => c.key === sort.key);
    const dir = sort.dir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const va = col?.render ? String(col.render(a)) : a[sort.key];
      const vb = col?.render ? String(col.render(b)) : b[sort.key];
      // números → numérico, si no string
      const na = typeof va === "number" ? va : String(va ?? "").toLowerCase();
      const nb = typeof vb === "number" ? vb : String(vb ?? "").toLowerCase();
      if (na < nb) return -1 * dir;
      if (na > nb) return 1 * dir;
      return 0;
    });
  }, [filtered, sort, columns]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page, pageSize]);

  const onSort = (key, sortable) => {
    if (!sortable) return;
    setPage(1);
    setSort((prev) => {
      if (prev.key === key) {
        return { key, dir: prev.dir === "asc" ? "desc" : "asc" };
      }
      return { key, dir: "asc" };
    });
  };

  return (
    <div className="Card">
      {/* Top controls */}
      <div className="DT-top">
        <div className="section-title" style={{ margin: 0 }}>Datos</div>
        {searchable && (
          <input
            className="search"
            placeholder="Buscar..."
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
          />
        )}
      </div>

      {/* Table */}
      <div className="DT-container">
        <table className="Table">
          <thead>
            <tr>
              {columns.map((c) => (
                <th
                  key={String(c.key)}
                  style={{ textAlign: c.align || "left", width: c.width }}
                  onClick={() => onSort(c.key, c.sortable)}
                  className={c.sortable ? "th-sortable" : undefined}
                >
                  <span className="th-inner">
                    {c.header}
                    {sort.key === c.key && (
                      <span className="SortCaret">{sort.dir === "asc" ? "▲" : "▼"}</span>
                    )}
                  </span>
                </th>
              ))}
              {rowActions && <th style={{ width: 1 }}></th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={columns.length + (rowActions ? 1 : 0)}>Cargando…</td></tr>
            ) : pageData.length === 0 ? (
              <tr><td colSpan={columns.length + (rowActions ? 1 : 0)} className="meta">{emptyText}</td></tr>
            ) : (
              pageData.map((row, i) => (
                <tr
                  key={i}
                  className={onRowClick ? "row-clickable" : undefined}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((c) => (
                    <td key={String(c.key)} style={{ textAlign: c.align || "left" }}>
                      {c.render ? c.render(row) : String(row[c.key] ?? "—")}
                    </td>
                  ))}
                  {rowActions && <td style={{ textAlign: "right" }}>{rowActions(row)}</td>}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="DT-bottom">
        <div className="meta">Mostrando {pageData.length} de {sorted.length}</div>
        <div className="Pager">
          <button className="btn ghost" disabled={page === 1} onClick={() => setPage(1)}>«</button>
          <button className="btn ghost" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>‹</button>
          <span className="Pager-page">Página {page} / {totalPages}</span>
          <button className="btn ghost" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>›</button>
          <button className="btn ghost" disabled={page === totalPages} onClick={() => setPage(totalPages)}>»</button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
