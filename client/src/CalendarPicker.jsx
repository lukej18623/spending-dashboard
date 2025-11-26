import React, { useState, useEffect, useCallback } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { getAvailability } from './apis/api';

const CalendarPicker = ({ excursionId, onDateSelect }) => {
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAvailability = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAvailability(excursionId);
      // Convert date strings to Date objects
      const dates = data.map(item => new Date(item.availableDate));
      setAvailableDates(dates);
    } catch (error) {
      console.error('Error loading availability:', error);
    } finally {
      setLoading(false);
    }
  }, [excursionId]);

  useEffect(() => {
    if (excursionId) {
      loadAvailability();
    }
  }, [excursionId, loadAvailability]);

  const isDateAvailable = (date) => {
    return availableDates.some(availDate => 
      availDate.toDateString() === date.toDateString()
    );
  };

  const handleDateClick = (date) => {
    if (isDateAvailable(date)) {
      setSelectedDate(date);
      onDateSelect(date);
    }
  };

  const tileClassName = ({ date }) => {
    if (isDateAvailable(date)) {
      return 'available-date';
    }
    return 'unavailable-date';
  };

  if (loading) return <div>Loading calendar...</div>;

  return (
    <div className="calendar-picker">
      <h3>Select a Date</h3>
      <Calendar
        onChange={handleDateClick}
        value={selectedDate}
        tileClassName={tileClassName}
        tileDisabled={({ date }) => !isDateAvailable(date)}
        minDate={new Date()}
      />
      <style>{`
        .available-date {
          background-color: #4CAF50 !important;
          color: white !important;
        }
        .unavailable-date {
          background-color: #f5f5f5 !important;
          color: #ccc !important;
        }
      `}</style>
    </div>
  );
};

export default CalendarPicker;