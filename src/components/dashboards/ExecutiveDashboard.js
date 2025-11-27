/**
 * Dashboard Principal Ejecutivo
 * Muestra KPIs, gráficos y tabla de chats
 */
import React, { useState, useEffect } from 'react';
import chatService from '../../services/chatService';
import { transformChatData, calculateKPIs } from '../../utils/dataTransformers';
import {
  groupChatsByPeriod,
  getPeakHours,
  analyzeProductMentions,
} from '../../utils/analyticsUtils';
import { applyFilters, clearFilters } from '../../utils/filterUtils';
import KPICard from '../charts/KPICard';
import LineChartComponent from '../charts/LineChartComponent';
import BarChartComponent from '../charts/BarChartComponent';
import DonutChartComponent from '../charts/DonutChartComponent';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import './ExecutiveDashboard.css';

const ExecutiveDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [filters, setFilters] = useState({
    datePreset: '30days',
    status: 'TODAS',
    searchText: '',
  });
  const [kpis, setKpis] = useState(null);
  const [error, setError] = useState(null);

  // Cargar datos iniciales
  useEffect(() => {
    loadChats();
  }, []);

  // Aplicar filtros cuando cambian
  useEffect(() => {
    if (chats.length > 0) {
      const filtered = applyFilters(chats, filters);
      setFilteredChats(filtered);

      // Recalcular KPIs con datos filtrados
      const newKpis = calculateKPIs(filtered);
      setKpis(newKpis);
    }
  }, [chats, filters]);

  const loadChats = async () => {
    try {
      setLoading(true);
      setError(null);

      const rawChats = await chatService.getAllChats();
      const transformed = transformChatData(rawChats);

      setChats(transformed);
      setFilteredChats(transformed);

      const initialKpis = calculateKPIs(transformed);
      setKpis(initialKpis);
    } catch (err) {
      setError(err.message || 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters(clearFilters());
  };

  if (loading) {
    return <LoadingSpinner size="large" message="Cargando dashboard..." />;
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <EmptyState
          icon="⚠️"
          title="Error al cargar datos"
          message={error}
          action={
            <button onClick={loadChats} className="btn-primary">
              Reintentar
            </button>
          }
        />
      </div>
    );
  }

  if (!chats || chats.length === 0) {
    return (
      <EmptyState
        icon="📊"
        title="No hay datos disponibles"
        message="No se encontraron conversaciones para mostrar"
        action={
          <button onClick={loadChats} className="btn-primary">
            Recargar
          </button>
        }
      />
    );
  }

  // Preparar datos para gráficos
  const timeSeriesData = groupChatsByPeriod(filteredChats, 'day');
  const productData = analyzeProductMentions(filteredChats)
    .slice(0, 10)
    .map((p) => ({ name: p.name, value: p.mentions }));
  const peakHoursData = getPeakHours(filteredChats, 10);

  const statusData = [
    { name: 'Abiertas', value: kpis?.openConversations || 0 },
    { name: 'Ganadas', value: kpis?.wonConversations || 0 },
    { name: 'Perdidas', value: kpis?.lostConversations || 0 },
    { name: 'Pendientes', value: kpis?.pendingConversations || 0 },
  ].filter((item) => item.value > 0);

  return (
    <div className="executive-dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard Ejecutivo</h1>
        <p className="dashboard-subtitle">
          Resumen de {filteredChats.length} conversaciones
        </p>
      </div>

      {/* Filtros */}
      <div className="dashboard-filters">
        <div className="filter-group">
          <label>Período:</label>
          <select
            value={filters.datePreset}
            onChange={(e) => handleFilterChange('datePreset', e.target.value)}
            className="filter-select"
          >
            <option value="">Todos</option>
            <option value="today">Hoy</option>
            <option value="yesterday">Ayer</option>
            <option value="7days">Últimos 7 días</option>
            <option value="30days">Últimos 30 días</option>
            <option value="90days">Últimos 90 días</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Estado:</label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="filter-select"
          >
            <option value="TODAS">Todas</option>
            <option value="ABIERTA">Abiertas</option>
            <option value="GANADA">Ganadas</option>
            <option value="PERDIDA">Perdidas</option>
            <option value="PENDIENTE">Pendientes</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Búsqueda:</label>
          <input
            type="text"
            value={filters.searchText}
            onChange={(e) => handleFilterChange('searchText', e.target.value)}
            placeholder="Buscar por cliente, mensaje..."
            className="filter-input"
          />
        </div>

        <button onClick={handleClearFilters} className="btn-secondary">
          Limpiar filtros
        </button>
      </div>

      {/* KPIs */}
      <div className="kpi-grid">
        <KPICard
          title="Conversaciones Totales"
          value={kpis?.totalConversations || 0}
          icon="💬"
          color="blue"
        />
        <KPICard
          title="Conversaciones Activas"
          value={kpis?.openConversations || 0}
          icon="📊"
          color="orange"
        />
        <KPICard
          title="Tiempo Respuesta Promedio"
          value={`${kpis?.averageResponseTime || 0} min`}
          icon="⏱️"
          color="purple"
        />
        <KPICard
          title="Tasa de Conversión"
          value={`${kpis?.conversionRate || 0}%`}
          icon="🎯"
          color="green"
        />
      </div>

      {/* Gráficos */}
      <div className="charts-grid">
        <div className="chart-full">
          <LineChartComponent
            data={timeSeriesData}
            xKey="date"
            yKey="count"
            title="Conversaciones en el tiempo"
            height={300}
          />
        </div>

        <div className="chart-half">
          <DonutChartComponent
            data={statusData}
            title="Estados de Conversaciones"
            height={300}
          />
        </div>

        <div className="chart-half">
          <BarChartComponent
            data={productData}
            xKey="name"
            yKey="value"
            title="Top 10 Productos Consultados"
            height={300}
          />
        </div>

        <div className="chart-full">
          <BarChartComponent
            data={peakHoursData}
            xKey="hour"
            yKey="count"
            title="Horarios Pico de Conversaciones"
            height={250}
          />
        </div>
      </div>

      {/* Tabla de chats recientes */}
      <div className="recent-chats">
        <h2 className="section-title">Conversaciones Recientes</h2>
        <div className="chats-table-container">
          <table className="chats-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Teléfono</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Productos</th>
                <th>Mensajes</th>
              </tr>
            </thead>
            <tbody>
              {filteredChats.slice(0, 10).map((chat) => (
                <tr key={chat.id}>
                  <td>{chat.clientName}</td>
                  <td>{chat.clientPhone}</td>
                  <td>{new Date(chat.date).toLocaleDateString('es-ES')}</td>
                  <td>
                    <span className={`status-badge status-${chat.status.toLowerCase()}`}>
                      {chat.status}
                    </span>
                  </td>
                  <td>{chat.products.join(', ') || 'N/A'}</td>
                  <td>{chat.messageCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveDashboard;
