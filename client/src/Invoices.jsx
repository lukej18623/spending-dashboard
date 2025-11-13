import { useState, useEffect } from 'react';
import { invoiceApi, jobApi, customerApi } from './apis/api';

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [viewInvoice, setViewInvoice] = useState(null);

  useEffect(() => {
    loadInvoices();
    loadCustomers();
    loadJobs();
  }, []);

  const loadInvoices = async () => {
    const data = await invoiceApi.getAll();
    setInvoices(data);
  };

  const loadCustomers = async () => {
    const data = await customerApi.getAll();
    setCustomers(data);
  };

  const loadJobs = async () => {
    const data = await jobApi.getAll();
    setJobs(data.filter(j => j.status === 'Completed'));
  };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    if (selectedJobs.length === 0) {
      alert('Please select at least one job');
      return;
    }
    await invoiceApi.create({ customerId: parseInt(selectedCustomer), jobIds: selectedJobs });
    setSelectedCustomer('');
    setSelectedJobs([]);
    loadInvoices();
    loadJobs();
  };

  const handleJobToggle = (jobId) => {
    if (selectedJobs.includes(jobId)) {
      setSelectedJobs(selectedJobs.filter(id => id !== jobId));
    } else {
      setSelectedJobs([...selectedJobs, jobId]);
    }
  };

  const handleStatusChange = async (invoiceId, status) => {
    await invoiceApi.updateStatus(invoiceId, status);
    loadInvoices();
  };

  const handleViewInvoice = async (invoiceId) => {
    const data = await invoiceApi.getById(invoiceId);
    setViewInvoice(data);
  };

  const customerJobs = selectedCustomer ? jobs.filter(j => j.customerId === parseInt(selectedCustomer)) : [];

  return (
    <div>
      <h2>Invoice Management</h2>

      <form onSubmit={handleCreateInvoice} style={{ marginBottom: '20px', padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
        <h3>Create New Invoice</h3>
        <select value={selectedCustomer} onChange={(e) => { setSelectedCustomer(e.target.value); setSelectedJobs([]); }}
                style={{ padding: '8px', marginBottom: '10px', width: '100%', borderRadius: '4px', border: '1px solid #ddd' }}>
          <option value="">Select Customer</option>
          {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        {selectedCustomer && customerJobs.length > 0 && (
          <div style={{ marginTop: '10px' }}>
            <h4>Select Completed Jobs:</h4>
            {customerJobs.map(job => (
              <div key={job.id} style={{ padding: '8px', marginBottom: '5px', background: 'white', borderRadius: '4px', border: '1px solid #ddd' }}>
                <label>
                  <input type="checkbox" checked={selectedJobs.includes(job.id)} onChange={() => handleJobToggle(job.id)} style={{ marginRight: '10px' }} />
                  {job.serviceType} - {job.description} (${job.price.toFixed(2)})
                </label>
              </div>
            ))}
          </div>
        )}

        {selectedCustomer && customerJobs.length === 0 && (
          <p style={{ color: '#dc3545', marginTop: '10px' }}>No completed jobs for this customer</p>
        )}

        <button type="submit" disabled={!selectedCustomer || selectedJobs.length === 0}
                style={{ padding: '10px 20px', marginTop: '10px', background: selectedCustomer && selectedJobs.length > 0 ? '#28a745' : '#6c757d',
                        color: 'white', border: 'none', borderRadius: '4px', cursor: selectedCustomer && selectedJobs.length > 0 ? 'pointer' : 'not-allowed' }}>
          Create Invoice
        </button>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f8f9fa', textAlign: 'left' }}>
            <th style={{ padding: '10px', borderBottom: '2px solid #dee2e6' }}>Invoice #</th>
            <th style={{ padding: '10px', borderBottom: '2px solid #dee2e6' }}>Customer</th>
            <th style={{ padding: '10px', borderBottom: '2px solid #dee2e6' }}>Date</th>
            <th style={{ padding: '10px', borderBottom: '2px solid #dee2e6' }}>Total</th>
            <th style={{ padding: '10px', borderBottom: '2px solid #dee2e6' }}>Status</th>
            <th style={{ padding: '10px', borderBottom: '2px solid #dee2e6' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv.id}>
              <td style={{ padding: '10px', borderBottom: '1px solid #dee2e6' }}>#{inv.id}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #dee2e6' }}>{inv.customerName}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #dee2e6' }}>{new Date(inv.invoiceDate).toLocaleDateString()}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #dee2e6' }}>${inv.totalAmount.toFixed(2)}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #dee2e6' }}>
                <select value={inv.status} onChange={(e) => handleStatusChange(inv.id, e.target.value)}
                        style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ddd' }}>
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </td>
              <td style={{ padding: '10px', borderBottom: '1px solid #dee2e6' }}>
                <button onClick={() => handleViewInvoice(inv.id)}
                        style={{ padding: '5px 10px', background: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {viewInvoice && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '8px', maxWidth: '600px', width: '90%' }}>
            <h3>Invoice #{viewInvoice.id}</h3>
            <p><strong>Customer:</strong> {viewInvoice.customerName}</p>
            <p><strong>Date:</strong> {new Date(viewInvoice.invoiceDate).toLocaleDateString()}</p>
            <p><strong>Status:</strong> {viewInvoice.status}</p>
            <h4>Jobs:</h4>
            <ul>
              {viewInvoice.jobs.map(job => (
                <li key={job.id}>{job.serviceType} - {job.description}: ${job.price.toFixed(2)}</li>
              ))}
            </ul>
            <p style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '20px' }}>
              Total: ${viewInvoice.totalAmount.toFixed(2)}
            </p>
            <button onClick={() => setViewInvoice(null)}
                    style={{ padding: '10px 20px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
