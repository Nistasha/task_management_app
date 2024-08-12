import { useEffect, useState } from 'react';

const EventList = () => {
    const [events, setEvents] = useState([]);
    const userId = localStorage.getItem('userId'); // Retrieve the user ID

    useEffect(() => {
        // Fetch events for the logged-in user
        fetch(`/api/events/${userId}`)
            .then((response) => response.json())
            .then((data) => setEvents(data))
            .catch((error) => console.error('Error fetching events:', error));
    }, [userId]);

    return (
        <div>
            <h2>Your Events</h2>
            <ul>
                {events.map((event) => (
                    <li key={event._id}>
                        {event.eventName} - {event.eventDate}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EventList;
