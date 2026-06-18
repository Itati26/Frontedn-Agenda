// api.js
// Todas las peticiones al backend PHP pasan por aquí.
// El token se guarda en localStorage y se manda en cada request.

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

function getToken() {
  return localStorage.getItem('token');
}

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error de red');
  return data;
}

// ── Auth (login / registro) ──────────────────────────────────────
export const auth = {
  login:    (correo, contrasena) =>
    request('/auth.php?action=login',    { method: 'POST', body: JSON.stringify({ correo, contrasena }) }),
  register: (correo, contrasena) =>
    request('/auth.php?action=register', { method: 'POST', body: JSON.stringify({ correo, contrasena }) }),
};

// ── Tareas ───────────────────────────────────────────────────────
export const tareasApi = {
  listar:     ()           => request('/tareas.php'),
  crear:      (data)       => request('/tareas.php',              { method: 'POST',   body: JSON.stringify(data) }),
  actualizar: (id, data)   => request(`/tareas.php?id=${id}`,    { method: 'PUT',    body: JSON.stringify(data) }),
  eliminar:   (id)         => request(`/tareas.php?id=${id}`,    { method: 'DELETE' }),
};

// ── Notas ────────────────────────────────────────────────────────
export const notasApi = {
  listar:     ()           => request('/notas.php'),
  crear:      (data)       => request('/notas.php',               { method: 'POST',   body: JSON.stringify(data) }),
  actualizar: (id, data)   => request(`/notas.php?id=${id}`,     { method: 'PUT',    body: JSON.stringify(data) }),
  eliminar:   (id)         => request(`/notas.php?id=${id}`,     { method: 'DELETE' }),
};

// ── Pagos ────────────────────────────────────────────────────────
export const pagosApi = {
  historial:  ()     => request('/pagos.php'),
  suscribir:  ()     => request('/pagos.php?action=suscribir', { method: 'POST', body: JSON.stringify({}) }),
  cancelar:   ()     => request('/pagos.php?action=cancelar',  { method: 'POST', body: JSON.stringify({}) }),
};
