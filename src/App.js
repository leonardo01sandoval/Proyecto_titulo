// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import KPI from './components/KPI';
import { Chats } from './components/Chats';
import {ListadoCliente} from './components/ListadoCliente';
import {DataTable} from './components/DataTable';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<KPI />} />
        <Route path="chats" element={<Chats />} />
        <Route path="clientes" element={<ListadoCliente />} />
        <Route path="datatable" element={<DataTable />} />
      </Route>
    </Routes>
  );
}

