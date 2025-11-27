import { NavLink } from "react-router-dom";
import {
  Home,
  User,
  Box,
  FileText,
  DollarSign,
  BarChart2,
  Settings
} from "lucide-react";

export default function Sidebar() {
  const links = [
    { to: "/dashboard", label: "Dashboard", icon: <Home size={20} /> },
    { to: "/customers", label: "Customers", icon: <User size={20} /> },
    { to: "/products", label: "Products", icon: <Box size={20} /> },
    { to: "/invoices", label: "Invoices", icon: <FileText size={20} /> },
    { to: "/expenses", label: "Expenses", icon: <DollarSign size={20} /> },
    { to: "/reports", label: "Reports", icon: <BarChart2 size={20} /> },
    { to: "/settings", label: "Settings", icon: <Settings size={20} /> }
  ];

  return (
    <div className="h-screen w-64 bg-gradient-to-b from-gray-900 via-gray-950 to-black 
      border-r border-gray-800 shadow-xl px-4 py-6 flex flex-col relative">

      {/* Logo */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-semibold text-white tracking-wide">Billing</h1>
        <p className="text-gray-400 text-xs">Management System</p>
      </div>

      {/* NAV LINKS */}
      <nav className="flex flex-col gap-2">
        {links.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all
              ${isActive 
                ? "bg-blue-600/20 text-blue-400 border border-blue-600/30 shadow-sm" 
                : "text-gray-300 hover:bg-gray-800/50 hover:text-white"}`
            }
          >
            {item.icon}
            <span className="text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* FOOTER */}
      <div className="mt-auto text-center text-gray-500 text-xs pt-6 border-t border-gray-800">
        © 2025 Billing App
      </div>
    </div>
  );
}