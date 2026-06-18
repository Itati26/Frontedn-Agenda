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

  const downloadFile = (url) => {
    if (!url) {
      alert("No hay archivo adjunto.");
      return;
    }

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Tareas</h2>
          <p className="text-sm text-gray-500">
            {tareas.length} registrada(s)
          </p>
        </div>

        <button
          onClick={openNew}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={16} />
          Nueva tarea
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="font-bold text-gray-900 mb-4">
              {editing !== null ? "Editar tarea" : "Nueva tarea"}
            </h3>

            <div className="space-y-3">
              <input
                className="w-full border p-2 rounded-lg text-sm"
                placeholder="Nombre"
                value={form.nombre_tarea}
                onChange={(e) =>
                  setForm({ ...form, nombre_tarea: e.target.value })
                }
              />

              <input
                type="date"
                className="w-full border p-2 rounded-lg text-sm"
                value={form.fecha_entrega}
                onChange={(e) =>
                  setForm({ ...form, fecha_entrega: e.target.value })
                }
              />

              <textarea
                className="w-full border p-2 rounded-lg text-sm"
                rows={3}
                placeholder="Descripción"
                value={form.descripcion}
                onChange={(e) =>
                  setForm({ ...form, descripcion: e.target.value })
                }
              />

              <div
                className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-indigo-400"
                onClick={() => fileRef.current.click()}
              >
                <input
                  type="file"
                  ref={fileRef}
                  className="hidden"
                  accept=".pdf"
                  onChange={(e) =>
                    setForm({ ...form, archivo: e.target.files[0] })
                  }
                />

                <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                  <FileUp size={16} />
                  {form.archivo ? form.archivo.name : "Seleccionar PDF"}
                </p>
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 border py-2 rounded-lg"
              >
                Cancelar
              </button>

              <button
                onClick={handleSave}
                className="flex-1 bg-indigo-600 text-white py-2 rounded-lg"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {tareas.map((t) => (
          <div
            key={t.id_tarea}
            className="bg-white border rounded-xl p-4 flex items-center justify-between"
          >
            <div>
              <p className="font-semibold">{t.nombre_tarea}</p>
              <p className="text-xs text-gray-400">{t.fecha_entrega}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() =>
                  isPro
                    ? downloadFile(t.archivo_pdf)
                    : setPage("pagos")
                }
                className={`p-2 rounded-lg ${
                  isPro
                    ? "text-violet-600 hover:bg-violet-50"
                    : "text-amber-500 hover:bg-amber-50"
                }`}
              >
                {isPro ? <Download size={18} /> : <Sparkles size={18} />}
              </button>

              <button
                onClick={() => openEdit(t)}
                className="p-2 text-indigo-600"
              >
                <Pencil size={18} />
              </button>

              <button
                onClick={() => deleteTarea(t.id_tarea)}
                className="p-2 text-red-500"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}