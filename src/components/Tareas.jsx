import { useState, useRef } from "react";
import { useApp } from "../context/AppContext";
import { Plus, Pencil, Trash2, X, Check, Clock, FileUp, Sparkles, Download } from "lucide-react";

const STATUS_LABELS = {
  P:  { label: "Pendiente",   color: "bg-amber-100 text-amber-700" },
  En: { label: "En progreso", color: "bg-blue-100 text-blue-700"   },
  F:  { label: "Finalizada",  color: "bg-green-100 text-green-700" },
};

const EMPTY = { nombre_tarea: "", fecha_entrega: "", descripcion: "", status: "P" };

export default function Tareas() {
  const { tareas, addTarea, updateTarea, deleteTarea, isPro, setPage } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(EMPTY);
  const fileRef = useRef();

  const openNew  = () => { setEditing(null); setForm(EMPTY); setShowForm(true); };
  const openEdit = (t) => { setEditing(t.id_tarea); setForm({ nombre_tarea: t.nombre_tarea, fecha_entrega: t.fecha_entrega, descripcion: t.descripcion, status: t.status }); setShowForm(true); };

  const handleSave = () => {
    if (!form.nombre_tarea.trim()) return;
    editing !== null ? updateTarea(editing, form) : addTarea(form);
    setShowForm(false);
  };

  // Función para forzar la descarga real
  const downloadFile = async (url, filename) => {
    if (!url) { alert("No hay archivo adjunto."); return; }
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${filename}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (e) {
      window.open(url, "_blank");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Tareas</h2>
          <p className="text-sm text-gray-500">{tareas.length} registrada{tareas.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          <Plus size={16} /> Nueva tarea
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="font-bold text-gray-900 mb-4">{editing !== null ? "Editar tarea" : "Nueva tarea"}</h3>
            <div className="space-y-3">
              <input className="w-full border p-2 rounded-lg text-sm" value={form.nombre_tarea} onChange={(e) => setForm({ ...form, nombre_tarea: e.target.value })} placeholder="Nombre" />
              <input type="date" className="w-full border p-2 rounded-lg text-sm" value={form.fecha_entrega} onChange={(e) => setForm({ ...form, fecha_entrega: e.target.value })} />
              <textarea className="w-full border p-2 rounded-lg text-sm" rows={3} value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} placeholder="Descripción" />
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setShowForm(false)} className="flex-1 border py-2 rounded-lg">Cancelar</button>
              <button onClick={handleSave} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg">Guardar</button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {tareas.map((t) => (
          <div key={t.id_tarea} className="bg-white border rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold">{t.nombre_tarea}</p>
              <p className="text-xs text-gray-400">{t.fecha_entrega}</p>
            </div>
            <div className="flex gap-2">
              {isPro ? (
                <button onClick={() => downloadFile(t.archivo_pdf, t.nombre_tarea)} className="p-2 text-violet-600 hover:bg-violet-50 rounded-lg">
                  <Download size={18} />
                </button>
              ) : (
                <button onClick={() => setPage("pagos")} className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg">
                  <Sparkles size={18} />
                </button>
              )}
              <button onClick={() => openEdit(t)} className="p-2 text-indigo-600"><Pencil size={18} /></button>
              <button onClick={() => deleteTarea(t.id_tarea)} className="p-2 text-red-500"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}