import React, { useEffect } from "react";
import axios from 'axios';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import Backdrop from "./Backdrop";
import EventForm from "./EventForm";
import useUser from '../hooks/useUser';

const FullCalendarComponent = () => {
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [calendarEvents, setCalendarEvents] = React.useState([]);


  const { user} = useUser();

  useEffect(()=>{
    const fetchEvents = async () => {
      try {
          if (!user) {
              return;
          }
  
          const token = await user.getIdToken();
          const response = await axios.get('/api/schedule', {
              headers: { authtoken: token },
          });
  
          if (response.status === 200) {
              const data = response.data;
              console.log("data",data);
  
              const formattedEvents = [];
  
              Object.entries(data[0]).forEach(([dateString, tasks]) => {
                  const date = new Date(dateString);
                  tasks.forEach(task => {
                      let priorityClass = '';
                      if (task.priority === 'low') {
                          priorityClass = 'low-priority';
                      } else if (task.priority === 'medium') {
                          priorityClass = 'medium-priority';
                      } else if (task.priority === 'high') {
                          priorityClass = 'high-priority';
                      }
                      formattedEvents.push({
                          title: `${task.taskName} - ${task.hours} hr`,
                          start: date,
                          
                          end: date, // Assuming same as start for simplicity
                          classNames: [priorityClass]
                      });
                  });
              });
  
              console.log("formatted data:", formattedEvents);
              setCalendarEvents(formattedEvents);
          } else {
              setCalendarEvents([]);
              console.log("No schedule data found for the user");
          }
      } catch (error) {
          console.error('Error fetching events:', error);
      }
  };
  
  

    fetchEvents();
  }, [user]); // Run only once when component mounts

  


  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

const handleEventSubmit = async (eventData) => {
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
          eventRender={({ event, el }) => {
            el.classList.add(...event.classNames); // Adding priority-based class names
          }}
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