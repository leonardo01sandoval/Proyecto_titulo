import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { FaChartBar, FaDollarSign, FaComments, FaClock, FaPercentage } from 'react-icons/fa';

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
const PIE_COLORS = ["#667eea", "#f59e0b", "#10b981", "#ef4444"];

const Card = ({ children }) => (
  <div className="Card" style={{ background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 8px 20px rgba(16,24,40,.06)", height: "100%" }}>
    {children}
  </div>
);

const KpiCard = ({ title, value, icon }) => (
  <div className="Card" style={{ display: "flex", flexDirection: "column", gap: 8, padding: 20 }}>
    <div className="kpi-title">
      {icon}
      {title}
    </div>
    <div className="kpi-value">{value}</div>
  </div>
);

export default function KPI() {
  return (
    <div style={{ display: "grid", gap: 20 }}>
      {/* Page Header */}
      <div className="PageHeader">
        <div className="PageHeader-icon">
          <FaChartBar size={24} />
        </div>
        <div className="PageHeader-content">
          <h1>Dashboard</h1>
          <p>Métricas y estadísticas principales del sistema</p>
        </div>
      </div>

      {/* KPIs simples */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <KpiCard
          title="Ventas mes"
          value={CLP(kpis.ventasMes)}
          icon={<FaDollarSign />}
        />
        <KpiCard
          title="Conversaciones activas"
          value={kpis.conversacionesActivas}
          icon={<FaComments />}
        />
        <KpiCard
          title="Tiempo resp. prom."
          value={`${kpis.tRespuestaSeg}s`}
          icon={<FaClock />}
        />
        <KpiCard
          title="Tasa conversión"
          value={PCT(kpis.tasaConversion)}
          icon={<FaPercentage />}
        />
      </div>

      {/* Gráficos con tamaño fijo */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
        <Card>
          <h4 className="section-title">Ventas mensuales</h4>
          <BarChart width={600} height={280} data={ventasMensuales}>
            <defs>
              <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#667eea" stopOpacity={0.8}/>
                <stop offset="100%" stopColor="#764ba2" stopOpacity={0.8}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e6e9ef" />
            <XAxis dataKey="mes" stroke="#667085" />
            <YAxis tickFormatter={CLP} stroke="#667085" />
            <Tooltip
              formatter={(v) => CLP(v)}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e6e9ef',
                borderRadius: '10px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            />
            <Bar dataKey="ventas" fill="url(#colorVentas)" radius={[8, 8, 0, 0]} />
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
              innerRadius={60}
              outerRadius={95}
              paddingAngle={2}
            >
              {estadosConversaciones.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e6e9ef',
                borderRadius: '10px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            />
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
