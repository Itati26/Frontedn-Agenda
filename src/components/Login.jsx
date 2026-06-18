import { useState } from "react";
import { useApp } from "../context/AppContext";
import { LogIn, UserPlus, BookOpen } from "lucide-react";

export default function Login() {
  const { login, register } = useApp();
  const [mode, setMode]         = useState("login");
  const [correo, setCorreo]     = useState("");
  const [contrasena, setContra] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") await login(correo, contrasena);
      else await register(correo, contrasena);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-indigo-600 text-white p-3 rounded-xl mb-3">
            <BookOpen size={28} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Mi Agenda</h1>
          <p className="text-sm text-gray-500 mt-1">
            {mode === "login" ? "Inicia sesión para continuar" : "Crea tu cuenta"}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
            <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)}
              placeholder="usuario@correo.com" required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input type="password" value={contrasena} onChange={(e) => setContra(e.target.value)}
              placeholder="••••••••" required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          {error && <p className="text-red-500 text-xs bg-red-50 p-2 rounded-lg">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors">
            {mode === "login" ? <LogIn size={16} /> : <UserPlus size={16} />}
            {loading ? "Cargando..." : mode === "login" ? "Entrar" : "Registrarme"}
          </button>
        </form>
        <p className="text-center text-xs text-gray-500 mt-5">
          {mode === "login" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
          <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
            className="text-indigo-600 font-medium hover:underline">
            {mode === "login" ? "Regístrate" : "Inicia sesión"}
          </button>
        </p>
      </div>
    </div>
  );
}
