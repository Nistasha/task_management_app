import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import Backdrop from "./Backdrop";
import EventForm from "./EventForm";

const FullCalendarComponent = () => {
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [calendarEvents, setCalendarEvents] = React.useState([]);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

const handleEventSubmit = async (eventData) => {
   
      // Do something with the eventData, such as adding it to your events array
    console.log('Event Data:', eventData.scheduleBreakdown);

    // Generate schedule breakdown events
    if (eventData.scheduleBreakdown && eventData.scheduleBreakdown.length > 0) {
      const startDate = new Date(eventData.date);
      const scheduleEvents = eventData.scheduleBreakdown.map((breakdown, index) => ({
        title: `${eventData.title} - ${breakdown}`,
        date: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + index),
      }));
      setCalendarEvents((prevEvents) => [...prevEvents, ...scheduleEvents]);

      console.log(scheduleEvents);
    }

    // Close the modal
    closeModal(); 
  };

  const handleEventClick = (clickInfo) => {
    // Handle event click here
    alert(`Clicked on event: ${clickInfo.event.title}`);
  };

  return (
    <>
      <div>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin]}
          headerToolbar={{
            left: 'prev,next today myCustomButton',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          events={calendarEvents}
          customButtons={{
            myCustomButton: {
              text: 'Add event',
              click: () => {
                openModal();
              },
            },
          }}
          eventClick={handleEventClick} // Add eventClick callback
        />
      </div>
      {modalIsOpen && (
        <Backdrop>
          <div className="custom-modal">
            <button className="modalButton" onClick={closeModal}>
              Close Modal
            </button>
            <div className="date">
              <EventForm onEventSubmit={handleEventSubmit} />
            </div>
          </div>
        </Backdrop>
      )}
    </>
  );
};

export default FullCalendarComponent;