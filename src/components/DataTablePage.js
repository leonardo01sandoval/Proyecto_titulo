import React from "react";
import { FaTable } from 'react-icons/fa';
import DataTable from "./DataTable";

// Datos de ejemplo
const sampleData = [
  { id: 1, nombre: "Producto A", categoria: "Electrónica", precio: 45000, stock: 120 },
  { id: 2, nombre: "Producto B", categoria: "Hogar", precio: 28000, stock: 85 },
  { id: 3, nombre: "Producto C", categoria: "Deportes", precio: 67000, stock: 42 },
  { id: 4, nombre: "Producto D", categoria: "Electrónica", precio: 92000, stock: 15 },
  { id: 5, nombre: "Producto E", categoria: "Hogar", precio: 34000, stock: 200 },
  { id: 6, nombre: "Producto F", categoria: "Deportes", precio: 51000, stock: 78 },
];

const CLP = (n) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(n);

export default function DataTablePage() {
  return (
    <div>
      {/* Page Header */}
      <div className="PageHeader">
        <div className="PageHeader-icon">
          <FaTable size={24} />
        </div>
        <div className="PageHeader-content">
          <h1>Tabla de Datos</h1>
          <p>Visualiza y filtra información en formato tabular</p>
        </div>
      </div>

      <DataTable
        data={sampleData}
        searchKeys={["nombre", "categoria"]}
        columns={[
          { key: "id", header: "ID", sortable: true, width: 80, align: "center" },
          { key: "nombre", header: "Nombre", sortable: true },
          { key: "categoria", header: "Categoría", sortable: true },
          { key: "precio", header: "Precio", sortable: true, render: (r) => CLP(r.precio), align: "right" },
          { key: "stock", header: "Stock", sortable: true, align: "center" },
        ]}
        pageSize={5}
        onRowClick={(row) => alert(`Ver detalles del producto ${row.nombre}`)}
        rowActions={(row) => (
          <button className="btn btn-small ghost" onClick={(e) => { e.stopPropagation(); alert(`Editar ${row.nombre}`); }}>
            Editar
          </button>
        )}
      />
    </div>
  );
}
