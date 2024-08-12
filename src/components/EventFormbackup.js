import React, { useState } from 'react';
import axios from'axios';

const EventForm = ({ onEventSubmit }) => {
  const [eventData, setEventData] = useState({
    title: '',
    startDate: '',
    dueDate: '',
    estimatedCompletionTime: '',
    dailyProgress: '',
    priority: 'low',
    userId: 'yl7aqKuQ8wPmN5oWq8p4JntXGgh1',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/tasks', eventData);
      // If successful, call the onEventSubmit callback (if needed)
      onEventSubmit && onEventSubmit(eventData);
      // Reset the form after successful submission
      setEventData({
        title: '',
        startDate: '',
        dueDate: '',
        estimatedCompletionTime: '',
        dailyProgress: '',
        priority: 'low',
        userid: 'yl7aqKuQ8wPmN5oWq8p4JntXGgh1',
      });
    } catch (error) {
      console.error('Error adding event data:', error);
      // Handle error if needed
    }
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
          Start Date:
          <input
            type="date"
            name="startDate"
            value={eventData.startDate}
            onChange={handleChange}
          />
        </label>
        <label>
          Due Date:
          <input
            type="date"
            name="dueDate"
            value={eventData.dueDate}
            onChange={handleChange}
          />
        </label>
        <label>
          Estimated Completion Time (in hours):
          <input
            type="number"
            name="estimatedCompletionTime"
            value={eventData.estimatedCompletionTime}
            onChange={handleChange}
          />
        </label>
        <label>
          Daily Progress (in hours):
          <input
            type="number"
            name="dailyProgress"
            value={eventData.dailyProgress}
            onChange={handleChange}
          />
        </label>
        <label>
          Priority:
          <select
            name="priority"
            value={eventData.priority}
            onChange={handleChange}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </label>
        <button type="submit">Add Event</button>
      </form>
    </div>
  );
};

export default EventForm;
