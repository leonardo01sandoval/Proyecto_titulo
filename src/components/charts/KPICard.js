/**
 * Componente KPI Card
 * Muestra una métrica clave con tendencia
 */
import React from 'react';
import './KPICard.css';

const KPICard = ({
  title,
  value,
  icon,
  trend = null,
  trendLabel = '',
  color = 'blue',
  subtitle = '',
  onClick = null,
}) => {
  const colorClasses = {
    blue: 'kpi-card-blue',
    green: 'kpi-card-green',
    orange: 'kpi-card-orange',
    red: 'kpi-card-red',
    purple: 'kpi-card-purple',
  };

  const formatTrend = (trend) => {
    if (trend === null || trend === undefined) return null;

    const isPositive = trend >= 0;
    const arrow = isPositive ? '↑' : '↓';
    const trendClass = isPositive ? 'trend-positive' : 'trend-negative';

    return (
      <span className={`kpi-trend ${trendClass}`}>
        {arrow} {Math.abs(trend)}%
      </span>
    );
  };

  return (
    <div
      className={`kpi-card ${colorClasses[color]} ${onClick ? 'kpi-card-clickable' : ''}`}
      onClick={onClick}
    >
      <div className="kpi-card-header">
        <span className="kpi-card-icon">{icon}</span>
        <div className="kpi-card-trend-container">
          {formatTrend(trend)}
          {trendLabel && <span className="kpi-trend-label">{trendLabel}</span>}
        </div>
      </div>

      <div className="kpi-card-body">
        <h3 className="kpi-card-value">{value}</h3>
        <p className="kpi-card-title">{title}</p>
        {subtitle && <p className="kpi-card-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
};

export default KPICard;
