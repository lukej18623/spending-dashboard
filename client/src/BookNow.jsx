import React, { useState, useEffect } from 'react';
import { getExcursions, createBooking } from './apis/api';
import CalendarPicker from './CalendarPicker';
import PhotoGallery from './PhotoGallery';

const BookNow = () => {
  const [step, setStep] = useState(1); // 1: Choose excursion, 2: Pick date, 3: Confirm
  const [excursions, setExcursions] = useState([]);
  const [selectedExcursion, setSelectedExcursion] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeSlot, setTimeSlot] = useState('morning');
  const [partySize, setPartySize] = useState(2);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadExcursions();
  }, []);

  const loadExcursions = async () => {
    try {
      const data = await getExcursions();
      setExcursions(data);
    } catch (err) {
      setError('Failed to load excursions');
    }
  };

  const handleExcursionSelect = (excursion) => {
    setSelectedExcursion(excursion);
    setStep(2);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // In a real app, you'd create/get customer first
      const bookingData = {
        excursionId: selectedExcursion.id,
        customerId: 1, // Hardcoded for now - you'd get this from customer creation
        bookingDate: selectedDate.toISOString().split('T')[0],
        timeSlot: timeSlot,
        partySize: partySize,
        discountAmount: null
      };

      const result = await createBooking(bookingData);
      setSuccess(true);
      console.log('Booking created:', result);
    } catch (err) {
      setError(err.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Choose Excursion
  if (step === 1) {
    return (
      <div className="book-now">
        <h1>Book Your Adventure</h1>
        <PhotoGallery />
        
        <h2 style={{ marginTop: '2rem' }}>Choose Your Excursion</h2>
        <div className="excursion-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginTop: '1rem'
        }}>
          {excursions.map(excursion => (
            <div 
              key={excursion.id}
              className="excursion-card"
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'transform 0.2s',
              }}
              onClick={() => handleExcursionSelect(excursion)}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <h3>{excursion.name}</h3>
              <p>{excursion.description}</p>
              <p><strong>Duration:</strong> {excursion.durationHours} hours</p>
              <p><strong>Price:</strong> ${excursion.basePrice}</p>
              <p><strong>Max Capacity:</strong> {excursion.maxCapacity} people</p>
              <button 
                style={{
                  marginTop: '1rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Select This Trip
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Step 2: Pick Date & Time
  if (step === 2) {
    return (
      <div className="book-now">
        <button onClick={() => setStep(1)}>← Back to Excursions</button>
        
        <h1>Book: {selectedExcursion?.name}</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
          <div>
            <CalendarPicker 
              excursionId={selectedExcursion?.id}
              onDateSelect={handleDateSelect}
            />
            
            {selectedDate && (
              <div style={{ marginTop: '2rem' }}>
                <h3>Select Time Slot</h3>
                <select 
                  value={timeSlot} 
                  onChange={(e) => setTimeSlot(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem' }}
                >
                  <option value="morning">Morning (8:00 AM)</option>
                  <option value="afternoon">Afternoon (1:00 PM)</option>
                  <option value="evening">Evening (5:00 PM)</option>
                </select>

                <h3 style={{ marginTop: '1rem' }}>Party Size</h3>
                <input
                  type="number"
                  min="1"
                  max={selectedExcursion?.maxCapacity}
                  value={partySize}
                  onChange={(e) => setPartySize(parseInt(e.target.value))}
                  style={{ width: '100%', padding: '0.5rem' }}
                />
              </div>
            )}
          </div>

          <div>
            <h3>Your Information</h3>
            <form onSubmit={handleBooking}>
              <input
                type="text"
                placeholder="Full Name"
                required
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
              />
              <input
                type="email"
                placeholder="Email"
                required
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
              />
              <input
                type="tel"
                placeholder="Phone"
                required
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
              />

              {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
              {success && <div style={{ color: 'green', marginBottom: '1rem' }}>Booking created! Check your email.</div>}

              <button
                type="submit"
                disabled={!selectedDate || loading}
                style={{
                  width: '100%',
                  padding: '1rem',
                  backgroundColor: selectedDate ? '#28a745' : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: selectedDate ? 'pointer' : 'not-allowed',
                  fontSize: '1.1rem'
                }}
              >
                {loading ? 'Processing...' : `Book Now - $${selectedExcursion?.basePrice * partySize}`}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
};

export default BookNow;