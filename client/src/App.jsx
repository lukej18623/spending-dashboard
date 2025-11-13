import { useState } from 'react';
import Customers from './Customers';
import Jobs from './Jobs';
import Invoices from './Invoices';
import './index.css';

function App() {
  const [tab, setTab] = useState('customers');

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px' }}>Service Business Manager</h1>

      <div style={{ marginBottom: '20px', borderBottom: '2px solid #eee' }}>
        <button
          onClick={() => setTab('customers')}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            background: tab === 'customers' ? '#007bff' : '#f8f9fa',
            color: tab === 'customers' ? 'white' : 'black',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '4px 4px 0 0'
          }}
        >
          Customers
        </button>
        <button
          onClick={() => setTab('jobs')}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            background: tab === 'jobs' ? '#007bff' : '#f8f9fa',
            color: tab === 'jobs' ? 'white' : 'black',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '4px 4px 0 0'
          }}
        >
          Jobs
        </button>
        <button
          onClick={() => setTab('invoices')}
          style={{
            padding: '10px 20px',
            background: tab === 'invoices' ? '#007bff' : '#f8f9fa',
            color: tab === 'invoices' ? 'white' : 'black',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '4px 4px 0 0'
          }}
        >
          Invoices
        </button>
      </div>

      {tab === 'customers' && <Customers />}
      {tab === 'jobs' && <Jobs />}
      {tab === 'invoices' && <Invoices />}
    </div>
  );
}

export default App;
