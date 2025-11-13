import { useState, useEffect } from 'react';
import { jobApi, customerApi } from './apis/api';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ customerId: '', serviceType: '', description: '', date: '', status: 'Scheduled', price: '' });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    loadJobs();
    loadCustomers();
  }, []);

  const loadJobs = async () => {
    const data = await jobApi.getAll();
    setJobs(data);
  };

  const loadCustomers = async () => {
    const data = await customerApi.getAll();
    setCustomers(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const jobData = { ...form, customerId: parseInt(form.customerId), price: parseFloat(form.price) };
    if (editing) {
      await jobApi.update(editing, jobData);
      setEditing(null);
    } else {
      await jobApi.create(jobData);
    }
    setForm({ customerId: '', serviceType: '', description: '', date: '', status: 'Scheduled', price: '' });
    loadJobs();
  };

  const handleEdit = (job) => {
    setForm({ customerId: job.customerId, serviceType: job.serviceType, description: job.description,
              date: job.date.split('T')[0], status: job.status, price: job.price });
    setEditing(job.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this job?')) {
      await jobApi.delete(id);
      loadJobs();
    }
  };

  const getCustomerName = (customerId) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.name : 'Unknown';
  };

  return (
    <div>
      <h2>Job Management</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <select value={form.customerId} onChange={(e) => setForm({...form, customerId: e.target.value})} required
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}>
            <option value="">Select Customer</option>
            {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input placeholder="Service Type" value={form.serviceType} onChange={(e) => setForm({...form, serviceType: e.target.value})} required
                 style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
          <input placeholder="Description" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} required
                 style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
          <input type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} required
                 style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
          <select value={form.status} onChange={(e) => setForm({...form, status: e.target.value})} required
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}>
            <option value="Scheduled">Scheduled</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <input type="number" step="0.01" placeholder="Price" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} required
                 style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
          <button type="submit" style={{ padding: '8px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', gridColumn: 'span 2' }}>
            {editing ? 'Update' : 'Add'} Job
          </button>
        </div>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f8f9fa', textAlign: 'left' }}>
            <th style={{ padding: '10px', borderBottom: '2px solid #dee2e6' }}>Customer</th>
            <th style={{ padding: '10px', borderBottom: '2px solid #dee2e6' }}>Service</th>
            <th style={{ padding: '10px', borderBottom: '2px solid #dee2e6' }}>Date</th>
            <th style={{ padding: '10px', borderBottom: '2px solid #dee2e6' }}>Status</th>
            <th style={{ padding: '10px', borderBottom: '2px solid #dee2e6' }}>Price</th>
            <th style={{ padding: '10px', borderBottom: '2px solid #dee2e6' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((j) => (
            <tr key={j.id}>
              <td style={{ padding: '10px', borderBottom: '1px solid #dee2e6' }}>{getCustomerName(j.customerId)}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #dee2e6' }}>{j.serviceType}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #dee2e6' }}>{new Date(j.date).toLocaleDateString()}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #dee2e6' }}>{j.status}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #dee2e6' }}>${j.price.toFixed(2)}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #dee2e6' }}>
                <button onClick={() => handleEdit(j)} style={{ marginRight: '5px', padding: '5px 10px', background: '#ffc107', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
                <button onClick={() => handleDelete(j.id)} style={{ padding: '5px 10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
