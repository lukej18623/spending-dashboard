export default function Home() {
  return (
    <div>
      <div style={{
        background: 'linear-gradient(135deg, #1e5631 0%, #0f2818 100%)',
        padding: '50px 30px',
        borderRadius: '4px',
        marginBottom: '40px',
        color: '#d4a574',
        boxShadow: '0 15px 40px rgba(0,0,0,0.5)',
        textAlign: 'center',
        borderTop: '4px solid #e67e22'
      }}>
        <h2 style={{
          margin: '0 0 15px 0',
          fontSize: '42px',
          fontWeight: 'bold',
          textShadow: '0 2px 10px rgba(0,0,0,0.5)',
          letterSpacing: '2px'
        }}>
          WELCOME TO STURGEON EXCURSIONS
        </h2>
        <p style={{ fontSize: '20px', margin: 0, opacity: 0.9, maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto', color: '#ccc' }}>
          Real fishing. Real adventure. No nonsense.
        </p>
      </div>

      <div style={{
        marginBottom: '30px',
        padding: '30px',
        background: '#1a1a1a',
        borderRadius: '4px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        border: '1px solid #3a3a3a',
        borderLeft: '5px solid #2d6a4f'
      }}>
        <h3 style={{ marginTop: 0, color: '#d4a574', fontSize: '24px', fontWeight: 'bold', letterSpacing: '1px' }}>
          EXPERIENCE THE THRILL OF STURGEON FISHING
        </h3>
        <p style={{ color: '#ccc', lineHeight: '1.8', fontSize: '16px', marginBottom: 0 }}>
          Join us for an unforgettable adventure on the water. Sturgeon Excursions offers
          premium fishing trips where you'll have the chance to catch these magnificent
          prehistoric fish in their natural habitat. This is real fishing for real men.
        </p>
      </div>

      <div style={{
        marginBottom: '30px',
        padding: '30px',
        background: '#1a1a1a',
        borderRadius: '4px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        border: '1px solid #3a3a3a',
        borderLeft: '5px solid #e67e22'
      }}>
        <h3 style={{ marginTop: 0, color: '#d4a574', fontSize: '24px', fontWeight: 'bold', letterSpacing: '1px' }}>
          WHY CHOOSE US
        </h3>
        <ul style={{
          lineHeight: '2',
          color: '#ccc',
          fontSize: '16px',
          paddingLeft: '20px',
          marginBottom: 0
        }}>
          <li style={{ marginBottom: '8px' }}>
            <strong style={{ color: '#e67e22' }}>Expert Guides:</strong> Battle-tested professionals who know these waters
          </li>
          <li style={{ marginBottom: '8px' }}>
            <strong style={{ color: '#e67e22' }}>Premium Equipment:</strong> Professional-grade gear that gets results
          </li>
          <li style={{ marginBottom: '8px' }}>
            <strong style={{ color: '#e67e22' }}>Prime Territory:</strong> We fish where the big ones are
          </li>
          <li style={{ marginBottom: '8px' }}>
            <strong style={{ color: '#e67e22' }}>Safety First:</strong> Rugged boats with commercial safety equipment
          </li>
          <li style={{
            marginBottom: 0,
            background: 'linear-gradient(135deg, #0f2818 0%, #1e5631 100%)',
            padding: '10px',
            borderRadius: '4px',
            marginLeft: '-10px',
            marginTop: '10px',
            border: '1px solid #2d6a4f'
          }}>
            <strong style={{ color: '#e67e22' }}>SPECIAL OFFER:</strong> <span style={{ color: '#d4a574' }}>First excursion 50% off for new customers!</span>
          </li>
        </ul>
      </div>

      <div style={{
        padding: '30px',
        background: 'linear-gradient(135deg, #e67e22 0%, #d35400 100%)',
        borderRadius: '4px',
        boxShadow: '0 8px 25px rgba(0,0,0,0.4)',
        color: '#1a1a1a',
        textAlign: 'center',
        border: '2px solid #d4a574'
      }}>
        <h3 style={{ marginTop: 0, fontSize: '26px', marginBottom: '15px', fontWeight: 'bold', letterSpacing: '1px' }}>
          READY TO BOOK?
        </h3>
        <p style={{ fontSize: '18px', marginBottom: '20px', opacity: 0.9 }}>
          Head over to our Book Now page to reserve your spot. Time to land a monster.
        </p>
        <div style={{
          display: 'inline-block',
          padding: '12px 24px',
          background: '#1a1a1a',
          color: '#d4a574',
          borderRadius: '4px',
          fontWeight: 'bold',
          fontSize: '16px',
          cursor: 'pointer',
          border: '2px solid #1a1a1a'
        }}>
          GET STARTED TODAY
        </div>
      </div>
    </div>
  );
}