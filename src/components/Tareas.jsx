import { useState, useRef } from "react";
import { useApp } from "../context/AppContext";
import { Plus, Pencil, Trash2, X, Check, Clock, FileUp, Sparkles } from "lucide-react";

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
  const [pdfTarea, setPdfTarea] = useState(null); // id_tarea al que subir PDF
  const [pdfNombre, setPdfNombre] = useState("");
  const fileRef = useRef();

  const openNew  = () => { setEditing(null); setForm(EMPTY); setShowForm(true); };
  const openEdit = (t) => { setEditing(t.id_tarea); setForm({ nombre_tarea: t.nombre_tarea, fecha_entrega: t.fecha_entrega, descripcion: t.descripcion, status: t.status }); setShowForm(true); };

  const handleSave = () => {
    if (!form.nombre_tarea.trim()) return;
    editing !== null ? updateTarea(editing, form) : addTarea(form);
    setShowForm(false);
  };

  const handlePdf = (id_tarea) => {
    setPdfTarea(id_tarea);
    setPdfNombre("");
    fileRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") { alert("Solo se permiten archivos PDF"); return; }
    setPdfNombre(file.name);
    alert(`PDF "${file.name}" adjuntado a la tarea.`);
    e.target.value = "";
  };

  console.log(tareas);
console.log(Array.isArray(tareas));

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Input oculto para PDF */}
      <input type="file" accept="application/pdf" ref={fileRef} className="hidden" onChange={handleFileChange} />

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Tareas</h2>
          <p className="text-sm text-gray-500">{tareas.length} registrada{tareas.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          <Plus size={16} /> Nueva tarea
        </button>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">{editing !== null ? "Editar tarea" : "Nueva tarea"}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Nombre</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" value={form.nombre_tarea} onChange={(e) => setForm({ ...form, nombre_tarea: e.target.value })} placeholder="Nombre de la tarea" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Fecha de entrega</label>
                <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" value={form.fecha_entrega} onChange={(e) => setForm({ ...form, fecha_entrega: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Descripción</label>
                <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" rows={3} value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} placeholder="Descripción opcional" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  {Object.entries(STATUS_LABELS).map(([key, { label }]) => (<option key={key} value={key}>{label}</option>))}
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 text-gray-600 text-sm font-medium py-2 rounded-lg hover:bg-gray-50 transition-colors">Cancelar</button>
              <button onClick={handleSave} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-1">
                <Check size={15} />{editing !== null ? "Guardar" : "Agregar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      {tareas.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Clock size={40} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">No hay tareas. ¡Agrega una!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tareas.map((t) => {
            const st = STATUS_LABELS[t.status] ?? STATUS_LABELS["P"];
            return (
              <div key={t.id_tarea} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-gray-900 text-sm">{t.nombre_tarea}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${st.color}`}>{st.label}</span>
                  </div>
                  {t.fecha_entrega && (
                    <p className="text-xs text-gray-400 mb-1">Entrega: {new Date(t.fecha_entrega + "T00:00").toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })}</p>
                  )}
                  {t.descripcion && <p className="text-xs text-gray-500 line-clamp-2">{t.descripcion}</p>}
                </div>
                <div className="flex gap-1 shrink-0">
                  {isPro ? (
                    <button onClick={() => handlePdf(t.id_tarea)} className="p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors" title="Adjuntar PDF">
                      <FileUp size={15} />
                    </button>
                  ) : (
                    <button onClick={() => setPage("pagos")} className="p-1.5 text-gray-300 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors" title="Requiere Plan Pro">
                      <Sparkles size={15} />
                    </button>
                  )}
                  <button onClick={() => openEdit(t)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Pencil size={15} /></button>
                  <button onClick={() => deleteTarea(t.id_tarea)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={15} /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}