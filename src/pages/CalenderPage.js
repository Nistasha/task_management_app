import React, { useState } from 'react';
import FullCalendarComponent from '../components/FullCalenderComponent';
import NavBar from '../NavBar';
//import EventList from '../components/EventList'; 
import EventForm from '../components/EventForm';
const CalenderPage = () => {

    const [events, setEvent] = useState([ // Example events data 
    { title: 'Event 2', date: '2024-02-02' },
    // Add more events as needed
  ]);

  const[showEventForm, setShowEventForm]=useState(false);
  
  const addEvent = (newEvent) => {
    setEvent([...events, newEvent]);
    setShowEventForm(false);
     // Pass the newEvent data to handleEventSubmit

  };

  
  return (
    <div className='container'>
      <NavBar />
      <FullCalendarComponent events={events} /> {/* Pass the events data to FullCalendarComponent */}
      {/* <EventList events={events} />  */}
      {showEventForm && <EventForm onEventSubmit={addEvent} />}
    </div>
  );
};
export default CalenderPage;  