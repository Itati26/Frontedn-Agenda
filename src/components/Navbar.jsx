import { useApp } from "../context/AppContext";
import { CheckSquare, StickyNote, LogOut, BookOpen, CreditCard } from "lucide-react";

export default function Navbar() {
  const { user, page, setPage, logout } = useApp();
  const btn = (target, Icon, label) => (
    <button onClick={() => setPage(target)}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
        page === target ? "bg-white text-indigo-700" : "hover:bg-indigo-600"}`}>
      <Icon size={15} />{label}
    </button>
  );
  return (
    <nav className="bg-indigo-700 text-white px-4 py-3 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-2 font-bold text-lg"><BookOpen size={20} />Mi Agenda</div>
      <div className="flex items-center gap-1">
        {btn("tareas", CheckSquare, "Tareas")}
        {btn("notas",  StickyNote,  "Notas")}
        {btn("pagos",  CreditCard,  "Pro")}
        <div className="ml-3 pl-3 border-l border-indigo-500 flex items-center gap-2">
          <span className="text-xs text-indigo-200 ">{user?.correo}</span>
          <button onClick={logout} className="p-1.5 rounded-lg hover:bg-indigo-600 transition-colors" title="Cerrar sesión">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </nav>
  );
}

