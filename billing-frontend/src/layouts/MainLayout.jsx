import Sidebar from "../components/Sidebar";

export default function MainLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />

      <div className="flex-1 overflow-y-auto p-6 bg-gray-900/40 backdrop-blur">
        {children}
      </div>
    </div>
  );
}