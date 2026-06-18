import { useState } from "react";
import { useApp } from "../context/AppContext";
import { Plus, Pencil, Trash2, X, Check, StickyNote } from "lucide-react";

const EMPTY = { titulo: "", descripcion: "" };

export default function Notas() {
  const { notas, addNota, updateNota, deleteNota } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY);
    setShowForm(true);
  };

  const openEdit = (nota) => {
    setEditing(nota.id_nota);
    setForm({ titulo: nota.titulo, descripcion: nota.descripcion });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.titulo.trim()) return;
    if (editing !== null) {
      updateNota(editing, form);
    } else {
      addNota(form);
    }
    setShowForm(false);
  };

  // Pastel note colors cycling
  const colors = [
    "bg-yellow-50 border-yellow-200",
    "bg-pink-50 border-pink-200",
    "bg-sky-50 border-sky-200",
    "bg-violet-50 border-violet-200",
    "bg-green-50 border-green-200",
    "bg-orange-50 border-orange-200",
  ];

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Notas</h2>
          <p className="text-sm text-gray-500">{notas.length} nota{notas.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={16} /> Nueva nota
        </button>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">
                {editing !== null ? "Editar nota" : "Nueva nota"}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Título</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  placeholder="Título de la nota"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Descripción</label>
                <textarea
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                  rows={5}
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  placeholder="Escribe tu nota aquí..."
                />
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 border border-gray-200 text-gray-600 text-sm font-medium py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
              >
                <Check size={15} />
                {editing !== null ? "Guardar" : "Agregar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      {notas.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <StickyNote size={40} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">No hay notas. ¡Escribe algo!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {notas.map((n, i) => (
            <div
              key={n.id_nota}
              className={`border rounded-xl p-4 flex flex-col justify-between ${colors[i % colors.length]}`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-gray-900 text-sm leading-tight">{n.titulo}</h3>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => openEdit(n)}
                      className="p-1 text-gray-400 hover:text-indigo-600 hover:bg-white/60 rounded-lg transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => deleteNota(n.id_nota)}
                      className="p-1 text-gray-400 hover:text-red-500 hover:bg-white/60 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                {n.descripcion && (
                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-5">{n.descripcion}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
