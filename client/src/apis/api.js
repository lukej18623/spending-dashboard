const API_BASE_URL = 'http://localhost:5001';

// Excursion endpoints
export const getExcursions = async () => {
  const response = await fetch(`${API_BASE_URL}/excursions`);
  if (!response.ok) throw new Error('Failed to fetch excursions');
  return response.json();
};

export const getExcursion = async (id) => {
  const response = await fetch(`${API_BASE_URL}/excursions/${id}`);
  if (!response.ok) throw new Error('Failed to fetch excursion');
  return response.json();
};

export const getAvailability = async (excursionId, days = 90) => {
  const response = await fetch(`${API_BASE_URL}/excursions/${excursionId}/availability?days=${days}`);
  if (!response.ok) throw new Error('Failed to fetch availability');
  return response.json();
};

// Booking endpoints
export const createBooking = async (bookingData) => {
  const response = await fetch(`${API_BASE_URL}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData)
  });
  if (!response.ok) throw new Error('Failed to create booking');
  return response.json();
};