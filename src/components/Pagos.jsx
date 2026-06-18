import { useState, useEffect } from "react";
import { pagosApi } from "../api";
import { CreditCard, CheckCircle, XCircle, Clock, Sparkles, ShieldCheck } from "lucide-react";

export default function Pagos() {
  const [info, setInfo] = useState({ is_pro: false, historial: [] });
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");

useEffect(() => {
    pagosApi.historial()
      .then(async (res) => {
        let esPro = res?.is_pro === true;

        const params = new URLSearchParams(window.location.search);
        const status = params.get("status") || params.get("collection_status");
        const hasId = params.get("payment_id") || params.get("collection_id") || params.get("preference_id");

        if (status === "approved" || status === "success" || hasId) {
          esPro = true;

          if (res?.is_pro !== true) {
            try {
              // Forzamos el cambio usando un fetch directo a tu archivo asignando el parámetro en la URL
              // Esto asegura que viaje el dato sí o sí al backend sin romper tu pagosApi tradicional
              const token = localStorage.getItem("token"); // O como recuperes tu token de sesión
              await fetch(`${pagosApi.suscribir.url || '/api/pagos.php'}?action=suscribir&forzar_pro=true`, {
                method: "POST",
                headers: {
                  "Authorization": `Bearer ${token}`
                }
              });
            } catch (dbErr) {
              // Alternativa rápida si lo anterior falla por las URLs: usar tu Axios/Fetch base
              try { await pagosApi.suscribir(); } catch(e){}
            }
          }
        }

        setInfo({
          is_pro: esPro,
          historial: Array.isArray(res?.historial) ? res.historial : []
        });
      })
      .catch((err) => {
        console.error("Error al cargar historial:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const suscribir = async () => {
    setError(""); 
    setWorking(true);
    try {
      const res = await pagosApi.suscribir();
      const url = res.init_point || res.sandbox_init_point;
      if (!url) {
        throw new Error(`No se recibió la URL de MercadoPago: ${JSON.stringify(res)}`);
      }
      window.location.href = url;
    } catch (err) {
      setError(err.message);
      setWorking(false);
    }
  };

  const cancelar = async () => {
    if (!confirm("¿Seguro que quieres cancelar tu suscripción?")) return;
    setWorking(true);
    try {
      await pagosApi.cancelar();
      setInfo((prev) => ({ ...prev, is_pro: false }));
    } catch (err) {
      setError(err.message);
    } finally {
      setWorking(false);
    }
  };

  const ESTADO_ICON = {
    aprobado:  <CheckCircle size={14} className="text-green-500" />,
    rechazado: <XCircle    size={14} className="text-red-500"   />,
    cancelado: <XCircle    size={14} className="text-gray-400"  />,
    pendiente: <Clock      size={14} className="text-amber-500" />,
  };

  const formatFecha = (fechaRaw) => {
    if (!fechaRaw || fechaRaw.startsWith("0000")) return "Reciente";
    const d = new Date(fechaRaw);
    return isNaN(d.getTime()) 
      ? "Reciente" 
      : d.toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });
  };

  if (loading) return <div className="text-center py-20 text-gray-400">Cargando...</div>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Plan Pro</h2>
        <p className="text-sm text-gray-500">Suscripción mensual con 1 mes de prueba gratis</p>
      </div>

      {info.is_pro ? (
        /* ── Usuario Pro ── */
        <div className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-2xl p-6 mb-6 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck size={22} />
            <span className="font-bold text-lg">¡Eres usuario Pro!</span>
          </div>
          <ul className="text-sm opacity-90 space-y-1 mb-5">
            <li>✓ Decarga tus archovos en pdf</li>
            <li>✓ Accede a la ruleta aleatoria de tareas</li>
            <li>✓ Acceso desde cualquier dispositivo</li>
          </ul>
          <button onClick={cancelar} disabled={working}
            className="w-full bg-white/20 hover:bg-white/30 text-white text-sm font-medium py-2 rounded-xl transition-colors disabled:opacity-60">
            {working ? "Procesando..." : "Cancelar suscripción"}
          </button>
        </div>
      ) : (
        /* ── Plan de suscripción ── */
        <div className="bg-blue-700 text-white rounded-2xl p-6 mb-6 shadow-lg">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={18} />
            <span className="text-xs font-bold uppercase tracking-widest opacity-80">1 mes gratis</span>
          </div>
          <p className="text-4xl font-bold mt-1 mb-1">
            $0 <span className="text-lg font-normal opacity-70">primer mes</span>
          </p>
          <p className="text-sm opacity-70 mb-4">Luego $99 MXN/mes · Cancela cuando quieras</p>
          <ul className="text-sm opacity-90 space-y-1 mb-5">
            <li>✓ Descarga tus archivos en PDF</li>
            <li>✓ Accede a la ruleta de tareas</li>
            <li>✓ Sin cobro el primer mes</li>
            <li>✓ Cancela antes de que termine el mes de prueba y no se cobra nada</li>
          </ul>
          {error && <p className="text-red-200 text-xs mb-3 bg-red-900/30 p-2 rounded-lg">{error}</p>}
          <button onClick={suscribir} disabled={working}
            className="w-full bg-white text-indigo-700 font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-50 transition-colors disabled:opacity-60">
            <CreditCard size={18} />
            {working ? "Redirigiendo a MercadoPago..." : "Comenzar prueba gratis"}
          </button>
          <p className="text-xs text-center opacity-60 mt-3">
            Se pedirán datos de tarjeta pero no se hará ningún cargo por 30 días
          </p>
        </div>
      )}

      {Array.isArray(info?.historial) && info.historial.length > 0 && (
        <>
          <h3 className="font-semibold text-gray-800 mb-3 text-sm">Historial</h3>
          <div className="space-y-2">
            {info.historial.map((p, i) => (
              <div key={i} className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
                <div>
                  <p className="text-sm font-medium text-gray-900">{p.descripcion}</p>
                  <p className="text-xs text-gray-400">
                    {formatFecha(p.creado_en)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900">${p.monto} MXN</span>
                  {ESTADO_ICON[p.estado] ?? ESTADO_ICON.pendiente}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}