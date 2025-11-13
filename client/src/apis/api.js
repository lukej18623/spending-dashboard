const API_BASE = 'http://localhost:5001';

export const customerApi = {
  getAll: () => fetch(`${API_BASE}/customers`).then(r => r.json()),
  create: (data) => fetch(`${API_BASE}/customers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  update: (id, data) => fetch(`${API_BASE}/customers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  delete: (id) => fetch(`${API_BASE}/customers/${id}`, { method: 'DELETE' }).then(r => r.json())
};

export const jobApi = {
  getAll: () => fetch(`${API_BASE}/jobs`).then(r => r.json()),
  create: (data) => fetch(`${API_BASE}/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  update: (id, data) => fetch(`${API_BASE}/jobs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  delete: (id) => fetch(`${API_BASE}/jobs/${id}`, { method: 'DELETE' }).then(r => r.json())
};

export const invoiceApi = {
  getAll: () => fetch(`${API_BASE}/invoices`).then(r => r.json()),
  getById: (id) => fetch(`${API_BASE}/invoices/${id}`).then(r => r.json()),
  create: (data) => fetch(`${API_BASE}/invoices`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  updateStatus: (id, status) => fetch(`${API_BASE}/invoices/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  }).then(r => r.json())
};
