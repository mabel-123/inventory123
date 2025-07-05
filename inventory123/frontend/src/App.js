import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Products from './pages/Products';
import Suppliers from './pages/Suppliers';
import Categories from './pages/Categories';
import Sales from './pages/Sales';
import Login from './pages/Login';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('access');
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/products" />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/products"
        element={
          <PrivateRoute>
            <Products />
          </PrivateRoute>
        }
      />
      <Route path="/suppliers" element={<Suppliers />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/sales" element={<Sales />} />
    </Routes>
  );
}

export default App;
