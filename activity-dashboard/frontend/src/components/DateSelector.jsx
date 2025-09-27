import { formatDate } from '../utils/dateUtils';

export default function DateSelector({ selectedDate, onDateChange }) {
  const today = new Date();
  const maxDate = formatDate(today);

  // Set default to sample data date if no date selected
  const defaultDate = selectedDate || '2025-08-10';

  return (
    <div className="date-selector">
      <label htmlFor="date-input">Select Date:</label>
      <input
        id="date-input"
        type="date"
        value={defaultDate}
        max={maxDate}
        onChange={(e) => onDateChange(e.target.value)}
      />
    </div>
  );
}