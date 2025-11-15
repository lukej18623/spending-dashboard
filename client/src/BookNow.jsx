import { useState, useEffect } from 'react';
import { customerApi } from './apis/api';

export default function BookNow() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ name: '', phone: '', email: ''});
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
    setForm({ name: '', phone: '', email: '' });
    loadCustomers();
  };

  const handleEdit = (customer) => {
    setForm({ name: customer.name, phone: customer.phone, email: customer.email });
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
      <div style={{
        background: '#ffffff',
        padding: '30px',
        borderRadius: '4px',
        marginBottom: '30px',
        color: '#1a5490',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        borderTop: '4px solid #f59e0b'
      }}>
        <h2 style={{ margin: '0 0 10px 0', fontSize: '32px', fontWeight: 'bold', letterSpacing: '1px', color: '#1a5490' }}>BOOK YOUR EXCURSION</h2>
        <p style={{ margin: 0, fontSize: '18px', opacity: 0.9, color: '#333' }}>
          First excursion 50% off for new customers!
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{
        marginBottom: '40px',
        padding: '30px',
        background: '#ffffff',
        borderRadius: '4px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        border: '1px solid #3a3a3a'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#1a5490', fontWeight: 'bold', letterSpacing: '1px' }}>
          {editing ? 'UPDATE BOOKING' : 'NEW BOOKING'}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <input
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({...form, name: e.target.value})}
            required
            style={{
              padding: '12px 16px',
              borderRadius: '4px',
              border: '2px solid #ddd',
              fontSize: '15px',
              transition: 'all 0.3s',
              outline: 'none',
              background: '#ffffff',
              color: '#333'
            }}
            onFocus={(e) => e.target.style.borderColor = '#2563eb'}
            onBlur={(e) => e.target.style.borderColor = '#ddd'}
          />
          <input
            placeholder="Phone Number"
            value={form.phone}
            onChange={(e) => setForm({...form, phone: e.target.value})}
            required
            style={{
              padding: '12px 16px',
              borderRadius: '4px',
              border: '2px solid #ddd',
              fontSize: '15px',
              transition: 'all 0.3s',
              outline: 'none',
              background: '#ffffff',
              color: '#333'
            }}
            onFocus={(e) => e.target.style.borderColor = '#2563eb'}
            onBlur={(e) => e.target.style.borderColor = '#ddd'}
          />
          <input
            placeholder="Email Address"
            type="email"
            value={form.email}
            onChange={(e) => setForm({...form, email: e.target.value})}
            required
            style={{
              padding: '12px 16px',
              borderRadius: '4px',
              border: '2px solid #ddd',
              fontSize: '15px',
              transition: 'all 0.3s',
              outline: 'none',
              background: '#ffffff',
              color: '#333'
            }}
            onFocus={(e) => e.target.style.borderColor = '#2563eb'}
            onBlur={(e) => e.target.style.borderColor = '#ddd'}
          />

          <button
            type="submit"
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #1a5490 0%, #2563eb 100%)',
              color: '#fcd34d',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              transition: 'all 0.3s',
              boxShadow: '0 4px 15px rgba(26, 84, 144, 0.6)',
              letterSpacing: '0.5px'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(26, 84, 144, 0.8)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(26, 84, 144, 0.6)';
            }}
          >
            {editing ? 'UPDATE BOOKING' : 'BOOK NOW'}
          </button>
        </div>
        {editing && (
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setForm({ name: '', phone: '', email: '' });
            }}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              background: '#3a3a3a',
              color: '#999',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Cancel Edit
          </button>
        )}
      </form>

      <div style={{
        background: '#ffffff',
        borderRadius: '4px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        overflow: 'hidden',
        border: '1px solid #3a3a3a'
      }}>
        <h3 style={{
          padding: '20px 20px 15px 20px',
          margin: 0,
          borderBottom: '2px solid #3a3a3a',
          color: '#1a5490',
          fontWeight: 'bold',
          letterSpacing: '1px'
        }}>
          YOUR BOOKINGS
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
                <th style={{ padding: '15px 20px', fontWeight: '600', color: '#1a5490', fontSize: '14px' }}>Name</th>
                <th style={{ padding: '15px 20px', fontWeight: '600', color: '#1a5490', fontSize: '14px' }}>Phone</th>
                <th style={{ padding: '15px 20px', fontWeight: '600', color: '#1a5490', fontSize: '14px' }}>Email</th>
                <th style={{ padding: '15px 20px', fontWeight: '600', color: '#1a5490', fontSize: '14px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{
                    padding: '40px 20px',
                    textAlign: 'center',
                    color: '#777',
                    fontStyle: 'italic'
                  }}>
                    No bookings yet. Get out there!
                  </td>
                </tr>
              ) : (
                customers.map((c, index) => (
                  <tr
                    key={c.id}
                    style={{
                      background: index % 2 === 0 ? '#ffffff' : '#f9f9f9',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f0f0f0'}
                    onMouseLeave={(e) => e.currentTarget.style.background = index % 2 === 0 ? '#ffffff' : '#f9f9f9'}
                  >
                    <td style={{ padding: '15px 20px', borderBottom: '1px solid #ddd', color: '#1a5490', fontWeight: '600' }}>{c.name}</td>
                    <td style={{ padding: '15px 20px', borderBottom: '1px solid #ddd', color: '#333' }}>{c.phone}</td>
                    <td style={{ padding: '15px 20px', borderBottom: '1px solid #ddd', color: '#333' }}>{c.email}</td>
                    <td style={{ padding: '15px 20px', borderBottom: '1px solid #ddd' }}>
                      <button
                        onClick={() => handleEdit(c)}
                        style={{
                          marginRight: '8px',
                          padding: '8px 16px',
                          background: '#f59e0b',
                          color: '#1a1a1a',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '600',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#d97706';
                          e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = '#f59e0b';
                          e.target.style.transform = 'scale(1)';
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        style={{
                          padding: '8px 16px',
                          background: '#8b0000',
                          color: '#ccc',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '600',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#a00000';
                          e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = '#8b0000';
                          e.target.style.transform = 'scale(1)';
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
