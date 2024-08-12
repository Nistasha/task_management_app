import React, { useEffect, useState } from "react";
import axios from 'axios';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import Backdrop from "./Backdrop";
import EventForm from "./EventForm";
import useUser from '../hooks/useUser';

const FullCalendarComponent = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        if (!user) {
          return;
        }
        const token = await user.getIdToken();
        const response = await axios.get(`/api/schedule`, {
          headers: { authtoken: token },
        });
        if (response.status >= 200 && response.status < 300) {
          const data = response.data;
          const formattedEvents = Object.entries(data).flatMap(([date, tasks]) =>
            tasks.map(task => ({
              title: task.taskName,
              start: date,
              allDay: true // Assuming tasks span entire day
            }))
          );
          setCalendarEvents(formattedEvents);
        } else {
          throw new Error('Failed to fetch events');
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, [user]);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const handleEventSubmit = async (eventData) => {
    // Do something with the eventData
    closeModal();
  };

  const handleEventClick = (clickInfo) => {
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
          eventClick={handleEventClick}
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
