export default function Home() {
  return (
    <div>
      <div style={{
        background: '#ffffff',
        padding: '50px 30px',
        borderRadius: '4px',
        marginBottom: '40px',
        color: '#1a5490',
        boxShadow: '0 15px 40px rgba(0,0,0,0.5)',
        textAlign: 'center',
        borderTop: '4px solid #f59e0b'
      }}>
        <h2 style={{
          margin: '0 0 15px 0',
          fontSize: '42px',
          fontWeight: 'bold',
          textShadow: '0 2px 10px rgba(0,0,0,0.1)',
          letterSpacing: '2px',
          color: '#1a5490'
        }}>
          WELCOME TO STURGEON EXCURSIONS
        </h2>
        <p style={{ fontSize: '20px', margin: 0, opacity: 0.9, maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto', color: '#333' }}>
          Real fishing. Real adventure. No nonsense.
        </p>
      </div>

      <div style={{
        marginBottom: '30px',
        padding: '30px',
        background: '#ffffff',
        borderRadius: '4px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        border: '1px solid #3a3a3a',
        borderLeft: '5px solid #2563eb'
      }}>
        <h3 style={{ marginTop: 0, color: '#1a5490', fontSize: '24px', fontWeight: 'bold', letterSpacing: '1px' }}>
          EXPERIENCE THE THRILL OF STURGEON FISHING
        </h3>
        <p style={{ color: '#333', lineHeight: '1.8', fontSize: '16px', marginBottom: 0 }}>
          Join us for an unforgettable adventure on the water. Sturgeon Excursions offers
          premium fishing trips where you'll have the chance to catch these magnificent
          prehistoric fish in their natural habitat. This is real fishing for real men.
        </p>
      </div>

      <div style={{
        marginBottom: '30px',
        padding: '30px',
        background: '#ffffff',
        borderRadius: '4px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        border: '1px solid #3a3a3a',
        borderLeft: '5px solid #f59e0b'
      }}>
        <h3 style={{ marginTop: 0, color: '#1a5490', fontSize: '24px', fontWeight: 'bold', letterSpacing: '1px' }}>
          WHY CHOOSE US
        </h3>
        <ul style={{
          lineHeight: '2',
          color: '#333',
          fontSize: '16px',
          paddingLeft: '20px',
          marginBottom: 0
        }}>
          <li style={{ marginBottom: '8px' }}>
            <strong style={{ color: '#f59e0b' }}>Expert Guides:</strong> Battle-tested professionals who know these waters
          </li>
          <li style={{ marginBottom: '8px' }}>
            <strong style={{ color: '#f59e0b' }}>Premium Equipment:</strong> Professional-grade gear that gets results
          </li>
          <li style={{ marginBottom: '8px' }}>
            <strong style={{ color: '#f59e0b' }}>Prime Territory:</strong> We fish where the big ones are
          </li>
          <li style={{ marginBottom: '8px' }}>
            <strong style={{ color: '#f59e0b' }}>Safety First:</strong> Rugged boats with commercial safety equipment
          </li>
          <li style={{ marginBottom: 0 }}>
            <strong style={{ color: '#1a5490' }}>SPECIAL OFFER:</strong> <span style={{ color: '#f59e0b' }}>First excursion 50% off for new customers!</span>
          </li>
        </ul>
      </div>

      <div style={{
        padding: '30px',
        background: '#ffffff',
        borderRadius: '4px',
        boxShadow: '0 8px 25px rgba(0,0,0,0.4)',
        color: '#1a1a1a',
        textAlign: 'center',
        border: '2px solid #f59e0b'
      }}>
        <h3 style={{ marginTop: 0, fontSize: '26px', marginBottom: '15px', fontWeight: 'bold', letterSpacing: '1px', color: '#1a5490' }}>
          READY TO BOOK?
        </h3>
        <p style={{ fontSize: '18px', marginBottom: '20px', opacity: 0.9, color: '#333' }}>
          Head over to our Book Now page to reserve your spot. Time to land a monster.
        </p>
        <div style={{
          display: 'inline-block',
          padding: '12px 24px',
          background: '#1a5490',
          color: '#ffffff',
          borderRadius: '4px',
          fontWeight: 'bold',
          fontSize: '16px',
          cursor: 'pointer',
          border: '2px solid #1a5490'
        }}>
          GET STARTED TODAY
        </div>
      </div>
    </div>
  );
}