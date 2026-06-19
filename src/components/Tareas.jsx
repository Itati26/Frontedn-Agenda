import { useState, useRef } from "react";
import { useApp } from "../context/AppContext";
import { Plus, Pencil, Trash2, Download, Sparkles, FileUp } from "lucide-react";

const EMPTY = {
  nombre_tarea: "",
  fecha_entrega: "",
  descripcion: "",
  status: "P",
  archivo: null,
};

export default function Tareas() {
  const { tareas, addTarea, updateTarea, deleteTarea, isPro, setPage } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const fileRef = useRef(null);

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY);
    setShowForm(true);
  };

  const openEdit = (t) => {
    setEditing(t.id_tarea);
    setForm({
      nombre_tarea: t.nombre_tarea,
      fecha_entrega: t.fecha_entrega,
      descripcion: t.descripcion,
      status: t.status,
      archivo: null,
    });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.nombre_tarea.trim()) return;

    const formData = new FormData();
    formData.append("nombre_tarea", form.nombre_tarea);
    formData.append("fecha_entrega", form.fecha_entrega);
    formData.append("descripcion", form.descripcion);
    formData.append("status", form.status);

    if (form.archivo) {
      formData.append("archivo", form.archivo);
    }

    if (editing !== null) {
      updateTarea(editing, formData);
    } else {
      addTarea(formData);
    }
    setShowForm(false);
  };

  // FUNCIÓN CORREGIDA Y SEGURA
  const handleDownload = (id) => {
    if (!isPro) {
      setPage("pagos");
      return;
    }
    
    // Redirigimos al endpoint de descarga en tu servidor (Railway)
    // El backend verificará si es usuario PRO antes de enviar el archivo
    const downloadUrl = `https://back-agenda-production.up.railway.app/descargar.php?id=${id}`;
    window.open(downloadUrl, '_blank');
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Tareas</h2>
          <p className="text-sm text-gray-500">{tareas.length} registrada(s)</p>
        </div>

        <button
          onClick={openNew}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={16} />
          Nueva tarea
        </button>
      </div>

      {/* Aquí iría tu modal de formulario (ya está correcto) */}
      {/* ... (código del modal omitido para brevedad) ... */}

      <div className="space-y-3">
        {tareas.map((t) => (
          <div key={t.id_tarea} className="bg-white border rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold">{t.nombre_tarea}</p>
              <p className="text-xs text-gray-400">{t.fecha_entrega}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleDownload(t.id_tarea)}
                title={isPro ? "Descargar PDF" : "Función Pro: Suscríbete para descargar"}
                className={`p-2 rounded-lg ${
                  isPro ? "text-violet-600 hover:bg-violet-50" : "text-amber-500 hover:bg-amber-50"
                }`}
              >
                {isPro ? <Download size={18} /> : <Sparkles size={18} />}
              </button>

              <button onClick={() => openEdit(t)} className="p-2 text-indigo-600">
                <Pencil size={18} />
              </button>

              <button onClick={() => deleteTarea(t.id_tarea)} className="p-2 text-red-500">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}