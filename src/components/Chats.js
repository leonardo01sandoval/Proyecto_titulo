import React from "react";
import { FaComments } from 'react-icons/fa';
import DataTable from "./DataTable";

const conversations = [
  { id: "cv1", cliente: "María Pérez", empresa: "Hobbie Store", ultimo: "¿Precio modelo 1:6?", estado: "open", hora: "13:15" },
  { id: "cv2", cliente: "Mayorista Lira", empresa: "AgroClick", ultimo: "Agendemos cierre", estado: "won", hora: "12:02" },
  { id: "cv3", cliente: "Sucursal Concepción", empresa: "RetailMax", ultimo: "¿Stock 50 cajas?", estado: "pending", hora: "09:48" }
];

const pill = (s) => {
  const map = { open: "Pill Pill--open", won: "Pill Pill--won", lost: "Pill Pill--lost", pending: "Pill Pill--pending" };
  return <span className={map[s] || "Pill"}>{s}</span>;
};

export const Chats = () => {
  return (
    <div>
      {/* Page Header */}
      <div className="PageHeader">
        <div className="PageHeader-icon">
          <FaComments size={24} />
        </div>
        <div className="PageHeader-content">
          <h1>Chats</h1>
          <p>Gestiona las conversaciones con clientes</p>
        </div>
      </div>

      <DataTable
        data={conversations}
        searchKeys={["cliente", "empresa", "ultimo"]}
        columns={[
          { key: "cliente", header: "Cliente", sortable: true },
          { key: "empresa", header: "Empresa", sortable: true },
          { key: "ultimo", header: "Último mensaje", width: "40%" },
          { key: "estado", header: "Estado", sortable: true, render: (r) => pill(r.estado), align: "center", width: 140 },
          { key: "hora", header: "Hora", sortable: true, align: "right", width: 80 },
        ]}
        pageSize={5}
        onRowClick={(row) => alert(`Abrir conversación ${row.id}`)}
        rowActions={(row) => (
          <button className="btn btn-small" onClick={(e) => { e.stopPropagation(); alert(`Asignar ${row.id}`); }}>
            Asignar
          </button>
        )}
      />
    </div>
  );
};
