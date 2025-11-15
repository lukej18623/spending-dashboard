import { useState } from 'react';
import BookNow from './BookNow';
import AboutUs from './AboutUs';
import Home from './Home'
import './index.css';

function App() {
  const [tab, setTab] = useState('home');

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #2c3e50 0%, #34495e 100%)'
    }}>
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1
          onClick={() => setTab('home')}
          style={{
            marginBottom: '30px',
            cursor: 'pointer',
            fontSize: '42px',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #d4a574 0%, #e67e22 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textAlign: 'center',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)',
            transition: 'all 0.3s',
            letterSpacing: '1px'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          STURGEON EXCURSIONS
        </h1>

        <div style={{
          marginBottom: '30px',
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setTab('home')}
            style={{
              padding: '12px 28px',
              background: tab === 'home' ? 'linear-gradient(135deg, #1e5631 0%, #2d6a4f 100%)' : '#1a1a1a',
              color: tab === 'home' ? '#d4a574' : '#ccc',
              border: tab === 'home' ? 'none' : '2px solid #3a3a3a',
              cursor: 'pointer',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: tab === 'home' ? 'bold' : '600',
              transition: 'all 0.3s',
              boxShadow: tab === 'home' ? '0 4px 15px rgba(30, 86, 49, 0.6)' : '0 2px 8px rgba(0,0,0,0.3)',
              letterSpacing: '0.5px'
            }}
            onMouseEnter={(e) => {
              if (tab !== 'home') {
                e.target.style.borderColor = '#2d6a4f';
                e.target.style.color = '#d4a574';
              }
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = tab === 'home' ? '0 6px 20px rgba(30, 86, 49, 0.8)' : '0 4px 12px rgba(0,0,0,0.4)';
            }}
            onMouseLeave={(e) => {
              if (tab !== 'home') {
                e.target.style.borderColor = '#3a3a3a';
                e.target.style.color = '#ccc';
              }
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = tab === 'home' ? '0 4px 15px rgba(30, 86, 49, 0.6)' : '0 2px 8px rgba(0,0,0,0.3)';
            }}
          >
            HOME
          </button>
          <button
            onClick={() => setTab('bookNow')}
            style={{
              padding: '12px 28px',
              background: tab === 'bookNow' ? 'linear-gradient(135deg, #1e5631 0%, #2d6a4f 100%)' : '#1a1a1a',
              color: tab === 'bookNow' ? '#d4a574' : '#ccc',
              border: tab === 'bookNow' ? 'none' : '2px solid #3a3a3a',
              cursor: 'pointer',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: tab === 'bookNow' ? 'bold' : '600',
              transition: 'all 0.3s',
              boxShadow: tab === 'bookNow' ? '0 4px 15px rgba(30, 86, 49, 0.6)' : '0 2px 8px rgba(0,0,0,0.3)',
              letterSpacing: '0.5px'
            }}
            onMouseEnter={(e) => {
              if (tab !== 'bookNow') {
                e.target.style.borderColor = '#2d6a4f';
                e.target.style.color = '#d4a574';
              }
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = tab === 'bookNow' ? '0 6px 20px rgba(30, 86, 49, 0.8)' : '0 4px 12px rgba(0,0,0,0.4)';
            }}
            onMouseLeave={(e) => {
              if (tab !== 'bookNow') {
                e.target.style.borderColor = '#3a3a3a';
                e.target.style.color = '#ccc';
              }
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = tab === 'bookNow' ? '0 4px 15px rgba(30, 86, 49, 0.6)' : '0 2px 8px rgba(0,0,0,0.3)';
            }}
          >
            BOOK NOW
          </button>
          <button
            onClick={() => setTab('aboutUs')}
            style={{
              padding: '12px 28px',
              background: tab === 'aboutUs' ? 'linear-gradient(135deg, #1e5631 0%, #2d6a4f 100%)' : '#1a1a1a',
              color: tab === 'aboutUs' ? '#d4a574' : '#ccc',
              border: tab === 'aboutUs' ? 'none' : '2px solid #3a3a3a',
              cursor: 'pointer',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: tab === 'aboutUs' ? 'bold' : '600',
              transition: 'all 0.3s',
              boxShadow: tab === 'aboutUs' ? '0 4px 15px rgba(30, 86, 49, 0.6)' : '0 2px 8px rgba(0,0,0,0.3)',
              letterSpacing: '0.5px'
            }}
            onMouseEnter={(e) => {
              if (tab !== 'aboutUs') {
                e.target.style.borderColor = '#2d6a4f';
                e.target.style.color = '#d4a574';
              }
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = tab === 'aboutUs' ? '0 6px 20px rgba(30, 86, 49, 0.8)' : '0 4px 12px rgba(0,0,0,0.4)';
            }}
            onMouseLeave={(e) => {
              if (tab !== 'aboutUs') {
                e.target.style.borderColor = '#3a3a3a';
                e.target.style.color = '#ccc';
              }
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = tab === 'aboutUs' ? '0 4px 15px rgba(30, 86, 49, 0.6)' : '0 2px 8px rgba(0,0,0,0.3)';
            }}
          >
            ABOUT US
          </button>
        </div>

        {tab === 'bookNow' && <BookNow />}
        {tab === 'aboutUs' && <AboutUs />}
        {tab === 'home' && <Home />}
      </div>
    </div>
  );
}

export default App;
