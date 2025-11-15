export default function AboutUs() {
  return (
    <div>
      <div style={{
        background: 'linear-gradient(135deg, #1e5631 0%, #0f2818 100%)',
        padding: '40px 30px',
        borderRadius: '4px',
        marginBottom: '40px',
        color: '#d4a574',
        boxShadow: '0 15px 40px rgba(0,0,0,0.5)',
        textAlign: 'center',
        borderTop: '4px solid #e67e22'
      }}>
        <h2 style={{
          margin: '0 0 10px 0',
          fontSize: '38px',
          fontWeight: 'bold',
          textShadow: '0 2px 10px rgba(0,0,0,0.5)',
          letterSpacing: '2px'
        }}>
          ABOUT STURGEON EXCURSIONS
        </h2>
        <p style={{ fontSize: '18px', margin: 0, opacity: 0.9, color: '#ccc' }}>
          Serious fishing. Serious conservation.
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
          OUR STORY
        </h3>
        <p style={{ color: '#ccc', lineHeight: '1.8', fontSize: '16px', marginBottom: 0 }}>
          Founded by hardcore anglers who live and breathe the water, Sturgeon Excursions was born
          from a deep respect for these ancient fish and the wild waters they inhabit.
          For over a decade, we've been taking serious fishermen out to land trophy sturgeon.
          No gimmicks. Just raw fishing experience.
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
          OUR MISSION
        </h3>
        <p style={{ color: '#ccc', lineHeight: '1.8', fontSize: '16px', marginBottom: 0 }}>
          We believe in sustainable fishing and protecting the resource. Our mission
          is to provide authentic, hard-core fishing experiences while preserving sturgeon populations
          for our kids and grandkids. We practice strict catch-and-release and work with
          local conservation agencies to keep these waters pristine.
        </p>
      </div>

      <div style={{
        marginBottom: '30px',
        padding: '30px',
        background: '#1a1a1a',
        borderRadius: '4px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        border: '1px solid #3a3a3a',
        borderLeft: '5px solid #d4a574'
      }}>
        <h3 style={{ marginTop: 0, color: '#d4a574', fontSize: '24px', fontWeight: 'bold', letterSpacing: '1px' }}>
          MEET THE CREW
        </h3>
        <p style={{ color: '#ccc', lineHeight: '1.8', fontSize: '16px', marginBottom: 0 }}>
          Our guides have decades of combined experience battling big fish. They're not just
          skilled fishermen—they're seasoned outdoorsmen who know every inch of these waters.
          Each guide is fully licensed, CPR certified, and committed to getting you on fish
          while keeping you safe.
        </p>
      </div>

      <div style={{
        padding: '30px',
        background: '#1a1a1a',
        borderRadius: '4px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        border: '1px solid #3a3a3a',
        borderLeft: '5px solid #2d6a4f'
      }}>
        <h3 style={{ marginTop: 0, color: '#d4a574', fontSize: '24px', fontWeight: 'bold', letterSpacing: '1px' }}>
          WHAT MAKES US DIFFERENT
        </h3>
        <ul style={{
          lineHeight: '2',
          color: '#ccc',
          fontSize: '16px',
          paddingLeft: '20px',
          marginBottom: 0
        }}>
          <li style={{ marginBottom: '10px' }}>
            <strong style={{ color: '#e67e22' }}>Small Groups:</strong> Maximum attention, no crowds
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong style={{ color: '#e67e22' }}>Conservation:</strong> Respect the resource, fish for tomorrow
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong style={{ color: '#e67e22' }}>Real Knowledge:</strong> Learn from guys who've been doing this for decades
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong style={{ color: '#e67e22' }}>Flexible:</strong> We work around your schedule
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong style={{ color: '#e67e22' }}>All Ages:</strong> Bring your son, teach him to fish right
          </li>
          <li style={{ marginBottom: 0 }}>
            <strong style={{ color: '#e67e22' }}>Pro Gear:</strong> All equipment and safety gear included
          </li>
        </ul>
      </div>
    </div>
  );
}