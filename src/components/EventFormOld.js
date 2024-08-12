import React, { useState } from 'react';

// Function to break down schedule hours into smaller numbers based on daily cap
const breakScheduleHours = (schedule, daily) => {
  const result = [];
  let remainingSchedule = schedule;

  while (remainingSchedule > 0) {
    const hoursToAdd = Math.min(remainingSchedule, daily);
    result.push(hoursToAdd);
    remainingSchedule -= hoursToAdd;
  }

  return result;
};

const EventForm = ({ onEventSubmit }) => {
  const [eventData, setEventData] = useState({
    title: '',
    date: '',
    time: '',
    daily: '',
    schedule: '',
  });

  // State to store the array of schedule breakdowns
  const [scheduleBreakdowns, setScheduleBreakdowns] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
   
    // Validate the form data here
    const { title, date, time, daily, schedule } = eventData;

    // Check if "daily" and "schedule" are valid numbers
    const dailyValue = parseFloat(daily);
    const scheduleValue = parseFloat(schedule);


    if (
      !isNaN(dailyValue) &&
      !isNaN(scheduleValue) &&
      dailyValue >= 0 && // Check if "daily" is not negative
      scheduleValue >= 0 && // Check if "schedule" is not negative
      dailyValue <= 24 && // Check if "daily" is not more than 24
      dailyValue <= scheduleValue // Check if "daily" is not higher than "schedule"
    ) {
      // Calculate smaller numbers based on daily cap
      const scheduleBreakdown = breakScheduleHours(scheduleValue, dailyValue);

      // All checks passed, update the eventData
      const updatedEventData = {
        title,
        date,
        time,
        daily: dailyValue,
        schedule: scheduleValue,
        scheduleBreakdown, // Add the breakdown to the eventData
      };

      // Store the schedule breakdown in the array
      setScheduleBreakdowns((prevBreakdowns) => [
        ...prevBreakdowns,
        scheduleBreakdown,
      ]);

      // Pass the updated eventData to the parent component using the callback
      onEventSubmit(updatedEventData);

      // Reset the form fields
      setEventData({
        title: '',
        date: '',
        time: '',
        daily: '',
        schedule: '',
      });
    } else {
      // Handle validation errors
      if (dailyValue < 0 || scheduleValue < 0) {
        alert('Please enter non-negative values for "daily" and "schedule".');
      } else if (dailyValue > 24) {
        alert('Please enter a value less than or equal to 24 for "daily".');
      } else if (dailyValue > scheduleValue) {
        alert('The "daily" value cannot be higher than "schedule".');
      } else {
        alert('Please enter valid numbers for "daily" and "schedule".');
      }
    }
    const userId= localStorage.getItem('userId');
    eventData.userId=userId;
    try {
      const response = await fetch('/api/add-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });
  
      if (response.ok) {
        // Handle a successful response here
        // For example, you can reset the form or show a success message
        console.log('Event added successfully');
      } else {
        // Handle errors here
        console.error('Failed to add event');
      }
    } catch (error) {
      console.error('Error:', error);
    }
    
  // try {
  //   const userId = localStorage.getItem('userId');
  //   eventData.userId = userId;

  //   const response = await axios.post('/api/add-event', eventData, {
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   });

  //   if (response.status === 200) {
  //     // Handle a successful response here
  //     // For example, you can reset the form or show a success message
  //     console.log('Event added successfully');
  //   } else {
  //     // Handle errors here
  //     console.error('Failed to add event');
  //   }
  // } catch (error) {
  //   console.error('Error:', error);
  // }
  };

  return (
    <div>
      <h2>Add Event</h2>

      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={eventData.title}
            onChange={handleChange}
          />
        </label>
        <label>
          Date:
          <input
            type="date"
            name="date"
            value={eventData.date}
            onChange={handleChange}
          />
        </label>
        <label>
          Time:
          <input
            type="time"
            name="time"
            value={eventData.time}
            onChange={handleChange}
          />
        </label>
        <label>
          Daily (Number):
          <input
            type="text"
            name="daily"
            value={eventData.daily}
            onChange={handleChange}
          />
        </label>
        <label>
          Schedule (Number):
          <input
            type="text"
            name="schedule"
            value={eventData.schedule}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Add Event</button>
      </form>

      {/* Display and log the schedule breakdowns */}
      {/* {scheduleBreakdowns.length > 0 && (
        <div>
          <h3>Schedule Breakdowns</h3>
          <ul>
            {scheduleBreakdowns.map((breakdown, index) => (
              <li key={index}>{JSON.stringify(breakdown)}</li>
            ))}
          </ul>
        </div>
      )} */}
    </div>
  );
};

export default EventForm;
