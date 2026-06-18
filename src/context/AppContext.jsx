import { createContext, useContext, useState, useEffect } from "react";
import { auth, tareasApi, notasApi } from "../api";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    return stored && token ? JSON.parse(stored) : null;
  });
  const [isPro, setIsPro]     = useState(() => localStorage.getItem('is_pro') === 'true');
  const [page, setPage]       = useState("tareas");
  const [tareas, setTareas]   = useState([]);
  const [notas, setNotas]     = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

useEffect(() => {
    if (!user) return;
    setLoading(true);
    Promise.all([tareasApi.listar(), notasApi.listar()])
      .then(([t, n]) => { 
        // 🔥 VALIDACIÓN DE SEGURIDAD: Si la API no manda un array, guardamos una lista vacía []
        setTareas(Array.isArray(t) ? t : []); 
        setNotas(Array.isArray(n) ? n : []); 
      })
      .catch((e) => {
        const msg = e.message.toLowerCase();
        if (msg.includes("sesion") || msg.includes("no has iniciado") || msg.includes("token") || msg.includes("autoriz")) {
          logout();
          return;
        }
        setError(e.message);
      })
      .finally(() => setLoading(false));
  }, [user]);

  const login = async (correo, contrasena) => {
    const data = await auth.login(correo, contrasena);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({ id_login: data.id_login, correo: data.correo }));
    localStorage.setItem('is_pro', data.is_pro ? 'true' : 'false');
    setUser({ id_login: data.id_login, correo: data.correo });
    setIsPro(!!data.is_pro);
    setPage("tareas");
  };

  const register = async (correo, contrasena) => {
    const data = await auth.register(correo, contrasena);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({ id_login: data.id_login, correo: data.correo }));
    localStorage.setItem('is_pro', 'false');
    setUser({ id_login: data.id_login, correo: data.correo });
    setIsPro(false);
    setPage("tareas");
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('is_pro');
    setUser(null); setTareas([]); setNotas([]); setIsPro(false);
  };

  const addTarea = async (tarea) => {
    const res = await tareasApi.crear(tarea);
    setTareas((prev) => [...prev, { ...tarea, id_tarea: res.id_tarea }]);
  };
  const updateTarea = async (id, changes) => {
    await tareasApi.actualizar(id, changes);
    setTareas((prev) => prev.map((t) => (t.id_tarea === id ? { ...t, ...changes } : t)));
  };
  const deleteTarea = async (id) => {
    await tareasApi.eliminar(id);
    setTareas((prev) => prev.filter((t) => t.id_tarea !== id));
  };

  const addNota = async (nota) => {
    const res = await notasApi.crear(nota);
    setNotas((prev) => [{ ...nota, id_nota: res.id_nota }, ...prev]);
  };
  const updateNota = async (id, changes) => {
    await notasApi.actualizar(id, changes);
    setNotas((prev) => prev.map((n) => (n.id_nota === id ? { ...n, ...changes } : n)));
  };
  const deleteNota = async (id) => {
    await notasApi.eliminar(id);
    setNotas((prev) => prev.filter((n) => n.id_nota !== id));
  };

  

  return (
    <AppContext.Provider value={{
      user, isPro, setIsPro, page, setPage, loading, error,
      login, register, logout,
      tareas, addTarea, updateTarea, deleteTarea,
      notas, addNota, updateNota, deleteNota,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);