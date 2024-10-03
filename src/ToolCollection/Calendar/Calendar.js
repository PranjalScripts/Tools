import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import calendar styles
import './Calendar.css'; // Import custom styles

// Input Component for handling date input
const InputComponent = ({ inputDate, handleInputChange }) => {
  return (
    <div className="input-container">
      <input
        type="text"
        placeholder="dd/mm/yyyy"
        value={inputDate}
        onChange={handleInputChange}
      />
    </div>
  );
};

// Calendar Component for handling date selection
const CalendarComponent = ({ date, onChangeCalendar }) => {
  return (
    <Calendar
      onChange={onChangeCalendar}
      value={date}
    />
  );
};

// Main component that manages state
const DateSelector = () => {
  const [date, setDate] = useState(new Date());
  const [inputDate, setInputDate] = useState('');

  // Function to format date as dd/mm/yyyy
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Set today's date as default input value on initial render
  useEffect(() => {
    const today = new Date();
    setInputDate(formatDate(today));
  }, []);

  // Function to handle date change from input field
  const handleInputChange = (e) => {
    setInputDate(e.target.value);
    const parsedDate = parseDate(e.target.value);
    if (parsedDate) {
      setDate(parsedDate); // Set the calendar's date
    }
  };

  // Function to parse date in dd/mm/yyyy format
  const parseDate = (dateString) => {
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed in JavaScript Date
      const year = parseInt(parts[2], 10);
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        return new Date(year, month, day);
      }
    }
    return null;
  };

  const onChangeCalendar = (newDate) => {
    setDate(newDate);
    setInputDate(formatDate(newDate)); // Update input when selecting date from calendar
  };

  return (
    <div>
      {/* Input Component placed outside of the calendar */}
      <InputComponent inputDate={inputDate} handleInputChange={handleInputChange} />

      {/* Calendar Component placed elsewhere in the layout */}
      <div className="calendar-container">
        <CalendarComponent date={date} onChangeCalendar={onChangeCalendar} />
      </div>

      {/* Displaying selected date */}
      <p className="text-center mt-4 text1">
        <span className="font-bold">Selected Date: </span>{date.toDateString()}
      </p>
    </div>
  );
};

export default DateSelector;
