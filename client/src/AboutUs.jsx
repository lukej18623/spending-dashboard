export default function AboutUs() {
  return (
    <div>
      <div style={{
        background: '#ffffff',
        padding: '40px 30px',
        borderRadius: '4px',
        marginBottom: '40px',
        color: '#1a5490',
        boxShadow: '0 15px 40px rgba(0,0,0,0.5)',
        textAlign: 'center',
        borderTop: '4px solid #f59e0b'
      }}>
        <h2 style={{
          margin: '0 0 10px 0',
          fontSize: '38px',
          fontWeight: 'bold',
          textShadow: '0 2px 10px rgba(0,0,0,0.1)',
          letterSpacing: '2px',
          color: '#1a5490'
        }}>
          ABOUT STURGEON EXCURSIONS
        </h2>
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
          OUR STORY
        </h3>
        <p style={{ color: '#333', lineHeight: '1.8', fontSize: '16px', marginBottom: 0 }}>
          Founded by hardcore anglers who live and breathe the water, Sturgeon Excursions was born
          from a deep respect for these ancient fish and the wild waters they inhabit.
          For over a decade, we've been taking serious fishermen out to land trophy sturgeon.
          No gimmicks. Just raw fishing experience.
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
          OUR MISSION
        </h3>
        <p style={{ color: '#333', lineHeight: '1.8', fontSize: '16px', marginBottom: 0 }}>
          We believe in sustainable fishing and protecting the resource. Our mission
          is to provide authentic, hard-core fishing experiences while preserving sturgeon populations
          for our kids and grandkids. We practice strict catch-and-release and work with
          local conservation agencies to keep these waters pristine.
        </p>
      </div>

      <div style={{
        marginBottom: '30px',
        padding: '30px',
        background: '#ffffff',
        borderRadius: '4px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        border: '1px solid #3a3a3a',
        borderLeft: '5px solid #fcd34d'
      }}>
        <h3 style={{ marginTop: 0, color: '#1a5490', fontSize: '24px', fontWeight: 'bold', letterSpacing: '1px' }}>
          MEET THE CREW
        </h3>
        <p style={{ color: '#333', lineHeight: '1.8', fontSize: '16px', marginBottom: 0 }}>
          Our guides have decades of combined experience battling big fish. They're not just
          skilled fishermen—they're seasoned outdoorsmen who know every inch of these waters.
          Each guide is fully licensed, CPR certified, and committed to getting you on fish
          while keeping you safe.
        </p>
      </div>

      <div style={{
        padding: '30px',
        background: '#ffffff',
        borderRadius: '4px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        border: '1px solid #3a3a3a',
        borderLeft: '5px solid #2563eb'
      }}>
        <h3 style={{ marginTop: 0, color: '#1a5490', fontSize: '24px', fontWeight: 'bold', letterSpacing: '1px' }}>
          WHAT MAKES US DIFFERENT
        </h3>
        <ul style={{
          lineHeight: '2',
          color: '#333',
          fontSize: '16px',
          paddingLeft: '20px',
          marginBottom: 0
        }}>
          <li style={{ marginBottom: '10px' }}>
            <strong style={{ color: '#f59e0b' }}>Small Groups:</strong> Maximum attention, no crowds
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong style={{ color: '#f59e0b' }}>Conservation:</strong> Respect the resource, fish for tomorrow
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong style={{ color: '#f59e0b' }}>Real Knowledge:</strong> Learn from guys who've been doing this for decades
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong style={{ color: '#f59e0b' }}>Flexible:</strong> We work around your schedule
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong style={{ color: '#f59e0b' }}>All Ages:</strong> Bring your son, teach him to fish right
          </li>
          <li style={{ marginBottom: 0 }}>
            <strong style={{ color: '#f59e0b' }}>Pro Gear:</strong> All equipment and safety gear included
          </li>
        </ul>
      </div>
    </div>
  );
}