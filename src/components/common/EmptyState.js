/**
 * Componente para mostrar estado vacío
 */
import React from 'react';
import './EmptyState.css';

const EmptyState = ({
  icon = '📭',
  title = 'No hay datos',
  message = 'No se encontraron resultados',
  action = null
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-message">{message}</p>
      {action && (
        <div className="empty-state-action">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
