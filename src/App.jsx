import { AppProvider, useApp } from "./context/AppContext";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Tareas from "./components/Tareas";
import Notas from "./components/Notas";
import Pagos from "./components/Pagos";

function AppContent() {
  const { user, page } = useApp();
  if (!user) return <Login />;
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="py-6">
        {page === "tareas" && <Tareas />}
        {page === "notas"  && <Notas />}
        {page === "pagos"  && <Pagos />}
      </main>
    </div>
  );
}

export default function App() {
  return <AppProvider><AppContent /></AppProvider>;
}
