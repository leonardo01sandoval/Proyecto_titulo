import React, { useEffect, useState } from "react";
import { FaUsers, FaPlus } from 'react-icons/fa';

const LS_KEY = "clientes:data";

export const ListadoCliente = () => {
  // ---- estado del formulario
  const [nombreEmpresa, setNombreEmpresa] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [agente, setAgente] = useState("");            // input temporal
  const [agentes, setAgentes] = useState([]);          // array final
  const [fonoExtra, setFonoExtra] = useState("");      // input temporal
  const [telefonos, setTelefonos] = useState([]);      // array final

  // ---- listado
  const [clientes, setClientes] = useState([]);

  // cargar/persistir
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setClientes(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(clientes));
  }, [clientes]);

  // helpers
  const addAgente = () => {
    const v = agente.trim();
    if (!v) return;
    if (!agentes.includes(v)) setAgentes([...agentes, v]);
    setAgente("");
  };
  const removeAgente = (a) => setAgentes(agentes.filter((x) => x !== a));

  const normalizarFono = (v) => v.replace(/[^\d+]/g, "");
  const addFono = () => {
    const v = normalizarFono(fonoExtra.trim());
    if (!v) return;
    if (!telefonos.includes(v)) setTelefonos([...telefonos, v]);
    setFonoExtra("");
  };
  const removeFono = (f) => setTelefonos(telefonos.filter((x) => x !== f));

  const limpiarForm = () => {
    setNombreEmpresa("");
    setDireccion("");
    setTelefono("");
    setAgente("");
    setAgentes([]);
    setFonoExtra("");
    setTelefonos([]);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!nombreEmpresa.trim()) return alert("Ingresa el nombre de la empresa");
    if (!telefono.trim() && telefonos.length === 0)
      return alert("Agrega al menos un teléfono (principal o adicional)");
    const nuevo = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      nombreEmpresa: nombreEmpresa.trim(),
      direccion: direccion.trim(),
      telefono: normalizarFono(telefono.trim()),
      agentes,
      telefonos, // adicionales
      creado: new Date().toISOString(),
    };
    setClientes([nuevo, ...clientes]);
    limpiarForm();
  };

  const eliminar = (id) => {
    if (!window.confirm("¿Eliminar cliente?")) return;
    setClientes(clientes.filter((c) => c.id !== id));
  };

  return (
    <div>
      {/* Page Header */}
      <div className="PageHeader">
        <div className="PageHeader-icon">
          <FaUsers size={24} />
        </div>
        <div className="PageHeader-content">
          <h1>Clientes</h1>
          <p>Administra tu base de clientes</p>
        </div>
      </div>

      {/* Formulario */}
      <div className="Card" style={{ marginBottom: 20 }}>
        <div className="section-title">
          <FaPlus size={14} style={{ marginRight: 8 }} />
          Crear cliente
        </div>
        <form onSubmit={onSubmit}>
          <div className="row" style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", gap: 12 }}>
            <div>
              <label>Nombre de empresa</label>
              <input
                className="input"
                placeholder="Ej.: AgroClick SpA"
                value={nombreEmpresa}
                onChange={(e) => setNombreEmpresa(e.target.value)}
              />
            </div>
            <div>
              <label>Dirección</label>
              <input
                className="input"
                placeholder="Ej.: Av. Siempre Viva 123"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
              />
            </div>
            <div>
              <label>Teléfono principal</label>
              <input
                className="input"
                placeholder="+56 9 1234 5678"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
              />
            </div>
          </div>

          {/* Agentes comerciales */}
          <div style={{ height: 8 }} />
          <label>Agentes comerciales</label>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              className="input"
              placeholder="Agregar agente (Enter)"
              value={agente}
              onChange={(e) => setAgente(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addAgente();
                }
              }}
            />
            <button type="button" className="btn ghost" onClick={addAgente}>
              Añadir
            </button>
          </div>
          <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {agentes.map((a) => (
              <span key={a} className="pill" title="Quitar" onClick={() => removeAgente(a)}>
                {a} ✕
              </span>
            ))}
          </div>

          {/* Teléfonos adicionales */}
          <div style={{ height: 8 }} />
          <label>Teléfonos adicionales</label>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              className="input"
              placeholder="+56 2 2345 6789"
              value={fonoExtra}
              onChange={(e) => setFonoExtra(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addFono();
                }
              }}
            />
            <button type="button" className="btn ghost" onClick={addFono}>
              Añadir
            </button>
          </div>
          <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {telefonos.map((f) => (
              <span key={f} className="pill" title="Quitar" onClick={() => removeFono(f)}>
                {f} ✕
              </span>
            ))}
          </div>

          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="btn" type="submit">
              <FaPlus size={12} style={{ marginRight: 6 }} />
              Guardar cliente
            </button>
            <span className="meta">
              Los datos se guardan localmente en tu navegador
            </span>
          </div>
        </form>
      </div>

      {/* Listado */}
      <div className="Card">
        <table className="Table">
          <thead>
            <tr>
              <th>Empresa</th>
              <th>Dirección</th>
              <th>Tel. principal</th>
              <th>Agentes</th>
              <th>Teléfonos</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {clientes.length === 0 ? (
              <tr>
                <td colSpan="6" className="meta">Sin clientes aún</td>
              </tr>
            ) : (
              clientes.map((c) => (
                <tr key={c.id}>
                  <td>{c.nombreEmpresa}</td>
                  <td>{c.direccion || "—"}</td>
                  <td>{c.telefono || "—"}</td>
                  <td>{c.agentes?.length ? c.agentes.join(", ") : "—"}</td>
                  <td>{c.telefonos?.length ? c.telefonos.join(", ") : "—"}</td>
                  <td>
                    <button className="btn btn-small danger" onClick={() => eliminar(c.id)}>Eliminar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListadoCliente;
