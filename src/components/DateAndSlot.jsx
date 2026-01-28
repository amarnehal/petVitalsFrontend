import React, { useEffect, useState } from 'react';
import DatePicker from "react-multi-date-picker";
import Select from 'react-select'; // Make sure this is imported

const TIME_SLOTS = [
  { label: "09:00 AM", value: "09:00" },
  { label: "10:00 AM", value: "10:00" },
  { label: "11:00 AM", value: "11:00" },
  { label: "12:00 PM", value: "12:00" },
  { label: "02:00 PM", value: "14:00" },
  { label: "03:00 PM", value: "15:00" },
  { label: "04:00 PM", value: "16:00" },
];

const DateAndSlot = ({ onAvailabilityChange }) => {
  const [selectedDates, setSelectedDates] = useState([]);
  const [availability, setAvailability] = useState([]);

  // Update availability when dates change
  useEffect(() => {
    const formattedDates = selectedDates.map((d) => d.format("YYYY-MM-DD"));

    // Preserve existing slot selections if date is still selected
    const newAvailability = formattedDates.map(date => {
      const existing = availability.find(item => item.date === date);
      return {
        date,
        slots: existing ? existing.slots : [],
      };
    });

    setAvailability(newAvailability);
  }, [selectedDates]);

  // Propagate availability upwards
  useEffect(() => {
    onAvailabilityChange?.(availability);
  }, [availability, onAvailabilityChange]);

  const handleSlotChange = (date, selectedOptions) => {
    const updated = availability.map(item =>
      item.date === date
        ? { ...item, slots: selectedOptions.map(option => option.value) }
        : item
    );
    setAvailability(updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Available Dates:
        </label>
        <DatePicker
          multiple
          value={selectedDates}
          onChange={setSelectedDates}
          format="YYYY-MM-DD"
          className="border border-gray-300 rounded-md shadow-sm px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{
            width: "100%",
            padding: "0.5rem 0.75rem",
            fontSize: "0.875rem",
            borderRadius: "0.375rem",
            border: "1px solid #d1d5db",
          }}
        />
      </div>

      {availability.map(({ date, slots }) => (
        <div key={date} className="border p-4 rounded-md bg-gray-50">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Select Time Slots for <span className="text-blue-600">{date}</span>:
          </label>
          <Select
            isMulti
            options={TIME_SLOTS}
            value={TIME_SLOTS.filter(opt => slots.includes(opt.value))}
            onChange={(selected) => handleSlotChange(date, selected)}
            className="mt-1"
          />
        </div>
      ))}
    </div>
  );
};

export default DateAndSlot;
