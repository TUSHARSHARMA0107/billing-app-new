import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Products from "./pages/Products";
import Invoices from "./pages/Invoices";
import Expenses from "./pages/Expenses";
import Reports from "./pages/Reports";

import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />


        {/* Protected pages */}
        <Route 
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout><Dashboard /></MainLayout>
            </ProtectedRoute>
          }
        />

        <Route 
          path="/customers"
          element={
            <ProtectedRoute>
              <MainLayout><Customers /></MainLayout>
            </ProtectedRoute>
          }
        />

        <Route 
          path="/products"
          element={
            <ProtectedRoute>
              <MainLayout><Products /></MainLayout>
            </ProtectedRoute>
          }
        />

        <Route 
          path="/invoices"
          element={
            <ProtectedRoute>
              <MainLayout><Invoices /></MainLayout>
            </ProtectedRoute>
          }
        />

        <Route 
          path="/expenses"
          element={
            <ProtectedRoute>
              <MainLayout><Expenses /></MainLayout>
            </ProtectedRoute>
          }
        />

        <Route 
          path="/reports"
          element={
            <ProtectedRoute>
              <MainLayout><Reports /></MainLayout>
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}