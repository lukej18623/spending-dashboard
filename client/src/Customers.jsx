import { useState, useEffect } from 'react';
import { customerApi } from './apis/api';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', industry: '' });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    const data = await customerApi.getAll();
    setCustomers(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await customerApi.update(editing, form);
      setEditing(null);
    } else {
      await customerApi.create(form);
    }
    setForm({ name: '', phone: '', email: '', address: '', industry: '' });
    loadCustomers();
  };

  const handleEdit = (customer) => {
    setForm({ name: customer.name, phone: customer.phone, email: customer.email,
              address: customer.address, industry: customer.industry });
    setEditing(customer.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this customer?')) {
      await customerApi.delete(id);
      loadCustomers();
    }
  };

  return (
    <div>
      <h2>Customer Management</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <input placeholder="Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required
                 style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
          <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} required
                 style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
          <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required
                 style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
          <input placeholder="Address" value={form.address} onChange={(e) => setForm({...form, address: e.target.value})} required
                 style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
          <select value={form.industry} onChange={(e) => setForm({...form, industry: e.target.value})} required
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}>
            <option value="">Select Industry</option>
            <option value="Lawn Care">Lawn Care</option>
            <option value="Plumbing">Plumbing</option>
            <option value="HVAC">HVAC</option>
            <option value="Electrical">Electrical</option>
            <option value="Other">Other</option>
          </select>
          <button type="submit" style={{ padding: '8px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            {editing ? 'Update' : 'Add'} Customer
          </button>
        </div>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f8f9fa', textAlign: 'left' }}>
            <th style={{ padding: '10px', borderBottom: '2px solid #dee2e6' }}>Name</th>
            <th style={{ padding: '10px', borderBottom: '2px solid #dee2e6' }}>Phone</th>
            <th style={{ padding: '10px', borderBottom: '2px solid #dee2e6' }}>Email</th>
            <th style={{ padding: '10px', borderBottom: '2px solid #dee2e6' }}>Industry</th>
            <th style={{ padding: '10px', borderBottom: '2px solid #dee2e6' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id}>
              <td style={{ padding: '10px', borderBottom: '1px solid #dee2e6' }}>{c.name}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #dee2e6' }}>{c.phone}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #dee2e6' }}>{c.email}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #dee2e6' }}>{c.industry}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #dee2e6' }}>
                <button onClick={() => handleEdit(c)} style={{ marginRight: '5px', padding: '5px 10px', background: '#ffc107', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
                <button onClick={() => handleDelete(c.id)} style={{ padding: '5px 10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
