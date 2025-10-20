import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, Legend
} from "recharts";

// ===== Datos de ejemplo =====
const kpis = {
  ventasMes: 482000000,
  conversacionesActivas: 34,
  tRespuestaSeg: 48,
  tasaConversion: 0.27,
};

const ventasMensuales = [
  { mes: "Abr", ventas: 210_000_000 },
  { mes: "May", ventas: 245_000_000 },
  { mes: "Jun", ventas: 230_000_000 },
  { mes: "Jul", ventas: 260_000_000 },
  { mes: "Ago", ventas: 305_000_000 },
  { mes: "Sep", ventas: 330_000_000 },
  { mes: "Oct", ventas: 482_000_000 },
];

const estadosConversaciones = [
  { name: "Abiertas", value: 22 },
  { name: "Pendientes", value: 9 },
  { name: "Ganadas", value: 7 },
  { name: "Perdidas", value: 5 },
];

const rankingAgentes = [
  { agente: "Paula", conv: 56, ventas: 18, monto: 185_000_000, resp: 25 },
  { agente: "Leo", conv: 49, ventas: 14, monto: 142_000_000, resp: 34 },
  { agente: "Camila", conv: 37, ventas: 11, monto: 118_000_000, resp: 48 },
];

const CLP = (n) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(n);

const PCT = (v) => `${Math.round(v * 100)}%`;
const PIE_COLORS = ["#2563eb", "#f59e0b", "#16a34a", "#ef4444"];

const Card = ({ children }) => (
  <div className="Card" style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 4px 10px rgba(0,0,0,0.05)", height: "100%" }}>
    {children}
  </div>
);

const KpiCard = ({ title, value }) => (
  <div className="Card" style={{ display: "grid", gap: 6, padding: 16 }}>
    <div className="kpi-title" style={{ color: "#667085", fontSize: 12 }}>{title}</div>
    <div className="kpi-value" style={{ fontSize: 26, fontWeight: 700 }}>{value}</div>
  </div>
);

export default function KPI() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      {/* KPIs simples */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        <KpiCard title="Ventas mes" value={CLP(kpis.ventasMes)} />
        <KpiCard title="Conversaciones activas" value={kpis.conversacionesActivas} />
        <KpiCard title="Tiempo resp. prom." value={`${kpis.tRespuestaSeg}s`} />
        <KpiCard title="Tasa conversión" value={PCT(kpis.tasaConversion)} />
      </div>

      {/* Gráficos con tamaño fijo */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
        <Card>
          <h4 className="section-title">Ventas mensuales</h4>
          <BarChart width={600} height={280} data={ventasMensuales}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis tickFormatter={CLP} />
            <Tooltip formatter={(v) => CLP(v)} />
            <Bar dataKey="ventas" fill="#2563eb" radius={[6, 6, 0, 0]} />
          </BarChart>
        </Card>

        <Card>
          <h4 className="section-title">Estados de conversaciones</h4>
          <PieChart width={350} height={280}>
            <Pie
              data={estadosConversaciones}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={3}
            >
              {estadosConversaciones.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </Card>
      </div>

      {/* Tabla top agentes */}
      <Card>
        <h4 className="section-title">Top agentes (últimos 30 días)</h4>
        <table className="Table" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", color: "#667085" }}>
              <th>Agente</th>
              <th>Convers.</th>
              <th>Ventas</th>
              <th>Valor</th>
              <th>1ª resp. (s)</th>
            </tr>
          </thead>
          <tbody>
            {rankingAgentes.map((r) => (
              <tr key={r.agente}>
                <td>{r.agente}</td>
                <td>{r.conv}</td>
                <td>{r.ventas}</td>
                <td>{CLP(r.monto)}</td>
                <td>{r.resp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
